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
        feedback: ["\u8BF7\u9009\u62E9\u53CD\u9988\u7C7B\u578B", "\u5546\u54C1\u76F8\u5173", "\u7269\u6D41\u72B6\u51B5", "\u5BA2\u6237\u670D\u52A1", "\u529F\u80FD\u5F02\u5E38", "\u4EA7\u54C1\u5EFA\u8BAE", "\u5176\u4ED6\u7C7B\u578B"],
        index: 0,
        confirm: false,
        phone: '',
        feedtext: ''
    },
    onLoad: function onLoad() {},
    bindPickerChange: function bindPickerChange(e) {
        var that = this;
        var data = that.data.feedback;
        that.setData({
            index: e.detail.value,
            fname: data[e.detail.value]
        });
    },
    feedbackText: function feedbackText(e) {
        this.setData({ feedtext: e.detail.value });
    },
    phoneNumber: function phoneNumber(e) {
        this.setData({ phone: e.detail.value });
    },
    getFeedBack: function getFeedBack() {
        var that = this;
        var arry = that.data.index;
        var feed = that.data.feedtext;
        var phon = that.data.phone;
        var name = that.data.fname;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (arry == 0) {
            wx.showToast({ title: "\u8BF7\u9009\u62E9\u53CD\u9988\u7C7B\u578B", icon: 'none' });
            return;
        }
        if (feed == '') {
            wx.showToast({ title: "\u8BF7\u8F93\u5165\u53CD\u9988\u5185\u5BB9", icon: 'none' });
            return;
        }
        _server2.default.get(_urls2.default.links[0].usfeedback, { token: token, type: name, text: feed, phone: phon }).then(function (res) {
            if (res.code == 0) {
                wx.showToast({ title: "\u611F\u8C22\u60A8\u7684\u53CD\u9988\uFF01", icon: 'none' });
                setTimeout(function () {
                    wx.navigateBack();
                }, 800);
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});