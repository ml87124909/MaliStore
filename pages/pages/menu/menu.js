"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
exports.default = Page({
    data: {
        nav_height: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
        top: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
        height: wx.DEFAULT_CONTENT_HEIGHT,
        current: 0,
        tabStyle: {
            'color': '#27323f'
        },
        activeTabStyle: {
            'color': '#ffd305',
            'border-right': '2rpx solid #ffd305'
        },
        customStyle: {
            'background-color': 'rgba(255, 255, 255, 0.98)'
        },
        searchHistory: [],
        swiperCurrent: 0,
        searcHover: '',
        activeCategoryName: "\u6240\u6709\u5546\u54C1\u5206\u7C7B"
    },
    onLoad: function onLoad() {
        var that = this;
        wx.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
        //商品分类
        _server2.default.get(_urls2.default.links[0].mlcategory, { level: 1 }).then(function (res) {
            if (res.code == 0) {
                wx.hideLoading();
                var categories = [{ id: 0, name: "\u6240\u6709\u5206\u7C7B" }];
                for (var i = 0; i < res.data.length; i++) {
                    categories.push(res.data[i]);
                }
                that.setData({ categories: categories });
                that.getGoodsList(0);
            }
        });
        //商品轮播广告
        _server2.default.get(_urls2.default.links[0].imgsbanner, { type: 'goods' }).then(function (res) {
            if (res.code == 0) {
                that.setData({ menu: res.data });
            }
        });
        //搜索关键字
        var shopInfo = wx.getStorageSync("__appShopInfo");
        if (shopInfo.searchTag) {
            that.setData({
                searchTag: shopInfo.searchTag
            });
        }
        that.searchData();
    },
    onShow: function onShow() {
        var that = this;
        that.searchData();
        var token = wx.getStorageSync('__appUserInfo').token;
        if (token) {
            _server2.default.get(_urls2.default.links[0].orderstats, { token: token }).then(function (res) {
                if (res.code == 0) {
                    if (res.data.nopaypal > 0) {
                        wx.showTabBarRedDot({ index: 3 });
                    } else {
                        wx.removeTabBarBadge({ index: 3 });
                    }
                }
            });
        }
        wx.getStorage({
            key: '__shopCarInfo',
            success: function success(res) {
                if (res.data) {
                    if (res.data.shopNum > 0) {
                        wx.showTabBarRedDot({ index: 2 });
                    } else {
                        wx.removeTabBarBadge({ index: 2 });
                    }
                } else {
                    wx.removeTabBarBadge({ index: 2 });
                }
            }
        });
    },
    getGoodsList: function getGoodsList(categoryId) {
        var that = this;
        if (categoryId == 0) {
            _server2.default.get(_urls2.default.links[0].mlcategory, { level: 2 }).then(function (res) {
                if (res.code == 0) {
                    that.setData({ categorieslist: res.data });
                }
            });
        } else {
            _server2.default.get(_urls2.default.links[0].categorydf, { id: categoryId }).then(function (res) {
                if (res.code == 0) {
                    that.setData({ categorieslist: res.data });
                } else {
                    that.setData({ categorieslist: 0 });
                }
            });
        }
    },
    searcHover: function searcHover(e) {
        var show = e.currentTarget.dataset.show;
        if (show == true) {
            this.setData({ showMask: show, searcHover: 'search-header-hover' });
        } else {
            this.setData({ showMask: show, searcHover: '' });
        }
    },
    getSearch: function getSearch(e) {
        var name = e.currentTarget.dataset.name;
        wx.navigateTo({
            url: "/pages/pages/menu/search/search?name=" + name
        });
        this.setData({ showMask: false, searcHover: '' });
    },
    search: function search(e) {
        var searchHistory = this.data.searchHistory;
        searchHistory.push({ name: e.detail.value });
        wx.setStorageSync('searchHistory', searchHistory);
        wx.navigateTo({
            url: "/pages/pages/menu/search/search?name=" + e.detail.value
        });
        this.setData({ showMask: false, searcHover: '' });
    },
    delSearch: function delSearch() {
        wx.setStorage({ key: "searchHistory", data: [] });
        this.setData({ searchHistory: [], searchHover: '' });
    },
    searchData: function searchData() {
        var that = this;
        wx.getStorage({
            key: 'searchHistory',
            success: function success(res) {
                that.setData({ searchHistory: res.data });
                if (res.data.length >= 0) {
                    that.setData({ searchHover: res.data.length });
                }
            }
        });
    },
    swiperChange: function swiperChange(e) {
        this.setData({
            swiperCurrent: e.detail.current
        });
    },
    tabClick: function tabClick(e) {
        //this.setData({activeCategoryId: e.currentTarget.dataset.id});
        if (e.currentTarget.dataset.id == 0) {
            this.setData({ activeCategoryName: "\u6240\u6709\u5546\u54C1\u5206\u7C7B" });
        } else {
            this.setData({ activeCategoryName: e.currentTarget.dataset.name + "\u5206\u7C7B" });
        }
        this.getGoodsList(e.currentTarget.dataset.id);
    },
    levelClick: function levelClick(e) {
        var cid = e.currentTarget.dataset.id;
        var pid = e.currentTarget.dataset.pid;
        var name = e.currentTarget.dataset.name;
        wx.navigateTo({
            url: "/pages/pages/menu/list/list?id=" + cid + '&pid=' + pid + '&name=' + name
        });
    },
    tapBanner: function tapBanner(e) {
        if (e.currentTarget.dataset.id != 0) {
            wx.navigateTo({
                url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
            });
        }
    }

});