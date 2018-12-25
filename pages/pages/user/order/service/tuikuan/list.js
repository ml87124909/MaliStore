"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        WIN_HEIGHT: wx.DEFAULT_CONTENT_HEIGHT - wx.STATUS_BAR_HEIGHT - wx.DEFAULT_HEADER_HEIGHT + 20,
        current: 0,
        showMask: false
    },
    onLoad: function onLoad() {
        var that = this;
        that.getOrderList();
    },
    onShow: function onShow() {
        var that = this;
        that.getOrderList();
    },
    getOrderList: function getOrderList() {
        var that = this;
        var postData = {
            status: '2,4',
            token: wx.getStorageSync('__appUserInfo').token
        };
        _server2.default.get(_urls2.default.links[0].orderslist, postData).then(function (res) {
            if (res.code == 0) {
                that.setData({ orderList: res.data });
            } else {
                that.setData({ orderList: '' });
            }
        });
    },
    getDetailsTap: function getDetailsTap(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/pages/user/order/details/details?id=" + id
        });
    },
    getTuikuanTap: function getTuikuanTap(e) {
        var id = e.currentTarget.dataset.id;
        var tp = e.currentTarget.dataset.tp;
        if (tp == 2) {
            var text = '当前订单为待发货状态\r\n您可以先联系客服发货';
        } else if (tp == 4) {
            var text = '当前订单为待自提状态\r\n您可以随时去门店自提';
        }
        wx.showConfirm({
            content: text,
            cancelColor: "#999999",
            confirmColor: "#ffd305",
            confirmText: "\u4E0D\u9000\u6B3E\u4E86",
            cancelText: "\u7533\u8BF7\u9000\u6B3E",
            success: function success(res) {
                if (res.cancel) {
                    wx.navigateTo({
                        url: "/pages/pages/user/order/service/tuikuan/tuikuan?id=" + id
                    });
                }
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});