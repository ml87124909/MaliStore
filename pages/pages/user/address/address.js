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
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].addreslist, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({ addressList: res.data });
            } else {
                that.setData({ addressList: '' });
            }
        });
    },
    onLoad: function onLoad() {
        if (wx.IPHONEX == 0) {
            this.setData({ iphonex: true });
        }
    },
    selectTap: function selectTap(e) {
        var id = e.currentTarget.dataset.id;
        var name = e.currentTarget.dataset.name;
        var city = e.currentTarget.dataset.city;
        var code = e.currentTarget.dataset.code;
        var phone = e.currentTarget.dataset.phone;
        var address = e.currentTarget.dataset.address;
        var province = e.currentTarget.dataset.province;
        var district = e.currentTarget.dataset.district;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].addresedit, {
            token: token,
            id: id,
            name: name,
            phone: phone,
            province: province,
            city: city,
            district: district,
            address: address,
            code: code,
            default: 1
        }).then(function (res) {
            if (res.code == 0) {
                wx.navigateBack({});
            }
        });
    },
    editAddess: function editAddess(e) {
        wx.navigateTo({
            url: "/pages/pages/user/address/add/add?id=" + e.currentTarget.dataset.id
        });
    },
    addAddess: function addAddess() {
        wx.navigateTo({ url: "/pages/pages/user/address/add/add" });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});