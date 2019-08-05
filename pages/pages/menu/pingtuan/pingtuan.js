"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        swiperCurrent: 0,
        current: 0,
        show1: true,
        show2: false,
        tabStyle: {
            'color': '#999999 !important',
            'border-bottom': '1px solid #f5f5f5'
        },
        activeTabStyle: {
            'color': '#ffd305 !important',
            'border-bottom': '1px solid #ffd305'
        }
    },
    onLoad: function onLoad() {
        var that = this;
        _server2.default.get(_urls2.default.links[0].imgsbanner, { type: 'pingtuan' }).then(function (res) {
            if (res.code == 0) {
                that.setData({ pingtuan: res.data });
            }
        });
        that.pingTuanListTap();
    },
    pingTuanListTap: function pingTuanListTap(e) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].pingtuanls, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    pingtuanList: res.data
                });
            } else {
                that.setData({
                    pingtuanList: ''
                });
            }
        });
    },
    swiperChange: function swiperChange(e) {
        this.setData({
            swiperCurrent: e.detail.current
        });
    },
    handleChange: function handleChange(e) {
        var index = e.detail.index;
        if (index) {
            this.setData({
                show1: false,
                show2: true
            });
        } else {
            this.setData({
                show1: true,
                show2: false
            });
        }
        this.pingTuanListTap(index);
    },
    toDetailsTap: function toDetailsTap(e) {
        wx.navigateTo({
            url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
        });
    },
    tapBanner: function tapBanner(e) {
        if (e.currentTarget.dataset.id != 0) {
            wx.navigateTo({
                url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
            });
        }
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});