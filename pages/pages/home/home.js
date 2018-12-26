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
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "px",
    swiperCurrent: 0,
    pics: {},
    showMask: false
  },
  onShow: function onShow() {
    var that = this;
    if (app.globalData.userinfo == 1e4) {
      that.setData({ showMask: true });
      wx.hideTabBar();
    } else {
      setTimeout(function () {
        if (app.globalData.userinfo == 1e4) {
          that.setData({ showMask: true });
          wx.hideTabBar();
        }
      }, 1000);
    }
  },
  onLoad: function onLoad() {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    var shops = wx.getStorageSync('__appShopInfo');
    if (!token) {
      setTimeout(function () {
        var token = wx.getStorageSync('__appUserInfo').token;
      }, 500);
    }
    if (!shops) {
      setTimeout(function () {
        var shops = wx.getStorageSync('__appShopInfo');
        that.setData({ shopInfo: shops });
        if (shops.shopInfo.home_type == 0) {
          _server2.default.get(_urls2.default.links[0].mlgoodlist, {}).then(function (res) {
            if (res.code == 0) {
              that.setData({
                goods: res.data
              });
            }
          });
        }
        if (shops.shopInfo.home_type == 1) {
          _server2.default.get(_urls2.default.links[0].mlgoodlist, { status: 1 }).then(function (res) {
            if (res.code == 0) {
              that.setData({
                goods: res.data
              });
            }
          });
        }
        if (shops.shopInfo.home_type == 2) {
          that.setData({
            goods: shops.homeGoods
          });
        }
      }, 800);
    } else {
      that.setData({ shopInfo: shops });
      if (shops.shopInfo.home_type == 0) {
        _server2.default.get(_urls2.default.links[0].mlgoodlist, {}).then(function (res) {
          if (res.code == 0) {
            that.setData({
              goods: res.data
            });
          }
        });
      }
      if (shops.shopInfo.home_type == 1) {
        _server2.default.get(_urls2.default.links[0].mlgoodlist, { status: 1 }).then(function (res) {
          if (res.code == 0) {
            that.setData({
              goods: res.data
            });
          }
        });
      }
      if (shops.shopInfo.home_type == 2) {
        that.setData({
          goods: shops.homeGoods
        });
      }
    }
    //轮播幻灯片
    _server2.default.get(_urls2.default.links[0].imgsbanner, { type: 'home' }).then(function (res) {
      if (res.code == 0) {
        that.setData({ home: res.data });
      }
    });
    //分类菜单
    _server2.default.get(_urls2.default.links[0].imgsbanner, { type: 'menu' }).then(function (res) {
      if (res.code == 0) {
        that.setData({ sale: res.data });
      }
    });
  },
  userlogin: function userlogin(e) {
    var that = this;
    var iv = e.detail.iv;
    var rawData = e.detail.rawData;
    var signature = e.detail.signature;
    var encryptedData = e.detail.encryptedData;
    wx.login({
      success: function success(wxs) {
        _server2.default.get(_urls2.default.links[0].wxregister, { iv: iv, code: wxs.code, rawData: rawData, signature: signature, encryptedData: encryptedData }).then(function (res) {
          console.log(res);
          if (res.code != 0) {
            wx.showConfirm({
              content: "\u9700\u8981\u60A8\u7684\u6388\u6743\uFF0C\u624D\u80FD\u6B63\u5E38\u4F7F\u7528\u54E6\uFF5E",
              showCancel: false,
              confirmColor: '#ffd305',
              confirmText: "\u91CD\u65B0\u6388\u6743",
              success: function success(res) {}
            });
            return;
          } else {
            that.setData({ showMask: false });
            app.login();
            wx.showToast({ title: "\u5FAE\u4FE1\u6388\u6743\u6210\u529F", icon: 'none' });
            app.globalData.userinfo = 0;
            wx.showTabBar();
          }
        });
      }
    });
  },
  swiperChange: function swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  getkangoods: function getkangoods(e) {
    var that = this;
    var pics = that.data.pics;
    _server2.default.get(_urls2.default.links[0].kanjialist, {}).then(function (res) {
      if (res.code == 0) {
        var result = res.result;
        for (var i = 0; i < result.length; i++) {
          if (e == result[i].goodsId) {
            pics[e] = result[i];
          }
        }
        that.setData({ pics: pics });
      }
    });
  },
  onPageScroll: function onPageScroll(t) {
    if (t.scrollTop >= 280) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      });
      this.setData({
        navigationbar: "scrollTop"
      });
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ffffff'
      });
      this.setData({
        navigationbar: ""
      });
    }
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.globalData.shopInfo.shopInfo.sname,
      path: '/pages/pages/home/home',
      imageUrl: app.globalData.shopInfo.shopInfo.spic,
      success: function success(res) {
        // 转发成功
      },
      fail: function fail(res) {
        // 转发失败
      }
    };
  },
  toDetailsTap: function toDetailsTap(e) {
    wx.navigateTo({
      url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
    });
  },
  toTopic: function toTopic(e) {
    wx.navigateTo({
      url: "/pages/pages/topic/index?id=" + e.currentTarget.dataset.id
    });
  },
  tapBanner: function tapBanner(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
      });
    }
  },
  kanjiaTap: function kanjiaTap(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/pages/kanjia-goods/index?id=" + e.currentTarget.dataset.id
      });
    }
  },
  tapSales: function tapSales(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: e.currentTarget.dataset.id
      });
    }
  }

});