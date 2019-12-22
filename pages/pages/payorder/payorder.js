"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = require('../../../config.js');

var _config2 = _interopRequireDefault(_config);

var mendian_type = _config2.default.mendian_type;

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

var _qqmapWxJssdkMin = require("../../../static/map/qqmap-wx-jssdk.min.js");

var _qqmapWxJssdkMin2 = _interopRequireDefault(_qqmapWxJssdkMin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        yuepay: [{ key: 'yve', value: "\u4F7F\u7528\u4F59\u989D\u8FDB\u884C\u652F\u4ED8" }],
        goodsList: [],
        yveState: true,
        yveMoney: false,
        confirm: false,
        //isNeedLogistics: 0, 
        allGoodsPrice: 0,
        yunPrice: 0,
        allGoodsAndYunPrice: 0,
        goodsJsonStr: "",
        orderType: "",
        hasNoCoupons: false,
        coupons: [],
        couponsMoney: 0,
        mapCTX: null,
        coupon_id: null,
        mendian_id: null,
        couponstype: null,
        shopsName: '请选择自提门店',
        couponsName: '请选择优惠券',
        wuLiuName: "\u8BF7\u9009\u62E9\u914D\u9001\u65B9\u5F0F"
    },
    onShow: function onShow() {
        var that = this;
        var shopList = [];
        if (that.data.orderType == 'buyNow') {
            var buyNowInfoMem = wx.getStorageSync('__buyNowInfo');
            if (buyNowInfoMem && buyNowInfoMem.shopList) {
                shopList = buyNowInfoMem.shopList;
            }
        } else {
            var shopCarInfoMem = wx.getStorageSync('__shopCarInfo');
            if (shopCarInfoMem && shopCarInfoMem.shopList) {
                shopList = shopCarInfoMem.shopList.filter(function (entity) {
                    return entity.active;
                });
            }
        }
        that.setData({ goodsList: shopList });
        that.initShippingAddress();
    },
    onLoad: function onLoad(e) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (e.orderType) {
            that.setData({ orderType: e.orderType });
        }
        if (e.ktid) {
            that.setData({
                ktid: e.ktid,
                ktype: e.ktype
            });
        }
        if (wx.IPHONEX == 0) {
            that.setData({ iphonex: true });
        }
        that.zitiShippingList();
    },
    zitiShippingList: function zitiShippingList() {
        var that = this;
        //获取商铺列表
        _server2.default.get(_urls2.default.links[0].mlshopslis, {}).then(function (res) {
            if (res.code == 0) {
                that.setData({ shopsList: res.data });
                if (_urls2.default.mapkey) {
                    wx.getLocation({
                        type: 'wgs84', // 默认wgs84
                        success: function success(gps) {
                            var distance = [];
                            for (var i = 0; i < res.data.length; i++) {
                                that.mapCTX = new _qqmapWxJssdkMin2.default({ key: _urls2.default.mapkey });
                                that.mapCTX.calculateDistance({
                                    from: {
                                        latitude: res.data[i].longitude,
                                        longitude: res.data[i].latitude
                                    },
                                    to: [{
                                        location: {
                                            lat: gps.latitude,
                                            lng: gps.longitude
                                        }
                                    }],
                                    success: function success(ctx) {
                                        distance.push(ctx.result.elements[0].distance);
                                        that.setData({ distance: distance });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    initShippingAddress: function initShippingAddress() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        //获取用户默认地址信息
        _server2.default.get(_urls2.default.links[0].addreslist, { token: token, default: 1 }).then(function (res) {
            if (res.code == 0) {
                that.setData({ curAddressData: res.data[0] });
            } else {
                that.setData({ curAddressData: false });
            }
        });
        //获取店铺物流方式
        _server2.default.get(_urls2.default.links[0].porderlist, {}).then(function (res) {
            if (res.code == 0) {
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].default == '1') {
                        res.data[i].checked = true;
                        that.setData({
                            wuLiuName: res.data[i].value,
                            inlineDescListKey: res.data[i].key
                        });
                    }
                }
                that.setData({
                    inlineDescList: res.data
                });
                that.processYunfei();
            }
        });
    },
    processYunfei: function processYunfei() {
        var that = this;
        var goodsList = this.data.goodsList;
        var goodsJsonStr = "[";
        //var isNeedLogistics = 0;
        var allGoodsPrice = 0;
        for (var i = 0; i < goodsList.length; i++) {
            var carShopBean = goodsList[i];
            if (carShopBean.logistics) {
                //isNeedLogistics = 1;
            }
            allGoodsPrice += carShopBean.goods_price * carShopBean.buy_number;
            var goodsJsonStrTmp = '';
            if (i > 0) {
                goodsJsonStrTmp = ",";
            }
            var inviter_id = 0;
            if (carShopBean.inviter_user) {
                goodsJsonStrTmp += '{"goods_id":' + carShopBean.goods_id + ',"buy_number":' + carShopBean.buy_number + ',"goods_childs":"' + carShopBean.goods_childs + '","inviter_user":' + carShopBean.inviter_user + '}';
            } else {
                goodsJsonStrTmp += '{"goods_id":' + carShopBean.goods_id + ',"buy_number":' + carShopBean.buy_number + ',"goods_childs":"' + carShopBean.goods_childs + '","inviter_user":0 }';
            }
            goodsJsonStr += goodsJsonStrTmp;
        }
        goodsJsonStr += "]";
        that.setData({
            //isNeedLogistics: isNeedLogistics,
            goodsJsonStr: goodsJsonStr
        });
        setTimeout(function () {
            that.createOrder();
        }, 500);
    },
    createOrder: function createOrder(e) {
        var that = this;
        var userid = wx.getStorageSync('__appInviter');
        var loginToken = wx.getStorageSync('__appUserInfo').token;
        var remark = "";
        if (e) {
            remark = e.detail.value.remark;
        }
        var postData = {
            viewid: 'home',
            part: 'order_create',
            token: loginToken,
            goodsJsonStr: that.data.goodsJsonStr,
            kuaid: that.data.inlineDescListKey,
            coupon_id: that.data.coupon_id,
            remark: remark
        };
        //上门自提 & 无须配送
        if (that.data.inlineDescListKey >= 1) {
            if (!that.data.curAddressData) {
                wx.showConfirm({
                    content: "\u8BF7\u5148\u8BBE\u7F6E\u60A8\u7684\u8054\u7CFB\u4FE1\u606F\uFF01",
                    cancelColor: "#999999",
                    confirmColor: "#ffd305",
                    confirmText: "\u7ACB\u5373\u8BBE\u7F6E",
                    cancelText: "\u7A0D\u540E\u8BBE\u7F6E",
                    success: function success(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: "/pages/pages/user/address/address"
                            });
                        }
                    }
                });
                return;
            }
            //收货人姓名
            postData.name = that.data.curAddressData.name;
            //收货人手机/电话
            postData.phone = that.data.curAddressData.phone;
        }
        //快递配送
        if (that.data.inlineDescListKey == 0) {
            if (!that.data.curAddressData) {
                wx.showConfirm({
                    content: "\u8BF7\u5148\u8BBE\u7F6E\u60A8\u7684\u6536\u8D27\u5730\u5740\uFF01",
                    cancelColor: "#999999",
                    confirmColor: "#ffd305",
                    confirmText: "\u7ACB\u5373\u8BBE\u7F6E",
                    cancelText: "\u7A0D\u540E\u8BBE\u7F6E",
                    success: function success(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: "/pages/pages/user/address/address"
                            });
                        }
                    }
                });
                return;
            }
            //收货人姓名
            postData.name = that.data.curAddressData.name;
            //收货人手机/电话
            postData.phone = that.data.curAddressData.phone;
            //收货人省
            postData.province = that.data.curAddressData.province;
            //收货人市
            postData.city = that.data.curAddressData.city;
            //收货人区
            if (that.data.curAddressData.district) {
                postData.district = that.data.curAddressData.district;
            }
            //收货人街道地址
            postData.address = that.data.curAddressData.address;
            //收货人邮编
            if (that.data.curAddressData.code) {
                postData.code = that.data.curAddressData.code;
            }
        }
        //上门自提，选择门店
        if (e && that.data.inlineDescListKey == 1 && that.data.mendian_id == null) {
            wx.showConfirm({
                content: "\u4E0A\u95E8\u81EA\u63D0\u9700\u8981\u9009\u62E9\u95E8\u5E97\r\n\u8BF7\u9009\u62E9\u60A8\u5C31\u8FD1\u7684\u81EA\u63D0\u95E8\u5E97",
                cancelColor: "#999999",
                confirmColor: "#ffd305",
                confirmText: "\u6211\u77E5\u9053\u4E86",
                showCancel: false,
                success: function success(res) {
                    if (res.confirm) {}
                }
            });
            return;
        } else {
            //////////////////////////自提增加地址start
          if (mendian_type==1){
            if (!that.data.curAddressData) {
              wx.showConfirm({
                content: "\u8BF7\u5148\u8BBE\u7F6E\u60A8\u7684\u6536\u8D27\u5730\u5740\uFF01",
                cancelColor: "#999999",
                confirmColor: "#ffd305",
                confirmText: "\u7ACB\u5373\u8BBE\u7F6E",
                cancelText: "\u7A0D\u540E\u8BBE\u7F6E",
                success: function success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: "/pages/pages/user/address/address"
                    });
                  }
                }
              });
              return;
            }
            //收货人姓名
            postData.name = that.data.curAddressData.name;
            //收货人手机/电话
            postData.phone = that.data.curAddressData.phone;
            //收货人省
            postData.province = that.data.curAddressData.province;
            //收货人市
            postData.city = that.data.curAddressData.city;
            //收货人区
            if (that.data.curAddressData.district) {
              postData.district = that.data.curAddressData.district;
            }
            //收货人街道地址
            postData.address = that.data.curAddressData.address;
            //收货人邮编
            if (that.data.curAddressData.code) {
              postData.code = that.data.curAddressData.code;
            }
          }
            
            ////////////////////////////// 自提增加地址end
            postData.mendian_id = that.data.mendian_id;
        }
        if (that.data.coupon_id != 0) {
            postData.coupon_id = that.data.coupon_id;
        } else {
            postData.coupon_id = null;
        }
        if (!e) {
            postData.calculate = 1;
        } else {
            postData.formId = e.detail.formId;
        }
        if (that.data.ktype == 0) {
            //开团订单
            postData.ctype = 2;
            postData.ptype = 0;
            postData.ptkid = that.data.ktid;
        } else if (that.data.ktype == 1) {
            //参团订单
            postData.ctype = 2;
            postData.ptype = 1;
            postData.ptkid = that.data.ktid;
        } else {
            //普通订单
            postData.ctype = 0;
        }
        _server2.default.post(_urls2.default.links[0].ordecreate, postData).then(function (res) {
          
          if (res.code != 0) {
            wx.showConfirm({
              content: res.msg,
              cancelColor: "#999999",
              confirmColor: "#ffd305",
              success: function success(res) { }
            });
            return;
          }
            /*if (res.code == 701) {
                wx.showConfirm({
                    content: "\u60A8\u7684\u8D26\u6237\u5DF2\u7ECF\u88AB\u7981\u7528\uFF0C\u4E0D\u80FD\u521B\u5EFA\u8BA2\u5355\r\n\u5982\u6709\u7591\u95EE\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\u5DE5\u4F5C\u4EBA\u5458",
                    cancelColor: "#999999",
                    confirmColor: "#ffd305",
                    success: function success(res) {}
                });
                return;
            }
            if (res.code == 307) {
                wx.showConfirm({
                    content: "\u5DF2\u6709\u672A\u5B8C\u6210\u7684\u62FC\u56E2\u8BA2\u5355\uFF0C\u8BF7\u7EE7\u7EED\u4E4B\u524D\u7684\u62FC\u56E2",
                    cancelColor: "#999999",
                    confirmColor: "#ffd305",
                    success: function success(res) {}
                });
                return;
            }*/
            if (res.code == 0) {
                if (e && "buyNow" != that.data.orderType) {
                    wx.removeStorageSync('__shopCarInfo');
                }
                if (!e) {
                    that.setData({
                        allGoodsPrice: res.data.goods_price,
                        allGoodsAndYunPrice: res.data.total,
                        yunPrice: res.data.yunfei_price,
                        VipGoodsPrice: res.data.vip_price,
                        VipGoodsAndYunPrice: res.data.vip_total,
                        ViplevelName: res.data.vip_level_name,
                        VipSale: res.data.vip_sale,
                        VipState: res.data.vip_state,
                        VipSmallMoney: res.data.vip_small,
                        allMoney: res.data.money,
                        orderfrom: res.data
                    });
                    that.getMyCoupons();
                    return;
                }
                if (_urls2.default.stypes == 'B') {
                    if (e && userid) {
                        wx.removeStorageSync('__appInviter');
                    }
                }
                if (that.data.ktype) {
                    wx.redirectTo({
                        url: "/pages/pages/payorder/paypal/paypal?id=" + res.data.order_number + '&pt=2'
                    });
                    return;
                }
                wx.redirectTo({
                    url: "/pages/pages/payorder/paypal/paypal?id=" + res.data.order_number
                });
            }
        });
    },
    getMyCoupons: function getMyCoupons() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].ordercoups, { token: token, goodsJsonStr: that.data.goodsJsonStr }).then(function (res) {
            if (res.code == 0) {
                var coupons = res.json.filter(function (entity) {
                    return entity.max_money <= that.data.allGoodsPrice;
                });
                if (coupons.length > 0) {
                    that.setData({
                        hasNoCoupons: true,
                        coupons: coupons
                    });
                }
            }
        });
    },
    radioChange: function radioChange(e) {
        var that = this;
        var val = e.detail.value;
        var list = that.data.inlineDescList;
        for (var i = 0; i < list.length; i++) {
            if (list[i].key == val[0]) {
                that.setData({
                    wuLiuName: list[i].value,
                    inlineDescListKey: list[i].key
                });
            }
        }
        that.createOrder();
    },
    bindChangeShops: function bindChangeShops(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var name = e.currentTarget.dataset.name;
        that.setData({
            shopsName: name,
            mendian_id: id
        });
    },
    bindCancelShops: function bindCancelShops() {
        var that = this;
        that.setData({
            shopsName: '请选择自提门店',
            mendian_id: null
        });
    },
    bindChangeCoupon: function bindChangeCoupon(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var type = e.currentTarget.dataset.type;
        var name = e.currentTarget.dataset.name;
        var money = e.currentTarget.dataset.money;
        that.setData({
            couponsName: name,
            coupon_id: id,
            couponsMoney: money,
            couponstype: type
        });
        that.createOrder();
    },
    bindCancelCoupon: function bindCancelCoupon() {
        var that = this;
        that.setData({
            couponsName: '请选择优惠券',
            coupon_id: null,
            couponstype: null,
            couponsMoney: 0
        });
        that.createOrder();
    },
    formCouponsAdd: function formCouponsAdd(e) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        var number = e.detail.value.number;
        if (!number) {
            wx.showModal({
                content: '如有优惠码，请输入',
                showCancel: false
            });
            return;
        }
        _server2.default.get(_urls2.default.links[0].getcoupons, { token: token, key: number }).then(function (res) {
            if (res.code == 0) {
                wx.showToast({
                    title: "\u5151\u6362\u6210\u529F",
                    icon: 'success',
                    mask: true,
                    duration: 1000
                });
                self.setData({ cValue: '' });
                that.getMyCoupons();
            }
            if (res.code == 200) {
                wx.showConfirm({
                    content: "\u4F18\u60E0\u5238\u53E3\u4EE4\u4E0D\u6B63\u786E\r\n\u8BF7\u786E\u8BA4\u540E\u91CD\u65B0\u8F93\u5165",
                    showCancel: false,
                    confirmColor: '#ffd305',
                    confirmText: "\u6211\u77E5\u9053\u4E86"
                });
            }
            if (res.code == 300) {
                wx.showConfirm({
                    content: "\u60A8\u5DF2\u9886\u8FC7\u6B64\u4F18\u60E0\u5238\r\n\u4E0D\u80FD\u5728\u8FDB\u884C\u5151\u6362\u4E86",
                    showCancel: false,
                    confirmColor: '#ffd305',
                    confirmText: "\u6211\u77E5\u9053\u4E86"
                });
            }
            if (res.code == 301) {
                wx.showConfirm({
                    content: "\u4F18\u60E0\u5238\u5DF2\u7ECF\u9886\u5B8C\u4E86\r\n\u4E0B\u6B21\u8981\u65E9\u70B9\u6765\u54E6\uFF5E",
                    showCancel: false,
                    confirmColor: '#ffd305',
                    confirmText: "\u6211\u77E5\u9053\u4E86"
                });
            }
        });
    },
    getPayPalTap: function getPayPalTap() {
        wx.navigateTo({
            url: "/pages/pages/user/paypal/paypal"
        });
    },
    getAddressTap: function getAddressTap() {
        wx.navigateTo({
            url: "/pages/pages/user/address/address"
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});