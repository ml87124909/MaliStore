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
            status: '5,6,7',
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
    getShouhouTap: function getShouhouTap(e) {
        var id = e.currentTarget.dataset.id;
        var tp = e.currentTarget.dataset.tp;
        if (tp == 5) {
            var text = '当前订单为待收货状态\r\n如未收到货物请联系客服';
        } else if (tp == 6 || tp == 7) {
            var text = '为了更高效的处理您的问题\r\n建议您直接联系客服工作人员';
        }
        wx.showConfirm({
            content: text,
            cancelColor: "#999999",
            confirmColor: "#ffd305",
            confirmText: "\u6211\u77E5\u9053\u4E86",
            cancelText: "\u7533\u8BF7\u552E\u540E",
            success: function success(res) {
                if (res.cancel) {
                    wx.navigateTo({
                        url: "/pages/pages/user/order/service/shouhou/goods/goods?id=" + id
                    });
                }
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});