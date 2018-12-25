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
        bohuiMask: false
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
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].tuikuanlis, { token: token }).then(function (res) {
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
    CancelTuikuanTap: function CancelTuikuanTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].canceltuik, { token: token, id: id }).then(function (res) {
            if (res.code == 0) {
                wx.showToast({
                    title: '撤销退款申请成功',
                    icon: 'none',
                    duration: 2000
                });
                that.getOrderList();
            }
        });
    },
    DeleteTuikuanTap: function DeleteTuikuanTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].deletetuik, { token: token, id: id }).then(function (res) {
            console.log(res);
            if (res.code == 0) {
                wx.showToast({
                    title: '申请退款记录删除成功',
                    icon: 'none',
                    duration: 2000
                });
                that.getOrderList();
            }
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
    previewImageTap: function previewImageTap(e) {
        var that = this;
        var img = e.currentTarget.dataset.img;
        var image = that.data.shopList.pics;
        var ImgList = [];
        for (var i = 0; i < image.length; i++) {
            ImgList.push(image[i].pic);
        }
        wx.previewImage({
            current: img,
            urls: ImgList
        });
    },
    ViewReasonTap: function ViewReasonTap(e) {
        var that = this;
        var list = that.data.orderList;
        var show = e.currentTarget.dataset.show;
        var index = e.currentTarget.dataset.index;
        if (index !== "" && index != null) {
            var reaList = [];
            list[parseInt(index)].active = true;
            for (var i = 0; i < list.length; i++) {
                if (list[i].active == true) {
                    reaList.push(list[i]);
                }
            }
            that.setData({ bohuiMask: show, reaList: reaList[0], reaIndex: index });
        } else {
            var reaList = [];
            var reaIndex = that.data.reaIndex;
            list[parseInt(reaIndex)].active = false;
            that.setData({ bohuiMask: show, reaList: list });
        }
    },
    TuikuanAgainTap: function TuikuanAgainTap(e) {
        this.setData({ bohuiMask: false });
        var id = e.currentTarget.dataset.id;
        var tid = e.currentTarget.dataset.tid;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].recoverytk, { token: token, id: tid }).then(function (res) {
            if (res.code == 0) {
                wx.navigateTo({
                    url: "/pages/pages/user/order/service/tuikuan/tuikuan?id=" + id
                });
            }
        });
    },
    TuikuanContinueTap: function TuikuanContinueTap(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        that.setData({ bohuiMask: false });
        _server2.default.get(_urls2.default.links[0].recoverytk, { token: token, id: id }).then(function (res) {
            if (res.code == 0) {
                wx.showToast({
                    title: '订单状态恢复成功',
                    icon: 'none',
                    duration: 2000
                });
                that.getOrderList();
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});