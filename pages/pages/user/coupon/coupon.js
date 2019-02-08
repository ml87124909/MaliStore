"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _utils = require("../../../modules/utils.js");

var _utils2 = _interopRequireDefault(_utils);

var _server = require("../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        current: 0,
        show_1: true,
        show_2: false,
        show_3: false,
        endtime: {},
        startime: {}
    },
    onLoad: function onLoad() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].mincoupons, { token: token, status: 0 }).then(function (res) {
            if (res.code == 0) {
                that.setData({ couponList: res.data });
            } else {
                that.setData({ couponList: '' });
            }
        });
    },
    handleChange: function handleChange(e) {
        var that = this;
        var index = e.detail.index;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (index == 0) {
            that.setData({
                show_1: true,
                show_2: false,
                show_3: false
            });
            _server2.default.get(_urls2.default.links[0].mincoupons, { token: token, status: index }).then(function (res) {
                if (res.code == 0) {
                    that.setData({ couponList: res.data });
                } else {
                    that.setData({ couponList: '' });
                }
            });
        }
        if (index == 1) {
            that.setData({
                show_1: false,
                show_2: true,
                show_3: false
            });
            _server2.default.get(_urls2.default.links[0].mincoupons, { token: token, status: index }).then(function (res) {
                if (res.code == 0) {
                    that.setData({ couponList: res.data });
                } else {
                    that.setData({ couponList: '' });
                }
            });
        }
        if (index == 2) {
            that.setData({
                show_1: false,
                show_2: false,
                show_3: true
            });
            _server2.default.get(_urls2.default.links[0].mincoupons, { token: token }).then(function (res) {
                if (res.code == 0) {
                    var couponList = [];
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].state == 2 || res.data[i].state == 3) {
                            couponList.push(res.data[i]);
                        }
                    }
                    that.setData({ couponList: couponList });
                }
            });
        }
    },
    formSubmit: function formSubmit(e) {
        var that = this;
        var code = e.detail.value.code;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].getcoupons, { token: token, key: code }).then(function (res) {
            if (res.code == 0) {
                wx.showToast({
                    title: "\u5151\u6362\u6210\u529F",
                    icon: 'success',
                    mask: true,
                    duration: 1000
                });
                that.onLoad();
            }
            if (res.code == 200) {
                wx.showConfirm({
                    content: "\u4F18\u60E0\u5238\u53E3\u4EE4\u4E0D\u6B63\u786E\r\n\u8BF7\u786E\u8BA4\u540E\u91CD\u65B0\u8F93\u5165",
                    showCancel: false,
                    confirmColor: '#ffd305',
                    confirmText: "\u6211\u77E5\u9053\u4E86",
                    success: function success(res) {}
                });
            }
            if (res.code == 300) {
                wx.showConfirm({
                    content: "\u60A8\u5DF2\u9886\u8FC7\u6B64\u4F18\u60E0\u5238\r\n\u4E0D\u80FD\u5728\u8FDB\u884C\u5151\u6362\u4E86",
                    showCancel: false,
                    confirmColor: '#ffd305',
                    confirmText: "\u6211\u77E5\u9053\u4E86",
                    success: function success(res) {}
                });
            }
            if (res.code == 301) {
                wx.showConfirm({
                    content: "\u4F18\u60E0\u5238\u5DF2\u7ECF\u9886\u5B8C\u4E86\r\n\u4E0B\u6B21\u8981\u65E9\u70B9\u6765\u54E6\uFF5E",
                    showCancel: false,
                    confirmColor: '#ffd305',
                    confirmText: "\u6211\u77E5\u9053\u4E86",
                    success: function success(res) {}
                });
            }
        });
    },
    getCouponsTap: function getCouponsTap() {
        wx.navigateTo({
            url: "/pages/pages/coupons/coupons"
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});