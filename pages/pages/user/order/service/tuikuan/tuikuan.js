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
        confirm: false,
        imgLength: 0
    },
    onLoad: function onLoad(e) {
        var that = this;
        var shop = wx.getStorageSync('__appShopInfo');
        var token = wx.getStorageSync('__appUserInfo').token;
        that.setData({ id: e.id, shopInfo: shop });
        _server2.default.get(_urls2.default.links[0].orderdetas, { token: token, id: e.id }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    orderDetails: res.data
                });
            }
        });
    },
    seleMoneyTap: function seleMoneyTap() {
        var that = this;
        var truemoney = that.data.orderDetails.order_money + that.data.orderDetails.order_balance;
        that.setData({
            smoney: truemoney
        });
    },
    chooseImageTap: function chooseImageTap() {
        var that = this;
        wx.chooseImage({
            count: 4,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function success(res) {
                that.setData({
                    imgList: res.tempFilePaths,
                    imgLength: res.tempFilePaths.length
                });
            }
        });
    },
    previewImageTap: function previewImageTap(e) {
        var that = this;
        var img = e.currentTarget.dataset.img;
        var image = that.data.imgList;
        wx.previewImage({
            current: img,
            urls: image
        });
    },
    bindFormSubmit: function bindFormSubmit(e) {
        var that = this;
        var orid = that.data.id;
        var imgs = that.data.imgList;
        var money = e.detail.value.money;
        var texts = e.detail.value.text;
        var token = wx.getStorageSync('__appUserInfo').token;
        var timestamp = Date.parse(new Date());
        var timestamp = timestamp / 1000;
        var truemoney = that.data.orderDetails.order_money + that.data.orderDetails.order_balance;
        if (!money) {
            wx.showToast({
                title: '请输入退款金额',
                icon: 'none',
                duration: 2000
            });
            return;
        } else if (!texts) {
            wx.showToast({
                title: '请输入退款原因',
                icon: 'none',
                duration: 2000
            });
            return;
        } else if (money > truemoney) {
            wx.showToast({
                title: '退款金额过大',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        if (imgs) {
            wx.showLoading({ title: "\u56FE\u7247\u4E0A\u4F20\u4E2D" });
            for (var i = 0; i < imgs.length; i++) {
                wx.uploadFile({
                    url: _urls2.default.links[0].uploadfile,
                    filePath: imgs[i],
                    name: 'name',
                    formData: {
                        'ctype': '0',
                        'viewid': 'home',
                        'part': 'get_upload',
                        'orderId': orid,
                        'timestamp': timestamp
                    },
                    success: function success(res) {
                        if (res.statusCode != 200) {
                            wx.showConfirm({
                                content: "\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
                                confirmColor: "#ffd305",
                                confirmText: "\u786E\u5B9A",
                                showCancel: 'false',
                                success: function success(res) {}
                            });
                            return;
                        }
                    }
                });
            }
        }

        _server2.default.get(_urls2.default.links[0].orderefund, { token: token, id: orid, money: money, reason: texts, timestamp: timestamp }).then(function (res) {
            console.log(res);
            if (res.code == 0) {
                wx.hideLoading();
                wx.showConfirm({
                    content: "\u5DF2\u7ECF\u7533\u8BF7\u9000\u6B3E\r\n\u8BF7\u7B49\u5F85\u5BA2\u670D\u5904\u7406",
                    confirmColor: "#ffd305",
                    confirmText: "\u786E\u5B9A",
                    showCancel: false,
                    success: function success(res) {
                        if (res.confirm) {
                            wx.navigateBack();
                        }
                    }
                });
            }
        });
    },
    getCallTap: function getCallTap(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
        });
    },
    getDetailsTap: function getDetailsTap(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/pages/user/order/details/details?id=" + id
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});