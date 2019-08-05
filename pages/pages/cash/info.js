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
    data: {},
    onLoad: function onLoad(e) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (e.pid) {
            var postData = {
                orderid: e.pid,
                token: token
            };
        }
        if (e.pkey) {
            var postData = {
                paykey: e.pkey,
                token: token
            };
        }
        _server2.default.get(_urls2.default.links[0].paypalinfo, postData).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    cashInfo: res.data
                });
            }
        });
    },
    getHomeTap: function getHomeTap() {
        wx.switchTab({
            url: "/pages/pages/home/home"
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }

});