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
        _server2.default.get(_urls2.default.links[0].categoryls, {}).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    categoryList: res.data
                });
                that.topicListData(res.data[0].id);
            }
        });
    },
    getTopicListTap: function getTopicListTap(e) {
        this.topicListData(e.currentTarget.dataset.id);
    },
    topicListData: function topicListData(e) {
        var that = this;
        _server2.default.get(_urls2.default.links[0].topiclists, { id: e }).then(function (res) {
            if (res.code == 0) {
                that.setData({ topicList: res.data });
            } else {
                that.setData({ topicList: '' });
            }
        });
    },
    getTopiceTap: function getTopiceTap(e) {
        wx.navigateTo({
            url: "/pages/pages/buycao/buycao?id=" + e.currentTarget.dataset.id
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});