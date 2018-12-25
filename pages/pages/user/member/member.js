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
var wxpay = require('../../../../static/utils/pay.js');
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        goods: [],
        vipType: '付费升级',
        vipState: 0
    },
    onLoad: function onLoad() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].mlshopinfo, {}).then(function (res) {
            if (res.code == 0) {
                wx.setStorage({ key: '__appShopInfo', data: res.data });
                that.setData({
                    shopInfo: res.data,
                    vipType: res.data.shopInfo.vip_type
                });
                if (res.data.shopInfo.vip_type == '付费升级') {
                    that.setData({
                        vipPrice: res.data.vipInfo[0].vip_price
                    });
                } else {
                    that.setData({
                        vipInfoList: res.data.vipInfo
                    });
                }
            }
        });
        _server2.default.get(_urls2.default.links[0].mluserinfo, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    userInfo: res.data,
                    vipState: res.data.vip_state
                });
            }
        });
        _server2.default.get(_urls2.default.links[0].imgsbanner, { type: 'vip' }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    vipServeList: res.data,
                    vipListName: res.data[0].type_name
                });
            }
        });
        _server2.default.get(_urls2.default.links[0].mlgoodlist, { vip: 1 }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    vipGoods: res.data
                });
            }
        });
    },
    getVipTap: function getVipTap(e) {
        var id = e.currentTarget.dataset.id;
        var money = e.currentTarget.dataset.money;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].vipopaypal, { token: token, type: id }).then(function (res) {
            if (res.code == 0) {
                var nextAction = {
                    ctype: 1,
                    id: res.data.id
                };
                wxpay.wxpay(app, money, res.data.id, 2, nextAction);
            }
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