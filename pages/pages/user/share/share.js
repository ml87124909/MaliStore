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
        current: 0,
        show_1: true,
        show_2: false

    },
    onLoad: function onLoad() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].userprofit, { token: token }).then(function (res) {
            console.log(res);
            if (res.code == 0) {
                that.setData({
                    profitInfo: res.data
                });
            }
        });
    },
    handleChange: function handleChange(e) {
        var index = e.detail.index;
        if (index) {
            this.setData({
                show_1: false,
                show_2: true
            });
        } else {
            this.setData({
                show_1: true,
                show_2: false
            });
        }
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});