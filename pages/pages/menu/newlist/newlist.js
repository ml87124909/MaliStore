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
        _server2.default.get(_urls2.default.links[0].newdagoods, {}).then(function (res) {
            console.log(res);
            if (res.code == 0) {
                that.setData({ historyList: res.data });
            } else {
                that.setData({ historyList: '' });
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