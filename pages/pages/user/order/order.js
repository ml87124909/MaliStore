"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

var _qrcode = require("../../../../static/utils/qrcode.js");

var _qrcode2 = _interopRequireDefault(_qrcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var qrcode;
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        WIN_HEIGHT: wx.DEFAULT_CONTENT_HEIGHT - wx.DEFAULT_HEADER_HEIGHT + 20,
        current: 0,
        fahuo: 0,
        showMask: false,
        customStyle: {
            'background': 'rgba(51, 51, 51, 0.9)'
        }
    },
    onLoad: function onLoad(e) {
        var that = this;
        that.handleChangeBtn(e);
    },
    getOrderList: function getOrderList(e) {
        var that = this;
        wx.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
        var postData = {
            token: wx.getStorageSync('__appUserInfo').token
        };
        //全部订单
        if (e == 0) {
            postData.status = '-1,1,2,3,4,5,6,7';
        }
        //待付款
        if (e == 1) {
            postData.status = '1';
        }
        //待发货、部分发货
        if (e == 2) {
            postData.status = '2,3';
        }
        //待收货、待自提
        if (e == 3) {
            postData.status = '4,5';
        }
        //待评价
        if (e == 4) {
            postData.status = '6';
        }
        _server2.default.get(_urls2.default.links[0].orderslist, postData).then(function (res) {
            wx.hideLoading();
            if (res.code == 0) {
                that.setData({ orderList: res.data });
            } else {
                that.setData({ orderList: '' });
            }
        });
    },
    handleChangeBtn: function handleChangeBtn(e) {
        var btnIndex = e.id;
        this.data.current = btnIndex;
        this.setData({
            current: this.data.current
        });
        this.getOrderList(btnIndex);
    },
    handleContentChange: function handleContentChange(e) {
        var current = e.detail.current;
        this.setData({
            current: current
        });
        this.getOrderList(e.detail.current);
    },
    handleChange: function handleChange(e) {
        var btnIndex = e.target.dataset.index;
        var index = e.detail.index;
        this.data.current = index;
        this.setData({
            current: this.data.current
        });
        this.getOrderList(index);
    },
    bindtimeup: function bindtimeup(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        that.getOrderList(id);
    },
    getOrderCancelTap: function getOrderCancelTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var current = that.data.current;
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
                            that.getOrderList(current);
                        }
                    });
                }
            }
        });
    },
    getOrderDelTap: function getOrderDelTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        var current = that.data.current;
        wx.showConfirm({
            content: "\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\r\n\u786E\u5B9A\u8981\u5220\u9664\u6B64\u5355\uFF1F",
            cancelColor: "#999999",
            confirmColor: "#ffd305",
            confirmText: "\u786E\u5B9A",
            cancelText: '取消',
            success: function success(res) {
                if (res.confirm) {
                    _server2.default.get(_urls2.default.links[0].orderdelet, { token: token, id: id }).then(function (res) {
                        if (res.code == 0) {
                            wx.showToast({
                                title: '订单删除成功',
                                icon: 'success',
                                duration: 2000
                            });
                            that.getOrderList(current);
                        }
                    });
                }
            }
        });
    },
    handleShowMask: function handleShowMask(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var show = e.currentTarget.dataset.show;
        var status = e.currentTarget.dataset.status;
        if (id) {
            qrcode = new _qrcode2.default('canvas', {
                text: id,
                width: 150,
                height: 150,
                colorDark: "#27323f",
                colorLight: "white",
                correctLevel: _qrcode2.default.CorrectLevel.H
            });
            qrcode.makeCode(id);
            that.setData({ codeStatus: status });
        }
        that.setData({ showMask: show });
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
    getDetailsTap: function getDetailsTap(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/pages/user/order/details/details?id=" + id
        });
    },
    getPayOrderTap: function getPayOrderTap(e) {
        var id = e.currentTarget.dataset.id;
        wx.redirectTo({
            url: "/pages/pages/payorder/paypal/paypal?id=" + id
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});