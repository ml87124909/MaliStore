"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

var _qrcode = require("../../../../../static/utils/qrcode.js");

var _qrcode2 = _interopRequireDefault(_qrcode);

var _qqmapWxJssdkMin = require("../../../../../static/map/qqmap-wx-jssdk.min.js");

var _qqmapWxJssdkMin2 = _interopRequireDefault(_qqmapWxJssdkMin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var qrcode;
exports.default = Page({
    data: {
        width: wx.WIN_WIDTH,
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        share: 0,
        showMask: false,
        fahuo: 0,
        tmpids:{},
        customStyle: {
            'background': 'rgba(51, 51, 51, 0.9)'
        }

    },
    onShow: function onShow() {
        var that = this;
        var id = that.data.id;
        that.orderDetailsTap(id);
    },
    accepttongzhi(e) {
        var that = this;
        let tmpids=that.data.tmpids
        //let evaluate_id=tmpids['evaluate_id']
        let complete_id=tmpids['complete_id']
        //console.log(evaluate_id,complete_id)
        wx.requestSubscribeMessage({
          //tmplIds: [evaluate_id,complete_id],
          tmplIds: [complete_id],
          success(res) { }
        })
      },
    onLoad: function onLoad(e) {
        var that = this;
        if (e.share) {
            that.setData({ share: 1 });
        }
        that.setData({ id: e.id });
        that.orderDetailsTap(e.id);
        _server2.default.get(_urls2.default.links[0].mlshopinfo, {}).then(function (res) {
            if (res.code == 0) {
                var shopInfo = res.data.shopInfo;
                that.setData({ shopInfo: shopInfo });
                if (shopInfo.order_type == 0) {
                    _server2.default.get(_urls2.default.links[0].mlgoodlist, {}).then(function (res) {
                        if (res.code == 0) {
                            that.setData({ sales: res.data });
                        }
                    });
                } else if (shopInfo.order_type == 1) {
                    _server2.default.get(_urls2.default.links[0].mlgoodlist, { status: 1 }).then(function (res) {
                        if (res.code == 0) {
                            that.setData({ sales: res.data });
                        }
                    });
                } else if (shopInfo.order_type == 2) {
                    that.setData({ sales: res.data.orderGoods });
                }
            }
        });
    },
    orderDetailsTap: function orderDetailsTap(e) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        wx.showLoading();
        _server2.default.get(_urls2.default.links[0].orderdetas, { token: token, id: e }).then(function (res) {
            //console.log(res);
            if (res.code == 0) {
                wx.hideLoading();
                that.setData({
                    orderDetails: res.data,
                    tmpids:res.data.TmplIds
                });
                if (res.data.shopinfo) {
                    wx.getLocation({
                        type: 'wgs84', // 默认wgs84
                        success: function success(gps) {
                            that.mapCTX = new _qqmapWxJssdkMin2.default({ key: _urls2.default.mapkey });
                            that.mapCTX.calculateDistance({
                                from: {
                                    latitude: res.data.shopinfo.longitude,
                                    longitude: res.data.shopinfo.latitude
                                },
                                to: [{
                                    location: {
                                        lat: gps.latitude,
                                        lng: gps.longitude
                                    }
                                }],
                                success: function success(ctx) {
                                    that.setData({ distance: ctx.result.elements[0].distance });
                                }
                            });
                        }
                    });
                }
                if (res.data.pick_number) {
                    qrcode = new _qrcode2.default('canvas', {
                        text: res.data.pick_number,
                        width: 150,
                        height: 150,
                        colorDark: "#27323f",
                        colorLight: "white",
                        correctLevel: _qrcode2.default.CorrectLevel.H
                    });
                }
            }
        });
    },
    getOrderCancelTap: function getOrderCancelTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        wx.showConfirm({
            content: "\u786E\u5B9A\u8981\u53D6\u6D88\u6B64\u5355\uFF1F",
            cancelColor: "#999999",
            confirmColor: "#ffd305",
            confirmText: "\u786E\u5B9A",
            cancelText: '取消',
            success: function success(res) {
                if (res.confirm) {
                    _server2.default.get(_urls2.default.links[0].ordercance, { token: token, id: id }).then(function (res) {
                        if (res.code == 0) {
                            wx.showToast({
                                title: '订单取消成功',
                                icon: 'success',
                                duration: 2000
                            });
                            that.orderDetailsTap(id);
                        }
                    });
                }
            }
        });
    },
    getLocationTap: function getLocationTap(e) {
        var that = this;
        var latitude = e.currentTarget.dataset.latitude;
        var longitude = e.currentTarget.dataset.longitude;
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            name: that.data.orderDetails.shopinfo.cname,
            address: that.data.orderDetails.shopinfo.address,
            scale: 18
        });
    },
    getCopyNmuber: function getCopyNmuber(e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.id,
            success: function success(res) {
                //内容已经复制
            }
        });
    },
    getFahuoTips: function getFahuoTips() {
        var that = this;
        var code = that.data.fahuo;
        if (code == 0) {
            wx.showToast({
                title: "\u63D0\u9192\u5546\u5BB6\u53D1\u8D27\u6210\u529F",
                icon: 'none',
                duration: 2000
            });
            that.setData({ fahuo: 1 });
        } else {
            wx.showToast({
                title: "\u60A8\u5DF2\u7ECF\u63D0\u9192\u8FC7\u5566\uFF5E",
                icon: 'none',
                duration: 2000
            });
        }
    },
    getCallTap: function getCallTap(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
        });
    },
    handleShowMask: function handleShowMask(e) {
        var that = this;
        var show = e.currentTarget.dataset.show;
        qrcode.makeCode(that.data.orderDetails.pick_number);
        that.setData({
            showMask: show
        });
    },
    getHomeTap: function getHomeTap() {
        wx.switchTab({
            url: "/pages/pages/home/home"
        });
    },
    toDetailsTap: function toDetailsTap(e) {
        wx.navigateTo({
            url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
        });
    },
    getPayOrderTap: function getPayOrderTap(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/pages/payorder/paypal/paypal?id=" + id
        });
    },
    getWuLiuTap: function getWuLiuTap(e) {
        var id = e.currentTarget.dataset.id;
        var name = e.currentTarget.dataset.name;
        wx.navigateTo({
            url: "/pages/pages/user/order/wuliu/wuliu?id=" + id + '&name=' + name
        });
    },
    geiPingjiaTap: function geiPingjiaTap(e) {
        var id = e.currentTarget.dataset.id;
        var kuaid = e.currentTarget.dataset.kuaid;
        if (kuaid) {
            wx.navigateTo({
                url: "/pages/pages/user/order/pingjia/pingjia?id=" + id + '&kid=' + kuaid
            });
        } else {
            wx.navigateTo({
                url: "/pages/pages/user/order/pingjia/pingjia?id=" + id
            });
        }
    },
    getReceivingTap: function getReceivingTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var kuaid = e.currentTarget.dataset.kuaid;
        var kname = e.currentTarget.dataset.kname;
        var token = wx.getStorageSync('__appUserInfo').token;
        wx.showConfirm({
            content: "\u786E\u5B9A\u5DF2\u7ECF\u6536\u5230\u8D27\uFF1F",
            cancelColor: "#999999",
            confirmColor: "#ffd305",
            confirmText: "\u786E\u5B9A",
            cancelText: '取消',
            success: function success(res) {
                if (res.confirm) {
                    _server2.default.get(_urls2.default.links[0].ordereceiv, { token: token, id: id, kuaname: kname, kuaid: kuaid }).then(function (res) {
                        console.log(res);
                        if (res.code == 0) {
                            wx.showToast({
                                title: '确认收货成功',
                                icon: 'success',
                                duration: 2000
                            });
                            that.orderDetailsTap(id);
                        }
                    });
                }
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});