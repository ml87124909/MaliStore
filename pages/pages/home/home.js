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
  onLoad: function onLoad() {
    var that = this;
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
    //专题板块
    wx.nextTick(function () {
      _server2.default.get(_urls2.default.links[0].mlcategory, { type: 'home' }).then(function (res) {
        if (res.code == 0) {
          that.setData({ category: res.data });
          var goods = {};
          for (var i = 0; i < res.data.length; i++) {
            that.getCategoryGoods(res.data[i].id, goods);
          }
        }
      });
    });
    //首页商品
    _server2.default.get(_urls2.default.links[0].mlshopinfo, {}).then(function (res) {
      if (res.code == 0) {
        var shopInfo = res.data.shopInfo;
        that.setData({ shopInfo: shopInfo });
        if (shopInfo.home_type == 0) {
          _server2.default.get(_urls2.default.links[0].mlgoodlist, {}).then(function (res) {
            if (res.code == 0) {
              that.setData({ goods: res.data });
            }
          });
        } else if (shopInfo.home_type == 1) {
          _server2.default.get(_urls2.default.links[0].mlgoodlist, { status: 1 }).then(function (res) {
            if (res.code == 0) {
              that.setData({ goods: res.data });
            }
          });
        } else if (shopInfo.home_type == 2) {
          that.setData({ goods: res.data.homeGoods });
        }
        that.getCheckCoupons(shopInfo.coupons);
      }
    });
  },
  onShow: function onShow() {
    var that = this;
    var shops = that.data.shopInfo;
    var token = wx.getStorageSync('__appUserInfo').token;
    if (app.globalData.userinfo == 1e4) {
      that.setData({ noneLogin: true });
    } else {
      that.setData({ noneLogin: false });
      wx.nextTick(function () {
        if (app.globalData.userinfo == 1e4) {
          that.setData({ noneLogin: true });
        }
      });
    }
    if (token) {
      that.getorderstats();
      if (shops) {
        that.getCheckCoupons(shops.coupons);
      }
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
  getCategoryGoods: function getCategoryGoods(id, goods) {
    var that = this;
    _server2.default.get(_urls2.default.links[0].mlgoodlist, { category_id: id, page_size: 10 }).then(function (res) {
      if (res.code == 0) {
        var cgoods = [];
        cgoods.push(res.data);
        goods[id] = cgoods;
        that.setData({
          categoryGoods: goods
        });
      }
    });
  },
  getCheckCoupons: function getCheckCoupons(e) {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    if (token) {
      _server2.default.get(_urls2.default.links[0].checkcuops, { token: token, id: e }).then(function (res) {
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
      title: this.shopInfo.sname,
      path: '/pages/pages/home/home',
      imageUrl: this.shopInfo.spic,
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
  },
  getMenuListTap: function getMenuListTap(e) {
    var cid = e.currentTarget.dataset.id;
    var pid = e.currentTarget.dataset.pid;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: "/pages/pages/menu/list/list?id=" + cid + '&pid=' + pid + '&name=' + name
    });
  }

});