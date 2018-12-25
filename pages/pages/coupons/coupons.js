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
        width: wx.WIN_WIDTH,
        value: 0,
        tbObj3: {
            'position': 'absolute!important',
            'width': '4px',
            'height': '12px',
            'left': '12.5px',
            'top': '8px',
            'background-color': '#ed5565',
            'border': '0',
            'box-shadow': '0px 0px 0px',
            'z-index': '2'
        }
    },
    onLoad: function onLoad() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].couponlist, { token: token, type: 0 }).then(function (res) {
            if (res.code == 0) {
                that.setData({ coupons: res.data });
            }
        });
    },
    getCouponsTap: function getCouponsTap(e) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        var cupid = e.currentTarget.dataset.id;
        _server2.default.get(_urls2.default.links[0].getcoupons, { id: cupid, token: token }).then(function (res) {
            if (res.code == 0) {
                wx.showToast({ title: "\u4F18\u60E0\u5238\u9886\u53D6\u6210\u529F", icon: 'none' });
                that.onLoad();
                return;
            }
            if (res.code == 100) {
                wx.showToast({ title: "\u4F18\u60E0\u5238\u4E0D\u5B58\u5728", icon: 'none' });
                that.onLoad();
                return;
            }
            if (res.code == 200) {
                wx.showToast({ title: "\u4F18\u60E0\u5238\u53E3\u4EE4\u4E0D\u6B63\u786E", icon: 'none' });
                that.onLoad();
                return;
            }
            if (res.code == 300) {
                wx.showToast({ title: "\u60A8\u5DF2\u7ECF\u9886\u8FC7\u4E86", icon: 'none' });
                that.onLoad();
                return;
            }
            if (res.code == 301) {
                wx.showToast({ title: "\u4F18\u60E0\u5238\u5DF2\u7ECF\u9886\u5B8C", icon: 'none' });
                that.onLoad();
                return;
            }
            if (res.code == 302) {
                wx.showToast({ title: "\u53EF\u7528\u79EF\u5206\u4E0D\u8DB3", icon: 'none' });
                that.onLoad();
                return;
            }
            if (res.code == 900) {
                wx.showToast({ title: "\u8BF7\u767B\u5F55\u540E\u5728\u9886\u53D6", icon: 'none' });
                that.onLoad();
                return;
            }
        });
    },
    getMyCouponsTap: function getMyCouponsTap() {
        wx.navigateTo({
            url: "/pages/pages/user/coupon/coupon"
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});