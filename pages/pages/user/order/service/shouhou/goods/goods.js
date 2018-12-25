"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        goodsList: {
            saveHidden: true,
            totalPrice: 0,
            allSelect: false,
            noSelect: false,
            list: []
        },
        shihouNum: 0
    },
    onLoad: function onLoad(e) {
        var that = this;
        var shopList = [];
        var token = wx.getStorageSync('__appUserInfo').token;
        that.setData({ orderId: e.id });
        _server2.default.get(_urls2.default.links[0].exchanglis, { token: token, id: e.id }).then(function (res) {
            if (res.code == 0) {
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].e_status == 0) {
                        shopList.push(res.data[i]);
                    }
                }
                var list = shopList;
                that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), list);
            }
        });
    },
    selectTap: function selectTap(e) {
        var index = e.currentTarget.dataset.index;
        var list = this.data.goodsList.list;
        if (index !== "" && index != null) {
            list[parseInt(index)].active = !list[parseInt(index)].active;
            this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
        }
    },
    totalPrice: function totalPrice() {
        var list = this.data.goodsList.list;
        var total = 0;
        for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            if (curItem.active) {
                total += parseFloat(curItem.price) * curItem.number;
            }
        }
        total = parseFloat(total.toFixed(2));
        return total;
    },
    allSelect: function allSelect() {
        var list = this.data.goodsList.list;
        var allSelect = false;
        for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            if (curItem.active) {
                allSelect = true;
            } else {
                allSelect = false;
                break;
            }
        }
        return allSelect;
    },
    noSelect: function noSelect() {
        var list = this.data.goodsList.list;
        var noSelect = 0;
        for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            if (!curItem.active) {
                noSelect++;
            }
        }
        if (noSelect == list.length) {
            return true;
        } else {
            return false;
        }
    },
    setGoodsList: function setGoodsList(saveHidden, total, allSelect, noSelect, list) {
        var that = this;
        that.setData({
            goodsList: {
                saveHidden: saveHidden,
                totalPrice: total,
                allSelect: allSelect,
                noSelect: noSelect,
                list: list
            }
        });
        var shouHouInfo = {};
        var tempNumber = 0;
        var shihouNum = [];
        shouHouInfo.shopList = list;
        for (var i = 0; i < list.length; i++) {
            tempNumber = tempNumber + list[i].number;
            if (list[i].active == true) {
                shihouNum.push(list[i]);
            }
        }
        that.setData({ shihouNum: shihouNum.length });
        //shouHouInfo.shopNum = tempNumber;
        wx.setStorage({
            key: "__shouHouInfo",
            data: shouHouInfo
        });
    },
    bindAllSelect: function bindAllSelect() {
        var currentAllSelect = this.data.goodsList.allSelect;
        var list = this.data.goodsList.list;
        if (currentAllSelect) {
            for (var i = 0; i < list.length; i++) {
                var curItem = list[i];
                curItem.active = false;
            }
        } else {
            for (var i = 0; i < list.length; i++) {
                var curItem = list[i];
                curItem.active = true;
            }
        }

        this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
    },
    subtraction: function subtraction(e) {
        var that = this;
        var val = e.detail.toString();
        var index = e.currentTarget.dataset.index;
        var list = that.data.goodsList.list;
        if (index !== "" && index != null) {
            list[parseInt(index)].number = val;
            that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), list);
        }
    },
    addition: function addition(e) {
        var that = this;
        var val = e.detail.toString();
        var index = e.currentTarget.dataset.index;
        var list = that.data.goodsList.list;
        if (index !== "" && index != null) {
            list[parseInt(index)].number = val;
            that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), list);
        }
    },
    editTap: function editTap() {
        var list = this.data.goodsList.list;
        for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            curItem.active = false;
        }
        this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    },
    saveTap: function saveTap() {
        var list = this.data.goodsList.list;
        for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            curItem.active = true;
        }
        this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    },
    getSaveHide: function getSaveHide() {
        var saveHidden = this.data.goodsList.saveHidden;
        return saveHidden;
    },
    toPayOrder: function toPayOrder() {
        wx.showLoading();
        var that = this;
        if (that.data.shihouNum == 0) {
            wx.hideLoading();
            return;
        }
        wx.hideLoading();
        wx.navigateTo({
            url: "/pages/pages/user/order/service/shouhou/shouhou?id=" + that.data.orderId
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});