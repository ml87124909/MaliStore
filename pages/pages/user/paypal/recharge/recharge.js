"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
var wxpay = require('../../../../../static/utils/pay.js');
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px'

    },
    onLoad: function onLoad() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].usepaylist, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({ payList: res.data });
            }
        });
        if (wx.IPHONEX == 0) {
            that.setData({ iphonex: true });
        }
    },
    onShow: function onShow() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].mluserinfo, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({ amount: res.data });
            }
        });
    },
    bindSave: function bindSave(e) {
        var money = e.detail.value.money;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].usrecharge, { token: token, money: money }).then(function (res) {
            if (res.code == 0) {
                var nextAction = {
                    ctype: 5,
                    id: res.data.id,
                    ptype: 0
                };
                wxpay.wxpay(app, money, res.data.id, 3, nextAction);
            } else if (res.code == 701) {
                wx.showConfirm({
                    content: "\u7BA1\u7406\u5458\u672A\u5F00\u542F\u5145\u503C\u529F\u80FD\r\n\u5982\u6709\u7591\u95EE\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\u5DE5\u4F5C\u4EBA\u5458",
                    cancelColor: "#999999",
                    confirmColor: "#ffd305",
                    success: function success(res) {}
                });
                return;
            }
        });
    },
    getPaypalTap: function getPaypalTap(e) {
        var money = e.currentTarget.dataset.money;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].usrecharge, { token: token, money: money }).then(function (res) {
            if (res.code == 0) {
                var nextAction = {
                    ctype: 5,
                    id: res.data.id,
                    ptype: 0
                };
                wxpay.wxpay(app, money, res.data.id, 3, nextAction);
            } else if (res.code == 701) {
                wx.showConfirm({
                    content: "\u7BA1\u7406\u5458\u672A\u5F00\u542F\u5145\u503C\u529F\u80FD\r\n\u5982\u6709\u7591\u95EE\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\u5DE5\u4F5C\u4EBA\u5458",
                    cancelColor: "#999999",
                    confirmColor: "#ffd305",
                    success: function success(res) {}
                });
                return;
            }
        });
    },
    paypalinfoTap: function paypalinfoTap() {
        wx.navigateTo({
            url: "/pages/pages/user/paypal/info/info?id=1"
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});