"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _qrcode = require("../../../static/utils/qrcode.js");

var _qrcode2 = _interopRequireDefault(_qrcode);

var _barcode = require("../../../static/utils/barcode.js");

var _barcode2 = _interopRequireDefault(_barcode);

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
var wxpay = require('../../../static/utils/pay.js');
exports.default = Page({
  data: {
    numIndex: 0,
    money: '',
    couponId: '',
    rechargeIndex: 0,
    balanceMask: false,
    couponMask: false,
    couponNewMask: false,
    rechargeArray: ''
  },
  onShow: function onShow() {
    var that = this;
    var numIndex = that.data.numIndex;
    var token = wx.getStorageSync('__appUserInfo').token;
    if (numIndex == 1) {
      if (token) {
        that.userInfo();
        that.couponNewList();
        that.myCouponList();
        that.usepaylist();
      }
    }
    that.setData({
      money: '',
      couponId: '',
      rechargeIndex: 0,
      balanceMask: false,
      couponMask: false,
      couponNewMask: false
    });
  },
  onHide: function onHide() {
    wx.closeSocket();
  },
  onLoad: function onLoad() {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    that.websocket();
    _server2.default.get(_urls2.default.links[0].mlshopinfo, {}).then(function (res) {
      if (res.code == 0) {
        that.setData({
          shopInfo: res.data.shopInfo
        });
      }
    });
    if (token) {
      that.userInfo();
      that.couponNewList();
      that.myCouponList();
      that.usepaylist();
      that.loadPaypalCode();

      return;
    } else {
      setTimeout(function () {
        var token = wx.getStorageSync('__appUserInfo').token;
        if (token) {
          that.userInfo();
          that.couponNewList();
          that.myCouponList();
          that.usepaylist();
          that.loadPaypalCode();
        }
      }, 1200);
    }
    setTimeout(function () {
      that.setData({ numIndex: 1 });
    }, 800);
  },
  websocket: function websocket() {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.websocket(_urls2.default.links[0].paypalsock, token).then(function (res) {
      that.getWebSockets();
    });
  },
  getWebSockets: function getWebSockets() {
    wx.onSocketMessage(function (res) {
      var paydata = JSON.parse(res.data);
      if (paydata.code == 0) {
        wx.navigateTo({
          url: '/pages/pages/cash/info?pkey=' + paydata.paykey
        });
      }
    });
  },
  usepaylist: function usepaylist() {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].usepaylist, { token: token }).then(function (res) {
      if (res.code == 0) {
        var rechargeArray = ['请选择充值金额'];
        for (var i = 0; i < res.data.length; i++) {
          rechargeArray.push('充' + res.data[i].money + '元送' + res.data[i].give + '元');
        }
        that.setData({
          rechargeList: res.data,
          rechargeArray: rechargeArray
        });
      }
    });
  },
  loadPaypalCode: function loadPaypalCode() {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].paypalcode, { token: token }).then(function (res) {
      if (res.code == 0) {
        _qrcode2.default.api.draw(res.data.paykey, 'QRcanvas', 200, 200);
        _barcode2.default.code128(wx.createCanvasContext('BARcanvas'), res.data.paykey, 600, 160);
        setTimeout(function () {
          that.canvasToQrTempImage();
        }, 800);
        setTimeout(function () {
          that.canvasToBarTempImage();
        }, 800);
        that.paypalCode();
      }
    });
  },
  paypalCode: function paypalCode() {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    setInterval(function () {
      that.userInfo();
      _server2.default.get(_urls2.default.links[0].paypalcode, { token: token }).then(function (res) {
        if (res.code == 0) {
          _qrcode2.default.api.draw(res.data.paykey, 'QRcanvas', 200, 200);
          _barcode2.default.code128(wx.createCanvasContext('BARcanvas'), res.data.paykey, 600, 160);
          setTimeout(function () {
            that.canvasToQrTempImage();
          }, 800);
          setTimeout(function () {
            that.canvasToBarTempImage();
          }, 800);
        }
      });
    }, 29000);
  },
  canvasToQrTempImage: function canvasToQrTempImage() {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'QRcanvas',
      success: function success(res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imageQrPath: tempFilePath
        });
      }
    });
  },
  canvasToBarTempImage: function canvasToBarTempImage() {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'BARcanvas',
      success: function success(res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imageBarPath: tempFilePath
        });
      }
    });
  },
  checkPaypalCode: function checkPaypalCode(e) {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].paypalinfo, { paykey: e, token: token }).then(function (res) {
      if (res.code == 0) {}
    });
  },
  myCouponList: function myCouponList() {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].mincoupons, { token: token, check: 1, status: 0 }).then(function (res) {
      if (res.code == 0) {
        that.setData({
          couponList: res.data
        });
      }
    });
  },
  couponNewList: function couponNewList() {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].couponlist, { token: token, type: 3 }).then(function (res) {
      if (res.code == 0) {
        that.setData({
          couponNewList: res.data
        });
      }
    });
  },
  userInfo: function userInfo() {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].mluserinfo, { token: token }).then(function (res) {
      if (res.code == 0) {
        that.setData({
          userInfo: res.data
        });
      }
    });
  },
  formSubmit: function formSubmit(e) {
    if (app.globalData.userinfo == 1e4) {
      wx.navigateTo({
        url: "pages/pages/login/login"
      });
      return;
    } else {
      var that = this;
      var money = e.detail.value.money;
      var couponId = that.data.couponId;
      var couponMax = that.data.couponMax;
      var token = wx.getStorageSync('__appUserInfo').token;
      if (!money) {
        wx.showModal({
          showCancel: false,
          content: '请输入消费金额！',
          success: function success(res) {}
        });
        return;
      } else if (couponId && money < couponMax) {
        wx.showModal({
          showCancel: false,
          content: '消费金额未达优惠券满减金额，请选择其他优惠券！',
          success: function success(res) {}
        });
        return;
      }
      if (couponId) {
        var postData = {
          token: token,
          money: money,
          coupon: couponId
        };
      } else {
        var postData = {
          token: token,
          money: money
        };
      }
      console.log(postData);
      _server2.default.get(_urls2.default.links[0].checkmoney, postData).then(function (res) {
        console.log(res);
        if (res.code == 0) {
          var nextAction = {
            ctype: 6,
            id: res.data.id,
            ptype: 0
          };
          wxpay.wxpay(app, res.data.money, res.data.id, 1, nextAction);
        } else if (res.code == 405) {
          wx.showModal({
            showCancel: false,
            content: '消费金额未达优惠券满减金额，请选择其他优惠券！',
            success: function success(res) {}
          });
          return;
        } else if (res.code == 406) {
          wx.showModal({
            showCancel: false,
            content: '优惠券已经失效或者已经被使用，请选择其他优惠券！',
            success: function success(res) {}
          });
          return;
        }
      });
    }
  },
  getRechargeTap: function getRechargeTap() {
    var that = this;
    var data = that.data.rechargeList;
    var arry = that.data.rechargeArray;
    var aidx = that.data.rechargeIndex;
    if (aidx == 0) {
      wx.showModal({
        showCancel: false,
        content: '请选择充值金额',
        success: function success(res) {}
      });
      return;
    } else {
      var money = data[aidx - 1].money;
      var token = wx.getStorageSync('__appUserInfo').token;
      _server2.default.get(_urls2.default.links[0].usrecharge, { token: token, money: money }).then(function (res) {
        if (res.code == 0) {
          var nextAction = {
            ctype: 5,
            id: res.data.id,
            ptype: 0
          };
          wxpay.wxpay(app, money, res.data.id, 3, nextAction);
        } else if (res.code == 701) {
          wx.showConfirm({
            content: "\u7BA1\u7406\u5458\u672A\u5F00\u542F\u5145\u503C\u529F\u80FD\r\n\u5982\u6709\u7591\u95EE\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\u5DE5\u4F5C\u4EBA\u5458",
            success: function success(res) {}
          });
          return;
        }
      });
    }
  },
  handleGetCouponMask: function handleGetCouponMask() {
    this.setData({
      couponMask: false,
      couponNewMask: true
    });
  },
  handleCouponNewMask: function handleCouponNewMask(e) {
    if (app.globalData.userinfo == 1e4) {
      wx.navigateTo({
        url: "pages/pages/login/login"
      });
      return;
    } else {
      var show = e.currentTarget.dataset.show;
      this.setData({ couponNewMask: show });
    }
  },
  handleBalanceMask: function handleBalanceMask(e) {
    if (app.globalData.userinfo == 1e4) {
      wx.navigateTo({
        url: "pages/pages/login/login"
      });
      return;
    } else {
      var show = e.currentTarget.dataset.show;
      this.setData({ balanceMask: show });
    }
  },
  bindPickerChange: function bindPickerChange(e) {
    this.setData({
      rechargeIndex: e.detail.value
    });
  },
  handleCouponMask: function handleCouponMask(e) {
    if (app.globalData.userinfo == 1e4) {
      wx.navigateTo({
        url: "pages/pages/login/login"
      });
      return;
    } else {
      var show = e.currentTarget.dataset.show;
      this.setData({ couponMask: show });
    }
  },
  handleBalanceRefresh: function handleBalanceRefresh() {
    var _this = this;

    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].paypalcode, { token: token }).then(function (res) {
      if (res.code == 0) {
        _qrcode2.default.api.draw(res.data.paykey, 'QRcanvas', 200, 200);
        _barcode2.default.code128(wx.createCanvasContext('BARcanvas'), res.data.paykey, 600, 160);
        setTimeout(function () {
          that.canvasToQrTempImage();
        }, 800);
        setTimeout(function () {
          that.canvasToBarTempImage();
        }, 800);
        _this.userInfo();
      }
    });
  },
  bindChangeCoupon: function bindChangeCoupon(e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var money = e.currentTarget.dataset.money;
    var maxmoney = e.currentTarget.dataset.max;
    this.setData({
      couponId: id,
      couponType: type,
      couponMoney: money,
      couponMax: maxmoney
    });
  },
  bindCancelCoupon: function bindCancelCoupon() {
    this.setData({
      couponId: '',
      couponType: '',
      couponMoney: '',
      couponMax: ''
    });
  },
  bindGetNewCouponTap: function bindGetNewCouponTap(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].getcoupons, { token: token, id: id }).then(function (res) {
      if (res.code == 0) {
        that.couponNewList();
        that.myCouponList();
        wx.showToast({
          title: '领取成功',
          icon: 'success'
        });
      }
    });
  }
});