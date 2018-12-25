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
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px'

    },
    onLoad: function onLoad(e) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        wx.showLoading({ title: "\u67E5\u8BE2\u4E2D..." });
        that.setData({ id: e.id, name: e.name });
        _server2.default.get(_urls2.default.links[0].wuliuinfos, { token: token, number: e.id }).then(function (res) {
            wx.hideLoading();
            if (res.code == 0) {
                if (res.data.State != 0) {
                    that.setData({ wuliuInfo: res.data.Traces });
                } else {
                    that.setData({ wuliuInfo: '' });
                }
            } else {
                that.setData({ wuliuInfo: '' });
            }
        });
    },
    getCopyNmuber: function getCopyNmuber(e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.id,
            success: function success(res) {
                //内容已经复制
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});