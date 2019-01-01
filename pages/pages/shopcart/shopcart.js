"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
exports.default = Page({
  data: {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
    goodsList: {
      saveHidden: true,
      totalPrice: 0,
      allSelect: true,
      noSelect: false,
      list: []
    },
    delBtnWidth: 120,
    noneLogin: false
  },
  onLoad: function onLoad() {
    var that = this;
    var shopInfo = wx.getStorageSync("__appShopInfo");
    if (shopInfo) {
      if (shopInfo.cartText) {
        that.setData({
          carttips: shopInfo.cartText
        });
      }
      if (shopInfo.shopInfo.cart_type == 0) {
        _server2.default.get(_urls2.default.links[0].mlgoodlist, {}).then(function (res) {
          if (res.code == 0) {
            that.setData({
              sales: res.data
            });
          }
        });
      }
      if (shopInfo.shopInfo.cart_type == 1) {
        _server2.default.get(_urls2.default.links[0].mlgoodlist, { status: 1 }).then(function (res) {
          if (res.code == 0) {
            that.setData({
              sales: res.data
            });
          }
        });
      }
      if (shopInfo.shopInfo.cart_type == 2) {
        that.setData({
          sales: shopInfo.cartGoods
        });
      }
    }
  },
  onShow: function onShow() {
    var that = this;
    that.initEleWidth();
    var shopList = [];
    var token = wx.getStorageSync('__appUserInfo').token;
    var shopCarInfoMem = wx.getStorageSync("__shopCarInfo");
    if (shopCarInfoMem && shopCarInfoMem.shopList) {
      shopList = shopCarInfoMem.shopList;
    }
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
    that.data.goodsList.list = shopList;
    that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), shopList);
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
  getEleWidth: function getEleWidth(w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = 750 / 2 / (w / 2);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
    }
  },
  initEleWidth: function initEleWidth() {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  touchS: function touchS(e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function touchM(e) {
    var index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) {
        left = "margin-left:0px";
      } else if (disX > 0) {
        //left = "margin-left:-" + disX + "px";
        left = "margin-left:-60px";
        if (disX >= delBtnWidth) {
          //left = "left:-" + delBtnWidth + "px";
          left = "left:-60px";
        }
      }
      var list = this.data.goodsList.list;
      if (index != "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  touchE: function touchE(e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = disX > delBtnWidth / 2
      //? "margin-left:-" + delBtnWidth + "px"
      ? "margin-left:-60px" : "margin-left:0px";
      var list = this.data.goodsList.list;
      if (index !== "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  delItem: function delItem(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    list.splice(index, 1);
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
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
        total += parseFloat(curItem.goods_price) * curItem.buy_number;
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
    this.setData({
      goodsList: {
        saveHidden: saveHidden,
        totalPrice: total,
        allSelect: allSelect,
        noSelect: noSelect,
        list: list
      }
    });
    var shopCarInfo = {};
    var tempNumber = 0;
    shopCarInfo.shopList = list;
    for (var i = 0; i < list.length; i++) {
      tempNumber = tempNumber + list[i].buy_number;
    }
    shopCarInfo.shopNum = tempNumber;
    wx.setStorage({
      key: "__shopCarInfo",
      data: shopCarInfo
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
  jiaBtnTap: function jiaBtnTap(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].buy_number < 10) {
        list[parseInt(index)].buy_number++;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  jianBtnTap: function jianBtnTap(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].buy_number > 1) {
        list[parseInt(index)].buy_number--;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
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
  deleteSelected: function deleteSelected() {
    var list = this.data.goodsList.list;
    list = list.filter(function (curGoods) {
      return !curGoods.active;
    });
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  toPayOrder: function toPayOrder() {
    wx.showLoading();
    var that = this;
    if (this.data.goodsList.noSelect) {
      wx.hideLoading();
      return;
    }
    var shopList = [];
    var shopCarInfoMem = wx.getStorageSync("__shopCarInfo");
    if (shopCarInfoMem && shopCarInfoMem.shopList) {
      shopList = shopCarInfoMem.shopList.filter(function (entity) {
        return entity.active;
      });
    }
    if (shopList.length == 0) {
      wx.hideLoading();
      return;
    }
    var isFail = false;
    var doneNumber = 0;
    var needDoneNUmber = shopList.length;

    var _loop = function _loop(i) {
      if (isFail) {
        wx.hideLoading();
        return {
          v: void 0
        };
      }
      var carShopBean = shopList[i];
      if (!carShopBean.goods_childs || carShopBean.goods_childs == "") {
        _server2.default.get(_urls2.default.links[0].mlgoodsdet, { id: carShopBean.goods_id }).then(function (res) {
          doneNumber++;
          if (res.data.basicInfo.status == '下架') {
            wx.showModal({
              title: "\u4E0B\u67B6\u63D0\u793A",
              content: res.data.basicInfo.name + "\u5546\u54C1\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u8D2D\u4E70",
              showCancel: false
            });
            isFail = true;
            wx.hideLoading();
            return;
          }
          if (res.data.basicInfo.stores < carShopBean.buy_number) {
            wx.showModal({
              title: "\u5E93\u5B58\u63D0\u793A",
              content: res.data.basicInfo.name + "\u5E93\u5B58\u4E0D\u8DB3\uFF0C\u8BF7\u91CD\u65B0\u8D2D\u4E70",
              showCancel: false
            });
            isFail = true;
            wx.hideLoading();
            return;
          }
          if (res.data.basicInfo.mini_price != carShopBean.goods_price) {
            wx.showModal({
              title: "\u4EF7\u683C\u8C03\u6574\u63D0\u793A",
              content: res.data.basicInfo.name + "\u4EF7\u683C\u6709\u8C03\u6574\uFF0C\u8BF7\u91CD\u65B0\u8D2D\u4E70",
              showCancel: false
            });
            isFail = true;
            wx.hideLoading();
            return;
          }
          if (needDoneNUmber == doneNumber) {
            that.navigateToPayOrder();
          }
        });
      } else {
        _server2.default.get(_urls2.default.links[0].goodsprice, { goods_id: carShopBean.goods_id, goods_childs: carShopBean.goods_childs }).then(function (res) {
          doneNumber++;
          if (res.data.goods_stores < carShopBean.buy_number) {
            wx.showModal({
              title: "\u5E93\u5B58\u63D0\u793A",
              content: carShopBean.goods_name + "\u5E93\u5B58\u4E0D\u8DB3\uFF0C\u8BF7\u91CD\u65B0\u8D2D\u4E70",
              showCancel: false
            });
            isFail = true;
            wx.hideLoading();
            return;
          }
          if (res.data.goods_mini != carShopBean.goods_price) {
            wx.showModal({
              title: "\u4EF7\u683C\u8C03\u6574\u63D0\u793A",
              content: carShopBean.goods_name + "\u4EF7\u683C\u6709\u8C03\u6574\uFF0C\u8BF7\u91CD\u65B0\u8D2D\u4E70",
              showCancel: false
            });
            isFail = true;
            wx.hideLoading();
            return;
          }
          if (needDoneNUmber == doneNumber) {
            that.navigateToPayOrder();
          }
        });
      }
    };

    for (var i = 0; i < shopList.length; i++) {
      var _ret = _loop(i);

      if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    }
  },
  navigateToPayOrder: function navigateToPayOrder() {
    wx.hideLoading();
    wx.navigateTo({
      url: "/pages/pages/payorder/payorder"
    });
  },
  toDetailsTap: function toDetailsTap(e) {
    wx.navigateTo({
      url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
    });
  }
});