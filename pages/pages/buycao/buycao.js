"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

var _wxParse = require("../../../static/wxParse/wxParse.js");

var _wxParse2 = _interopRequireDefault(_wxParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        gettopbtn: false
    },
    onLoad: function onLoad(e) {
        var that = this;
        that.topicData(e.id);
    },
    topicData: function topicData(e) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (token) {
            var postData = {
                id: e,
                token: token
            };
        } else {
            var postData = {
                id: e
            };
        }
        _server2.default.get(_urls2.default.links[0].topiconten, postData).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    topice: res.data
                });
                _wxParse2.default.wxParse('content', 'html', res.data.content, that, 5);
            }
        });
    },
    addLikesTap: function addLikesTap() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (token) {
            _server2.default.get(_urls2.default.links[0].addtolikes, { id: that.data.topice.id, token: token }).then(function (res) {
                if (res.code == 0) {
                    wx.showToast({
                        title: '点赞成功',
                        icon: 'success',
                        duration: 2000
                    });
                    that.topicData(that.data.topice.id);
                }
            });
        }
    },
    delLikesTap: function delLikesTap() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (token) {
            _server2.default.get(_urls2.default.links[0].deltolikes, { id: that.data.topice.id, token: token }).then(function (res) {
                if (res.code == 0) {
                    wx.showToast({
                        title: '取消点赞成功',
                        icon: 'success',
                        duration: 2000
                    });
                    that.topicData(that.data.topice.id);
                }
            });
        }
    },
    onShareAppMessage: function onShareAppMessage() {
        var data = this.data.topice;
        return {
            title: data.title,
            path: '/pages/pages/buycao/buycao?id=' + data.id,
            imageUrl: data.pic,
            success: function success(res) {
                // 转发成功
            }
        };
    },
    //滚动到指定位置把标题置顶
    onPageScroll: function onPageScroll(t) {
        if (t.scrollTop >= 300) {
            this.setData({
                gettopbtn: true
            });
        } else {
            this.setData({
                gettopbtn: false
            });
        }
    },
    gettopTap: function gettopTap() {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        });
        this.setData({ gettopbtn: false });
    },
    gethomeTap: function gethomeTap() {
        wx.switchTab({
            url: "/pages/pages/home/home"
        });
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