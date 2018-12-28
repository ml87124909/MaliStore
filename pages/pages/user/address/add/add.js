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
        region: ["\u5317\u4EAC\u5E02", "\u5317\u4EAC\u5E02", "\u4E1C\u57CE\u533A"],
        location: '',
        id: 0
    },
    onLoad: function onLoad(e) {
        var that = this;
        var ctid = e.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (ctid) {
            wx.showLoading({ title: "\u52A0\u8F7D\u4E2D...", mask: true });
            _server2.default.get(_urls2.default.links[0].addresdefa, { token: token, id: ctid }).then(function (res) {
                wx.hideLoading();
                if (res.code == 0) {
                    that.setData({
                        addressData: res.data,
                        region: [res.data.province, res.data.city, res.data.district]
                    });
                }
            });
            that.setData({ id: ctid });
        } else {
            that.getPosition();
        }
    },
    getPosition: function getPosition() {
        var that = this;
        if (_urls2.default.mapkey) {
            wx.showLoading({ title: "\u5B9A\u4F4D\u4E2D...", mask: true });
            _server2.default.get(_urls2.default.links[0].tencentmap, { key: _urls2.default.mapkey }).then(function (res) {
                if (res.status == 0) {
                    wx.hideLoading();
                    wx.showToast({ title: "\u5B9A\u4F4D\u6210\u529F", icon: 'none' });
                    that.setData({
                        region: [res.result.ad_info.province, res.result.ad_info.city, res.result.ad_info.district]
                    });
                } else {
                    wx.hideLoading();
                    wx.showToast({ title: "\u5B9A\u4F4D\u5931\u8D25", icon: 'none' });
                }
            });
        }
    },
    bindRegionChange: function bindRegionChange(e) {
        this.setData({
            region: e.detail.value
        });
    },
    bindSave: function bindSave(e) {
        var that = this;
        var apiAddid = that.data.id;
        var linkMan = e.detail.value.linkMan;
        var address = e.detail.value.address;
        var mobile = e.detail.value.mobile;
        var code = e.detail.value.code;
        var region = that.data.region;
        var token = wx.getStorageSync('__appUserInfo').token;
        if (linkMan == '') {
            wx.showConfirm({
                content: "\u8BF7\u586B\u5199\u6536\u8D27\u4EBA\u59D3\u540D",
                showCancel: false,
                confirmColor: '#ffd305',
                success: function success(res) {}
            });
            return;
        }
        if (mobile == '') {
            wx.showConfirm({
                content: "\u8BF7\u586B\u5199\u624B\u673A\u53F7\u7801",
                showCancel: false,
                confirmColor: '#ffd305',
                success: function success(res) {}
            });
            return;
        }
        if (address == '') {
            wx.showConfirm({
                content: "\u8BF7\u586B\u5199\u8BE6\u7EC6\u5730\u5740",
                showCancel: false,
                confirmColor: '#ffd305',
                success: function success(res) {}
            });
            return;
        }
        if (apiAddid == 0) {
            ;
            //新增地址
            _server2.default.get(_urls2.default.links[0].addresedit, {
                token: token,
                name: linkMan,
                phone: mobile,
                province: region[0],
                city: region[1],
                district: region[2],
                address: address,
                code: code,
                default: 1
            }).then(function (res) {
                if (res.code == 0) {
                    wx.navigateBack({});
                }
            });
        } else {
            //更新地址
            _server2.default.get(_urls2.default.links[0].addresedit, {
                token: token,
                id: apiAddid,
                name: linkMan,
                phone: mobile,
                province: region[0],
                city: region[1],
                district: region[2],
                address: address,
                code: code
            }).then(function (res) {
                if (res.code == 0) {
                    wx.navigateBack({});
                }
            });
        }
    },
    deleteAddress: function deleteAddress(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        wx.showConfirm({
            content: "\u5220\u9664\u540E\u5C06\u4E0D\u80FD\u6062\u590D\uFF0C\u786E\u5B9A\u8981\u5220\u9664\u8BE5\u5730\u5740\u5417\uFF1F",
            confirmColor: '#ffd305',
            confirmText: "\u786E\u5B9A\u5220\u9664",
            success: function success(res) {
                if (res.confirm) {
                    _server2.default.get(_urls2.default.links[0].addressdel, { token: token, id: id }).then(function (res) {
                        if (res.code == 0) {
                            wx.navigateBack({});
                        }
                    });
                }
            }
        });
    },
    readFromWx: function readFromWx() {
        var that = this;
        wx.chooseAddress({
            success: function success(res) {
                that.setData({
                    wxaddress: res,
                    region: [res.provinceName, res.cityName, res.countyName]
                });
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});