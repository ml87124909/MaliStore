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
    if (res.code == 0) {
      //发起支付
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
          if (page == 0) {
            wx.redirectTo({
              url: '/pages/pages/user/order/order?id=0&share=1'
            });
          }
          if (page == 1) {
            wx.switchTab({
              url: "/pages/pages/home/home"
            });
          }
          if (page == 3) {
            wx.navigateTo({
              url: '/pages/pages/user/paypal/info/info?id=1'
            });
          }
        }
      });
    }
    if (res.code == 10000) {
      wx.showConfirm({
        content: "\u5FAE\u4FE1\u5546\u6237\u4FE1\u606F\u672A\u914D\u7F6E\u6216\u8005\u914D\u7F6E\u4E0D\u6B63\u786E\uFF0C\u8BF7\u68C0\u67E5\u540E\u91CD\u8BD5\uFF01",
        showCancel: false,
        confirmColor: '#ffd305',
        confirmText: "\u6211\u77E5\u9053\u4E86",
        success: function success(res) {}
      });
      return;
    }
  });
}

module.exports = {
  wxpay: wxpay
};