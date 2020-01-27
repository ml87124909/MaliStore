"use strict";

var _server = require("../../pages/modules/server.js");

var _server2 = _interopRequireDefault(_server);

var _urls = require("../../pages/modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wxpay(app, money, orderId, page, nextAction) {
  var remark = "在线充值";
  var token = wx.getStorageSync('__appUserInfo').token;
  if (orderId != 0) {
    remark = "支付订单 ：" + orderId;
  }
  _server2.default.get(_urls2.default.links[0].wechatpays, { token: token, money: money, remark: remark, payName: '在线支付', nextAction: nextAction }).then(function (res) {
    //console.log(res);
    if (res.code == 0) {
      //发起微信支付
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        fail: function fail() {
          wx.showToast({ title: '支付失败' });
        },
        success: function success() {
          wx.showToast({ title: '支付成功' });
          // 0 跳转订单列表页
          // 1 跳转首页
          // 2 跳转会员页
          // 3 跳转余额记录页（充值记录）
          // 4 跳转我的拼团页
          console.log('page', page);
          if (page == 0) {
            wx.redirectTo({
              url: '/pages/pages/user/order/order?id=0&share=1'
            });
          } else if (page == 1) {
            wx.switchTab({
              url: "/pages/pages/home/home"
            });
          } else if (page == 3) {
            wx.navigateTo({
              url: '/pages/pages/user/paypal/info/info?id=1'
            });
          } else if (page == 4) {
            wx.redirectTo({
              url: '/pages/pages/user/pingtuan/pingtuan'
            });
          }
        }
      });
    } else if (res.code == 1) {
      //无需支付
      wx.showToast({ title: '支付成功' });
      // 0 跳转订单列表页
      // 1 跳转首页
      // 2 跳转会员页
      // 3 跳转余额记录页（充值记录）
      if (page == 0) {
        wx.redirectTo({
          url: '/pages/pages/user/order/order?id=0&share=1'
        });
      } else if (page == 1) {
        wx.switchTab({
          url: "/pages/pages/home/home"
        });
      } else if (page == 3) {
        wx.navigateTo({
          url: '/pages/pages/user/paypal/info/info?id=1'
        });
      } else if (page == 4) {
        wx.redirectTo({
          url: '/pages/pages/user/pingtuan/pingtuan'
        });
      }
    }
  });
}

module.exports = {
  wxpay: wxpay
};