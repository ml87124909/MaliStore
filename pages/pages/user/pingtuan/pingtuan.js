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
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px'

    },
    onShow: function onShow() {
        var that = this;
        that.pingTuanOrderList();
    },
    onLoad: function onLoad() {
        var that = this;
        that.pingTuanOrderList();
    },
    pingTuanOrderList: function pingTuanOrderList() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].orderslist, { ctype: 2, token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    orderList: res.data
                });
            }
        });
    },
    getOrderDelTap: function getOrderDelTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        wx.showConfirm({
            content: "\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\r\n\u786E\u5B9A\u8981\u5220\u9664\u6B64\u5355\uFF1F",
            cancelColor: "#999999",
            confirmColor: "#ffd305",
            confirmText: "\u786E\u5B9A",
            cancelText: '取消',
            success: function success(res) {
                if (res.confirm) {
                    _server2.default.get(_urls2.default.links[0].orderdelet, { token: token, id: id }).then(function (res) {
                        if (res.code == 0) {
                            wx.showToast({
                                title: '订单删除成功',
                                icon: 'success',
                                duration: 2000
                            });
                            that.pingTuanOrderList();
                        }
                    });
                }
            }
        });
    },
    getPingTuanTap: function getPingTuanTap(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/pages/goods/pingtuan?id=" + id
        });
    },
    getDetailsTap: function getDetailsTap(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/pages/user/order/details/details?id=" + id
        });
    },
    getPayOrderTap: function getPayOrderTap(e) {
        var id = e.currentTarget.dataset.id;
        wx.redirectTo({
            url: "/pages/pages/payorder/paypal/paypal?id=" + id + '&pt=2'
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});