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
    showMask: false,
    noneLogin: false,
    couponsIcon: false,
    CouponsMask: false,
    customStyle: {
      'background-color': 'rgba(255, 255, 255, 0)'
    }
  },
  onShow: function onShow() {
    var that = this;
    var shops = wx.getStorageSync('__appShopInfo');
    var token = wx.getStorageSync('__appUserInfo').token;
    if (app.globalData.userinfo == 1e4) {
      that.setData({ noneLogin: true });
    } else {
      that.setData({ noneLogin: false });
      setTimeout(function () {
        if (app.globalData.userinfo == 1e4) {
          that.setData({ noneLogin: true });
        }
      }, 1000);
    }
    if (token) {
      that.getorderstats();
    }
    if (!shops) {
      setTimeout(function () {
        if (shops.shopInfo.coupons) {
          that.getCheckCoupons();
        }
      }, 800);
    } else {
      that.getCheckCoupons();
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
  onLoad: function onLoad() {
    var that = this;
    var shops = wx.getStorageSync('__appShopInfo');
    var token = wx.getStorageSync('__appUserInfo').token;
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
        } else if (shops.shopInfo.home_type == 1) {
          _server2.default.get(_urls2.default.links[0].mlgoodlist, { status: 1 }).then(function (res) {
            if (res.code == 0) {
              that.setData({
                goods: res.data
              });
            }
          });
        } else if (shops.shopInfo.home_type == 2) {
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
      } else if (shops.shopInfo.home_type == 1) {
        _server2.default.get(_urls2.default.links[0].mlgoodlist, { status: 1 }).then(function (res) {
          if (res.code == 0) {
            that.setData({
              goods: res.data
            });
          }
        });
      } else if (shops.shopInfo.home_type == 2) {
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
  getCheckCoupons: function getCheckCoupons() {
    var that = this;
    var shops = wx.getStorageSync('__appShopInfo');
    var token = wx.getStorageSync('__appUserInfo').token;
    if (token) {
      _server2.default.get(_urls2.default.links[0].checkcuops, { token: token, id: shops.shopInfo.coupons }).then(function (res) {
        if (res.code == 0) {
          that.setData({ couponsInfo: res.data });
          setTimeout(function () {
            that.setData({ CouponsMask: true });
            setTimeout(function () {
              that.setData({ copen: 'coupons-op' });
              setTimeout(function () {
                that.setData({ bopen: 'coubtn-op' });
              }, 1000);
            }, 600);
          }, 1000);
        }
      });
    }
  },
  checklogin: function checklogin() {
    if (app.globalData.userinfo == 1e4) {
      wx.navigateTo({
        url: "/pages/pages/login/login"
      });
      return;
    } else {
      that.setData({ noneLogin: false });
    }
  },
  getorderstats: function getorderstats() {
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].orderstats, { token: token }).then(function (res) {
      if (res.code == 0) {
        if (res.data.nopaypal > 0) {
          wx.showTabBarRedDot({ index: 3 });
        } else {
          wx.removeTabBarBadge({ index: 3 });
        }
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
        backgroundColor: 'rgba(255,255,255,.0)'
      });
      this.setData({
        navigationbar: "scrollTop"
      });
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: 'rgba(255,255,255,.0)'
      });
      this.setData({
        navigationbar: ""
      });
    }
  },
  closeCouponsTap: function closeCouponsTap() {
    var that = this;
    that.setData({ bopen: '' });
    setTimeout(function () {
      that.setData({ copen: '' });
      setTimeout(function () {
        that.setData({ CouponsMask: false, couponsIcon: true });
      }, 1000);
    }, 600);
  },
  getCouponsTap: function getCouponsTap() {
    var that = this;
    that.setData({ CouponsMask: true, couponsIcon: false });
    setTimeout(function () {
      that.setData({ copen: 'coupons-op' });
      setTimeout(function () {
        that.setData({ bopen: 'coubtn-op' });
      }, 1000);
    }, 600);
  },
  userGetCouponsTap: function userGetCouponsTap() {
    var that = this;
    var data = that.data.couponsInfo;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].getcoupons, { id: data.id, token: token }).then(function (res) {
      if (res.code == 0) {
        wx.showToast({ title: "\u4F18\u60E0\u5238\u9886\u53D6\u6210\u529F", icon: 'none' });
        that.setData({ bopen: '' });
        setTimeout(function () {
          that.setData({ copen: '' });
          setTimeout(function () {
            that.setData({ CouponsMask: false, couponsIcon: false });
          }, 1000);
        }, 1000);
      }
    });
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