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
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px'

    },
    onLoad: function onLoad() {
        var that = this;
        _server2.default.get(_urls2.default.links[0].mlshopinfo, {}).then(function (res) {
            if (res.code == 0) {
                that.setData({ shopInfo: res.data.shopInfo });
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});