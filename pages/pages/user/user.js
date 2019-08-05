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
        amount: {
            score: 0
        },
        orderStatus: {
            nopaypal: 0,
            delivery: 0,
            receiving: 0,
            evaluate: 0,
            tuikuan: 0,
            shouhou: 0
        },
        noneLogin: false
    },
    onShow: function onShow() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (app.globalData.userinfo == 1e4) {
            that.setData({ noneLogin: true });
        } else {
            that.setData({ noneLogin: false });
            setTimeout(function () {
                if (app.globalData.userinfo == 1e4) {
                    that.setData({ noneLogin: true });
                }
            }, 1000);
        }
        if (token) {
            that.getorderstats();
        }
        wx.getStorage({
            key: '__shopCarInfo',
            success: function success(res) {
                if (res.data) {
                    if (res.data.shopNum > 0) {
                        wx.showTabBarRedDot({ index: 3 });
                    } else {
                        wx.removeTabBarBadge({ index: 3 });
                    }
                } else {
                    wx.removeTabBarBadge({ index: 3 });
                }
            }
        });
        if (token) {
            _server2.default.get(_urls2.default.links[0].mluserinfo, { token: token }).then(function (res) {
                if (res.code == 0) {
                    that.setData({
                        amount: res.data
                    });
                }
            });
        }
    },
    getorderstats: function getorderstats() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].orderstats, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({ orderStatus: res.data });
                if (res.data.nopaypal > 0) {
                    wx.showTabBarRedDot({ index: 4 });
                } else {
                    wx.removeTabBarBadge({ index: 4 });
                }
            }
        });
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
    shareProditTap: function shareProditTap() {
        wx.navigateTo({
            url: "/pages/pages/user/share/share"
        });
    },
    goorderlist: function goorderlist(e) {
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: "/pages/pages/user/order/order?id=" + index
        });
    }

});