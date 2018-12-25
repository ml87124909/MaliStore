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
        current: 0,
        tabStyle: {
            'flex': '0 0 80rpx'
        },
        activeTabStyle: {
            'color': '#ffd305',
            'border-bottom': '2rpx solid #ffd305'
        }
    },
    onLoad: function onLoad(e) {
        var that = this;
        that.getpaypalinfo(e.id);
        that.setData({ current: e.id });
    },
    getpaypalinfo: function getpaypalinfo(e) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].paypalinfo, { token: token, type: e }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    current: e,
                    paypalinfo: res.data
                });
            } else {
                that.setData({
                    current: e,
                    paypalinfo: ''
                });
            }
        });
    },
    handleChange: function handleChange(e) {
        var index = e.detail.index;
        this.setData({ current: index });
        this.getpaypalinfo(index);
    },
    handleContentChange: function handleContentChange(e) {
        var current = e.detail.current;
        this.setData({ current: current });
        this.getpaypalinfo(current);
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});