"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
var wxpay = require('../../../../static/utils/pay.js');
exports.default = Page({
    data: {
        width: wx.WIN_WIDTH,
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        numberStyle: {
            backgroundColor: '#27323f',
            color: '#fff',
            paddingLeft: '8rpx',
            paddingRight: '8rpx',
            marginLeft: '10rpx',
            marginRight: '10rpx',
            borderRadius: '4rpx',
            fontSize: '26rpx',
            minWidth: '60rpx',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: '60rpx'
        },
        share: 0,
        payType: 0,
        balance: 0,
        orderClose: 0,
        confirm: false,
        showMask: false,
        yuePay: false,
        daifuPay: false,
        wechatPay: true,
        customStyle: {
            'background': 'rgba(51, 51, 51, 0.9)'
        },
        shareText: "\u5E2E\u6211\u4ED8\u6B3E\u624D\u662F\u771F\u53CB\u8C0A",
        noneLogin: false
    },
    onShow: function onShow() {
        var that = this;
        if (app.globalData.userinfo == 1e4) {
            that.setData({ noneLogin: true });
            that.checklogin();
        } else {
            that.setData({ noneLogin: false });
            setTimeout(function () {
                if (app.globalData.userinfo == 1e4) {
                    that.setData({ noneLogin: true });
                    that.checklogin();
                }
            }, 1000);
            that.onLoad(that.data.StoData);
        }
    },
    onLoad: function onLoad(e) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        that.setData({ StoData: e });
        if (e.share) {
            that.setData({
                share: e.share
            });
        } else {
            _server2.default.get(_urls2.default.links[0].mluserinfo, { token: token }).then(function (res) {
                if (res.code == 0) {
                    that.setData({ balance: res.data.money });
                }
            });
        }
        if (e.pt) {
            that.setData({ ptype: e.pt });
        }
        if (token) {
            _server2.default.get(_urls2.default.links[0].ordepaypal, { token: token, number: e.id }).then(function (res) {
                console.log(res);
                if (res.code == 0) {
                    that.setData({
                        orderNumber: e.id,
                        oederPaypal: res.data,
                        orderMoney: res.data.money.toFixed(2),
                        payText: '微信支付 ¥' + res.data.money
                    });
                }
            });
        }
        if (wx.IPHONEX == 0) {
            that.setData({ iphonex: true });
        }
    },
    selectTap: function selectTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var money = that.data.orderMoney;
        var balance = that.data.balance;
        if (id == 1) {
            this.setData({
                payType: 0,
                wechatPay: true,
                daifuPay: false,
                yuePay: false,
                payText: '微信支付 ¥' + money
            });
        } else if (id == 2) {
            if (balance >= money) {
                that.setData({
                    payType: 1,
                    wechatPay: false,
                    daifuPay: false,
                    yuePay: true,
                    payText: '余额支付 ¥' + money
                });
            } else {
                var plusMoney = money - balance;
                var allsMoney = plusMoney.toFixed(2);
                that.setData({
                    payType: 2,
                    wechatPay: true,
                    daifuPay: false,
                    yuePay: true,
                    payText: '余额支付 ¥' + balance + '，微信支付 ¥' + allsMoney
                });
            }
        } else if (id == 3) {
            this.setData({
                payType: 3,
                wechatPay: false,
                daifuPay: true,
                yuePay: false,
                payText: '找微信好友代付'
            });
        }
    },
    getOrderPayTap: function getOrderPayTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var data = that.data.oederPaypal;
        var money = that.data.orderMoney;
        var ptype = that.data.ptype;
        if (ptype) {
            var ctype = 2;
        } else {
            var ctype = 0;
        }
        if (id == 0) {
            //微信支付
            var nextAction = {
                ctype: ctype,
                id: data.id,
                ptype: 0
            };
            if (ptype) {
                wxpay.wxpay(app, money, data.id, 4, nextAction);
            } else {
                wxpay.wxpay(app, money, data.id, 0, nextAction);
            }
        } else if (id == 1) {
            //余额支付
            var nextAction = {
                ctype: ctype,
                id: data.id,
                ptype: 1
            };
            if (ptype) {
                wxpay.wxpay(app, money, data.id, 4, nextAction);
            } else {
                wxpay.wxpay(app, money, data.id, 0, nextAction);
            }
        } else if (id == 2) {
            //微信+余额支付
            var nextAction = {
                ctype: ctype,
                id: data.id,
                ptype: 2
            };
            if (ptype) {
                wxpay.wxpay(app, money, data.id, 4, nextAction);
            } else {
                wxpay.wxpay(app, money, data.id, 0, nextAction);
            }
        } else if (id == 3) {
            //微信好友代付
            that.setData({
                showMask: true
            });
        }
    },
    checklogin: function checklogin() {
        if (app.globalData.userinfo == 1e4) {
            wx.navigateTo({
                url: "/pages/pages/login/login"
            });
            return;
        } else {
            that.setData({ noneLogin: false });
        }
    },
    bindtimeup: function bindtimeup() {
        var that = this;
        that.setData({ orderClose: 1 });
    },
    getHomeTap: function getHomeTap() {
        wx.switchTab({
            url: "/pages/pages/home/home"
        });
    },
    getOrderTap: function getOrderTap() {
        wx.redirectTo({
            url: "/pages/pages/user/order/order?id=0"
        });
    },
    shareInputText: function shareInputText(e) {
        var that = this;
        that.setData({
            shareText: e.detail.value
        });
    },
    toPayTap: function toPayTap(e) {
        var number = e.currentTarget.dataset.id;
        var money = e.currentTarget.dataset.money;
        var nextAction = {
            ctype: 0,
            id: number
        };
        wxpay.wxpay(app, money, number, 0, nextAction);
    },
    toUserPayTap: function toUserPayTap(e) {
        var that = this;
        var number = e.currentTarget.dataset.id;
        var money = e.currentTarget.dataset.money;
        var ptype = that.data.ptype;

        if (ptype) {
            var ctype = 2;
        } else {
            var ctype = 0;
        }
        var nextAction = {
            ctype: ctype,
            id: number,
            ptype: 0
        };
        if (ptype) {
            wxpay.wxpay(app, money, number, 4, nextAction);
        } else {
            wxpay.wxpay(app, money, number, 1, nextAction);
        }
    },
    onShareAppMessage: function onShareAppMessage(res) {
        var that = this;
        var share = that.data.share;
        var ptype = that.data.ptype;
        var shopInfo = wx.getStorageSync('__appShopInfo').shopInfo;
        that.setData({ showMask: false });
        if (res.from === 'button') {
            if (share == 0) {
                if (ptype) {
                    return {
                        title: that.data.shareText,
                        path: '/pages/pages/payorder/paypal/paypal?id=' + that.data.orderNumber + '&share=1&pt=2',
                        imageUrl: that.data.oederPaypal.orderGoods[0].pic
                    };
                } else {
                    return {
                        title: that.data.shareText,
                        path: '/pages/pages/payorder/paypal/paypal?id=' + that.data.orderNumber + '&share=1',
                        imageUrl: that.data.oederPaypal.orderGoods[0].pic
                    };
                }
            } else {
                return {
                    title: shopInfo.sname,
                    path: '/pages/pages/home/home',
                    imageUrl: shopInfo.spic
                };
            }
        } else {
            return {
                title: shopInfo.sname,
                path: '/pages/pages/home/home',
                imageUrl: shopInfo.spic
            };
        }
    },
    handleShowMask: function handleShowMask(e) {
        var show = e.currentTarget.dataset.show;
        this.setData({
            showMask: show
        });
    },
    navigateBack: function navigateBack() {
        wx.showConfirm({
            content: "\u5546\u54C1\u4E00\u65E6\u9519\u8FC7\u5C31\u4E0D\u5B58\u5728\u4E86~\r\n\u8BA2\u5355\u4F1A\u4E3A\u60A8\u4FDD\u7559\u4E00\u6BB5\u65F6\u95F4\uFF0C\u8BF7\u5C3D\u5FEB\u652F\u4ED8",
            cancelColor: "#999999",
            confirmColor: "#ffd305",
            confirmText: "\u7EE7\u7EED\u652F\u4ED8",
            cancelText: "\u786E\u8BA4\u79BB\u5F00",
            success: function success(res) {
                if (res.confirm) {
                    //继续支付
                } else {
                    wx.navigateBack();
                }
            }
        });
    }

});