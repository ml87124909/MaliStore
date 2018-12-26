"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        starNumber: ''
    },
    onLoad: function onLoad(e) {
        var that = this;
        var id = e.id;
        var kid = e.kid;
        if (kid) {
            that.setData({ id: id, kid: kid });
        } else {
            that.setData({ id: id });
        }
        that.pingajiaList(id, kid);
    },
    pingajiaList: function pingajiaList(id, kid) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (kid) {
            var postData = {
                id: id,
                kid: kid,
                token: token
            };
        } else {
            var postData = {
                id: id,
                token: token
            };
        }
        _server2.default.get(_urls2.default.links[0].pingjalist, postData).then(function (res) {
            console.log(res);
            if (res.code == 0) {
                that.setData({
                    pingajiaList: res.data
                });
            }
        });
    },
    handleStar: function handleStar(e) {
        var that = this;
        var index = e.detail;
        var goods = e.currentTarget.dataset.id;
        if (index === 1) {
            that.setData({
                starResult: [goods, '非常差'],
                starNumber: index
            });
        } else if (index === 2) {
            that.setData({
                starResult: [goods, '差'],
                starNumber: index
            });
        } else if (index === 3) {
            that.setData({
                starResult: [goods, '一般吧'],
                starNumber: index
            });
        } else if (index === 4) {
            that.setData({
                starResult: [goods, '满意'],
                starNumber: index
            });
        } else if (index === 5) {
            that.setData({
                starResult: [goods, '非常满意'],
                starNumber: index
            });
        }
    },
    bindFormSubmit: function bindFormSubmit(e) {
        var that = this;
        var orderid = e.detail.value.orderid;
        var goodsid = e.detail.value.goodsid;
        var textarea = e.detail.value.textarea;
        var starNumber = that.data.starNumber;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (!starNumber) {
            wx.showToast({
                title: '请给商品打分',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        if (!textarea) {
            wx.showToast({
                title: '请填写评价',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        _server2.default.get(_urls2.default.links[0].pingjasend, { token: token, id: orderid, goods_id: goodsid, goods_star: starNumber, goods_text: textarea }).then(function (res) {
            if (res.code == 0) {
                var id = that.data.id;
                var kid = that.data.kid;
                if (kid) {
                    that.pingajiaList(id, kid);
                } else {
                    that.pingajiaList(id);
                }
                that.setData({ starNumber: '' });
                wx.showToast({
                    title: '订单评价成功',
                    icon: 'success',
                    duration: 2000
                });
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});