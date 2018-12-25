"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        WIN_HEIGHT: wx.DEFAULT_CONTENT_HEIGHT - wx.STATUS_BAR_HEIGHT - wx.DEFAULT_HEADER_HEIGHT + 20

    },
    onLoad: function onLoad() {
        var that = this;
    },
    getDetailsTap: function getDetailsTap(e) {
        var url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});