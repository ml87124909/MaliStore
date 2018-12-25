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
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        WIN_HEIGHT: wx.DEFAULT_CONTENT_HEIGHT - wx.STATUS_BAR_HEIGHT - wx.DEFAULT_HEADER_HEIGHT,
        current: 0
    },
    onLoad: function onLoad() {
        var that = this;
    },
    handleContentChange: function handleContentChange(e) {
        var current = e.detail.current;
        this.setData({
            current: current
        });
    },
    handleChange: function handleChange(e) {
        var btnIndex = e.target.dataset.index;
        var index = e.detail.index;
        this.data.current = index;
        this.setData({
            current: this.data.current
        });
        this.setData({
            current: this.data.current
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});