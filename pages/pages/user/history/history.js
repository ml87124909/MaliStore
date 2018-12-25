"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {
        STI_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        scrollTop: 0
    },
    onShow: function onShow() {
        var that = this;
        that.getHistoryList();
    },
    getHistoryList: function getHistoryList() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].historylis, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({ historyList: res.data });
            } else {
                that.setData({ historyList: '' });
            }
        });
    },
    getHistoryDateTap: function getHistoryDateTap(e) {
        var that = this;
        var date = e.currentTarget.dataset.date;
        var token = wx.getStorageSync('__appUserInfo').token;
        wx.showConfirm({
            content: "\u5C06\u8981\u5220\u9664" + date + "\u7684\u6D4F\u89C8\u8BB0\u5F55",
            cancelColor: "#999999",
            confirmColor: "#ffd305",
            confirmText: "\u786E\u5B9A\u5220\u9664",
            success: function success(res) {
                if (res.confirm) {
                    _server2.default.get(_urls2.default.links[0].historydel, { token: token, date: date }).then(function (res) {
                        if (res.code == 0) {
                            wx.showToast({
                                title: "\u5220\u9664\u6210\u529F",
                                icon: 'success',
                                duration: 1500
                            });
                            that.getHistoryList();
                        }
                    });
                }
            }
        });
    },
    getHistoryGoodsTap: function getHistoryGoodsTap(e) {
        var that = this;
        var date = e.currentTarget.dataset.date;
        var gdid = e.currentTarget.dataset.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        console.log(date, gdid);
        wx.showConfirm({
            content: "\u786E\u5B9A\u8981\u5220\u9664\u8BE5\u6761\u6D4F\u89C8\u8BB0\u5F55\u5417\uFF1F",
            cancelColor: "#999999",
            confirmColor: "#ffd305",
            confirmText: "\u786E\u5B9A\u5220\u9664",
            success: function success(res) {
                if (res.confirm) {
                    _server2.default.get(_urls2.default.links[0].historydel, { token: token, date: date, goods_id: gdid }).then(function (res) {
                        if (res.code == 0) {
                            wx.showToast({
                                title: "\u5220\u9664\u6210\u529F",
                                icon: 'success',
                                duration: 1500
                            });
                            that.getHistoryList();
                        }
                    });
                }
            }
        });
    },
    toDetailsTap: function toDetailsTap(e) {
        wx.navigateTo({
            url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
        });
    },
    onPageScroll: function onPageScroll(e) {
        this.setData({
            scrollTop: e.scrollTop
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});