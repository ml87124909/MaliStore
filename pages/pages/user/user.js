"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {},
    onLoad: function onLoad() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].mluserinfo, { token: token }).then(function (res) {
            console.log(res);
            if (res.code == 0) {
                that.setData({
                    amount: res.data
                });
            }
        });
    },
    shareProditTap: function shareProditTap() {
        wx.navigateTo({
            url: "/pages/pages/user/share/share"
        });
    },
    goorderlist: function goorderlist(e) {
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: "/pages/pages/user/order/order?id=" + index
        });
    }

});