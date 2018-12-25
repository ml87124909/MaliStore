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
        showMask: false,
        makeMask: false
    },
    onLoad: function onLoad() {
        var that = this;
        var shop = wx.getStorageSync('__appShopInfo');
        that.setData({ shopInfo: shop.shopInfo });
        that.getOrderList();
    },
    getOrderList: function getOrderList() {
        var that = this;
        var postData = {
            token: wx.getStorageSync('__appUserInfo').token
        };
        _server2.default.get(_urls2.default.links[0].exorderlis, postData).then(function (res) {
            console.log(res);
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
    handleShowMask: function handleShowMask(e) {
        var that = this;
        var list = that.data.orderList;
        var show = e.currentTarget.dataset.show;
        var index = e.currentTarget.dataset.index;
        if (index !== "" && index != null) {
            var shopList = [];
            list[parseInt(index)].active = true;
            for (var i = 0; i < list.length; i++) {
                if (list[i].active == true) {
                    shopList.push(list[i]);
                }
            }
            that.setData({ shopList: shopList[0], showMask: show, Lindex: index });
        } else {
            var shopList = [];
            var Lindex = that.data.Lindex;
            list[parseInt(Lindex)].active = false;
            that.setData({ showMask: show, orderList: list });
        }
    },
    CancelShouhouTap: function CancelShouhouTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].cancelshou, { token: token, id: id }).then(function (res) {
            if (res.code == 0) {
                wx.showToast({
                    title: '撤销售后申请成功',
                    icon: 'none',
                    duration: 2000
                });
                that.getOrderList();
            }
        });
    },
    DeleteShouhouTap: function DeleteShouhouTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].delexchang, { token: token, id: id }).then(function (res) {
            if (res.code == 0) {
                wx.showToast({
                    title: '删除售后申请成功',
                    icon: 'none',
                    duration: 2000
                });
                that.getOrderList();
            }
        });
    },
    bindFormSubmit: function bindFormSubmit(e) {
        var that = this;
        var name = e.detail.value.name;
        var code = e.detail.value.number;
        var shid = that.data.shorderid;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (!name) {
            wx.showToast({
                title: '请输入快递公司名字',
                icon: 'none',
                duration: 2000
            });
            return;
        } else if (!code) {
            wx.showToast({
                title: '请输入快递运单号码',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        _server2.default.get(_urls2.default.links[0].addchanges, { token: token, id: shid, kuaname: name, kuanumber: code }).then(function (res) {
            if (res.code == 0) {
                that.setData({ makeMask: false });
                wx.showToast({
                    title: '补充信息成功',
                    icon: 'none',
                    duration: 2000
                });
                that.getOrderList();
            }
        });
    },
    MakeShouhouTap: function MakeShouhouTap(e) {
        var that = this;
        var shid = e.currentTarget.dataset.id;
        var show = e.currentTarget.dataset.show;
        var reas = e.currentTarget.dataset.re;
        if (shid) {
            that.setData({
                makeMask: show,
                shorderid: shid,
                shreason: reas
            });
        } else {
            that.setData({
                makeMask: show
            });
        }
    },
    getCopyShopTap: function getCopyShopTap() {
        var that = this;
        var data = that.data.shopInfo;
        wx.setClipboardData({
            data: data.gname + '\r\n' + data.phone + '\r\n' + data.gadds,
            success: function success(res) {
                console.log("\u5730\u5740\u590D\u5236\u6210\u529F");
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});