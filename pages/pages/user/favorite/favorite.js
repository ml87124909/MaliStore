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
        favtime: {},
        goods: {}
    },
    onShow: function onShow() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].favorilist, { token: token }).then(function (res) {
            console.log(res);
            if (res.code == 0) {
                that.setData({ favoriteList: res.data });
            } else {
                that.setData({ favoriteList: '' });
            }
        });
    },
    goodsTap: function goodsTap(e) {
        wx.navigateTo({
            url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});