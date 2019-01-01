"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        width: wx.WIN_WIDTH
    },
    onLoad: function onLoad() {
        var that = this;
        var shopInfo = wx.getStorageSync('__appShopInfo').shopInfo;
        that.setData({ shopInfo: shopInfo });
    },
    userlogin: function userlogin(e) {
        var that = this;
        var iv = e.detail.iv;
        var rawData = e.detail.rawData;
        var signature = e.detail.signature;
        var encryptedData = e.detail.encryptedData;
        wx.login({
            success: function success(wxs) {
                _server2.default.get(_urls2.default.links[0].wxregister, { iv: iv, code: wxs.code, rawData: rawData, signature: signature, encryptedData: encryptedData }).then(function (res) {
                    if (res.code != 0) {
                        wx.showConfirm({
                            content: "\u9700\u8981\u60A8\u7684\u6388\u6743\uFF0C\u624D\u80FD\u6B63\u5E38\u4F7F\u7528\u54E6\uFF5E",
                            showCancel: false,
                            confirmColor: '#ffd305',
                            confirmText: "\u91CD\u65B0\u6388\u6743",
                            success: function success(res) {}
                        });
                        return;
                    } else {
                        app.login();
                        wx.showToast({ title: "\u767B\u5F55\u6210\u529F", icon: 'success', mask: true });
                        app.globalData.userinfo = 0;
                        setTimeout(function () {
                            wx.navigateBack();
                        }, 800);
                    }
                });
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});