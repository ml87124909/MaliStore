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
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        focus: true

    },
    onShow: function onShow() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        var shopInfo = wx.getStorageSync('__appShopInfo').shopInfo;
        _server2.default.get(_urls2.default.links[0].mluserinfo, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    amount: res.data,
                    payinfo: shopInfo
                });
            }
        });
    },
    bindSave: function bindSave(e) {
        var that = this;
        var phone = e.detail.value.phone;
        var amount = e.detail.value.amount;
        var token = wx.getStorageSync('__appUserInfo').token;
        //最小提现金额
        var paynum = that.data.payinfo.pay_min;
        if (amount == "" || amount * 1 < paynum) {
            wx.showConfirm({
                content: "\u63D0\u73B0\u91D1\u989D" + paynum + "\u5143\u8D77",
                showCancel: false,
                confirmColor: '#ffd305',
                confirmText: "\u91CD\u65B0\u8F93\u5165",
                success: function success(res) {}
            });
            return;
        }
        if (!phone) {
            wx.showConfirm({
                content: "\u4E3A\u4FBF\u4E8E\u60A8\u53CA\u65F6\u63D0\u73B0\uFF0C\u8BF7\u8F93\u5165\u60A8\u7684\u5FAE\u4FE1\u53F7\u6216\u8005\u624B\u673A\u53F7",
                showCancel: false,
                confirmColor: '#ffd305',
                confirmText: "\u6211\u77E5\u9053\u4E86",
                success: function success(res) {}
            });
            return;
        }
        _server2.default.get(_urls2.default.links[0].userpaypal, { token: token, money: amount, phone: phone }).then(function (res) {
            if (res.code == 0) {
                that.onShow();
                wx.showConfirm({
                    content: "\u7533\u8BF7\u63D0\u73B0\u6210\u529F\r\n\u8BF7\u7B49\u5F85\u8D22\u52A1\u5904\u7406",
                    showCancel: false,
                    confirmColor: '#ffd305',
                    confirmText: "\u6211\u77E5\u9053\u4E86",
                    success: function success(res) {}
                });
                that.setData({ money: '' });
            } else if (res.code == 100) {
                wx.showConfirm({
                    content: "\u8F93\u5165\u91D1\u989D\u8D85\u51FA\u53EF\u7528\u4F59\u989D",
                    showCancel: false,
                    confirmColor: '#ffd305',
                    confirmText: "\u91CD\u65B0\u8F93\u5165",
                    success: function success(res) {}
                });
                return;
            } else if (res.code == 701) {
                wx.showConfirm({
                    content: "\u60A8\u7684\u8D26\u6237\u5DF2\u7ECF\u88AB\u7981\u7528\uFF0C\u4E0D\u80FD\u7533\u8BF7\u63D0\u73B0\r\n\u5982\u6709\u7591\u95EE\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\u5DE5\u4F5C\u4EBA\u5458",
                    cancelColor: "#999999",
                    confirmColor: "#ffd305",
                    success: function success(res) {}
                });
                return;
            } else if (res.code == 702) {
                wx.showConfirm({
                    content: "\u7BA1\u7406\u5458\u672A\u5F00\u542F\u63D0\u73B0\u529F\u80FD\r\n\u5982\u6709\u7591\u95EE\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\u5DE5\u4F5C\u4EBA\u5458",
                    cancelColor: "#999999",
                    confirmColor: "#ffd305",
                    success: function success(res) {}
                });
                return;
            } else if (res.code == 703) {
                wx.showConfirm({
                    content: "\u60A8\u7684\u4F59\u989D\u5305\u542B\u8D60\u9001\u91D1\u989D\r\n\u8D60\u9001\u91D1\u989D\u90E8\u5206\u4E0D\u80FD\u63D0\u73B0",
                    cancelColor: "#999999",
                    confirmColor: "#ffd305",
                    success: function success(res) {}
                });
                return;
            }
        });
    },
    rechargeTap: function rechargeTap() {
        wx.navigateTo({
            url: "/pages/pages/user/paypal/recharge/recharge"
        });
    },
    paypalinfoTap: function paypalinfoTap() {
        wx.navigateTo({
            url: "/pages/pages/user/paypal/info/info?id=0"
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});