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
        noneLogin: false
    },
    onShow: function onShow() {
        var that = this;
        if (app.globalData.userinfo == 1e4) {
            that.setData({ noneLogin: true });
        } else {
            that.setData({ noneLogin: false });
            setTimeout(function () {
                if (app.globalData.userinfo == 1e4) {
                    that.setData({ noneLogin: true });
                }
            }, 1000);
        }
    },
    onLoad: function onLoad(e) {
        var that = this;
        that.setData({ name: e.name });
        that.getSearchGoods(e.name);
    },
    checklogin: function checklogin() {
        if (app.globalData.userinfo == 1e4) {
            wx.navigateTo({
                url: "/pages/pages/login/login"
            });
            return;
        } else {
            that.setData({ noneLogin: false });
        }
    },
    getSearchGoods: function getSearchGoods(e) {
        var that = this;
        _server2.default.get(_urls2.default.links[0].mlgoodlist, { search_key: e }).then(function (res) {
            if (res.code == 0) {
                wx.hideLoading();
                that.setData({ goods: res.data, name: e });
            } else {
                wx.hideLoading();
                that.setData({ goods: '', name: e });
            }
        });
    },
    searchData: function searchData(e) {
        var name = e.detail.value;
        this.setData({ name: name });
    },
    search: function search(e) {
        var that = this;
        var name = e.detail.value;
        var data = that.data.name;
        if (data == '') {
            wx.showToast({ title: "\u8BF7\u8F93\u5165\u5173\u952E\u8BCD", icon: 'none' });
            return;
        }
        if (name) {
            that.getSearchGoods(name);
        } else {
            that.getSearchGoods(data);
        }
    },
    delSearchTap: function delSearchTap() {
        var that = this;
        that.setData({ name: '' });
    },
    toDetailsTap: function toDetailsTap(e) {
        wx.navigateTo({
            url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});