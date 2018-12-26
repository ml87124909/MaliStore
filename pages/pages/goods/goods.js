"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _data;

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _utils = require("../../modules/utils.js");

var _utils2 = _interopRequireDefault(_utils);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

var _wxParse = require("../../../static/wxParse/wxParse.js");

var _wxParse2 = _interopRequireDefault(_wxParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();
exports.default = Page({
  data: (_data = {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
    width: wx.WIN_WIDTH,
    current: 0,
    value: 0,
    share: 0,
    show: false,
    show1: true,
    show2: false,
    codeMask: false,
    shareMask: false,
    videoMask: false,
    shareTips: true,
    shopNum: 0,
    scrollTop: 0,
    favicon: 0,
    navigationbar: '',
    goodsDetail: {},
    swiperCurrent: 0
  }, _defineProperty(_data, "width", wx.WIN_WIDTH), _defineProperty(_data, "selectptPrice", 0), _defineProperty(_data, "propertyChildIds", ""), _defineProperty(_data, "propertyChildNames", ""), _defineProperty(_data, "canSubmit", false), _defineProperty(_data, "gettopbtn", false), _defineProperty(_data, "shopCarInfo", {}), _defineProperty(_data, "buyNumber", 1), _defineProperty(_data, "buyNumMin", 1), _defineProperty(_data, "buyNumMax", 0), _defineProperty(_data, "propertyChildStore", null), _defineProperty(_data, "shopType", "addShopCar"), _defineProperty(_data, "customStyle", {
    'width': '100%',
    'color': '#27323f',
    'background-color': '#ffd305',
    'display': 'block',
    'margin-top': '-30rpx',
    'font-size': '20rpx',
    'padding': '0 12rpx 0 10rpx'
  }), _defineProperty(_data, "cartStyle", {
    'position': 'absolute',
    'top': '14rpx',
    'font-size': '22rpx',
    'color': '#27323f',
    'background-color': '#ffd305'
  }), _defineProperty(_data, "activeTabStyle", {
    'color': '#ffd305 !important',
    'border-bottom': '1px solid #ffd305',
    'width': '100% !important'
  }), _defineProperty(_data, "shareboxStyle", {
    'background-color': 'rgba(255, 255, 255, 0.8)'
  }), _defineProperty(_data, "codeboxStyle", {
    'background': 'rgba(51, 51, 51, 0.9)'
  }), _data),
  onLoad: function onLoad(e) {
    var that = this;
    var cartInfo = wx.getStorageSync('__shopCarInfo');
    var shopInfo = wx.getStorageSync('__appShopInfo').shopInfo;
    wx.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
    if (e.id) {
      that.setData({ id: e.id });
      if (e.sid) {
        that.setData({ share: e.sid });
      } else if (e.uid) {
        wx.setStorage({ key: "__appInviter", data: { id: e.uid } });
        that.getshareuser();
      }
      //商品详情
      that.getgoodsdeft(e.id);
      //收藏状态
      that.getfav(e.id);
      //商品评论
      that.reputation(e.id);
      //商品优惠券
      that.getGoodsCoupons(e.id);
      //增加浏览记录
      that.history(e.id);
    } else {
      var scene = decodeURIComponent(e.scene);
      if (scene.length > 0 && scene != undefined) {
        var scarr = scene.split(',');
        var dilist = [];
        for (var i = 0; i < scarr.length; i++) {
          dilist.push(scarr[i].split('='));
        }
        if (dilist.length > 0) {
          var dict = {};
          for (var j = 0; j < dilist.length; j++) {
            dict[dilist[j][0]] = dilist[j][1];
          }
          var id = dict.i;
          var uid = dict.u;
          var sid = dict.s;
          that.setData({ id: id, share: sid });
          if (uid) {
            wx.setStorage({ key: "__appInviter", data: { id: uid } });
            that.getshareuser();
          }
          //商品详情
          that.getgoodsdeft(id);
          //收藏状态
          that.getfav(id);
          //商品评论
          that.reputation(id);
          //商品优惠券
          that.getGoodsCoupons(id);
          //增加浏览记录
          that.history(id);
        }
      }
    }
    if (cartInfo) {
      that.setData({
        shopCarInfo: cartInfo,
        shopNum: cartInfo.shopNum
      });
    }
    that.setData({ shopInfo: shopInfo });
    //商品详情
  },
  //商品详情
  getgoodsdeft: function getgoodsdeft(e) {
    var that = this;
    _server2.default.get(_urls2.default.links[0].mlgoodsdet, { id: e }).then(function (res) {
      wx.hideLoading();
      if (res.code == 0) {
        that.setData({
          buyNumMax: res.data.basicInfo.stores,
          goodsDetail: res.data,
          picsnumber: res.data.pics.length,
          selectSizePrice: res.data.basicInfo.mini_price
        });
        _wxParse2.default.wxParse('content', 'html', res.data.basicInfo.content, that, 5);
        if (res.data.vipInfo) {
          that.getuserInfo(res.data.vipInfo);
        } else {
          that.getuserInfo();
        }
      }
    });
  },
  //用户返现
  getshareuser: function getshareuser() {
    var that = this;
    var gid = that.data.id;
    var uid = wx.getStorageSync('__appInviter').id;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].sharegoods, { token: token, user: uid, goods: gid }).then(function (res) {
      if (res.code == 0) {
        console.log('返现成功');
      }
    });
  },
  //用户信息
  getuserInfo: function getuserInfo(e) {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    if (e) {
      _server2.default.get(_urls2.default.links[0].mluserinfo, { token: token }).then(function (res) {
        if (res.code == 0) {
          for (var i = 0; i < e.length; i++) {
            if (e[i].vip_id == res.data.vip_level) {
              that.setData({ userVip: e[i] });
            }
          }
          that.setData({ userInfo: res.data });
        }
      });
    } else {
      _server2.default.get(_urls2.default.links[0].mluserinfo, { token: token }).then(function (res) {
        if (res.code == 0) {
          that.setData({ userInfo: res.data });
        }
      });
    }
  },
  //规格选择弹窗
  labelItemTap: function labelItemTap(e) {
    var that = this;
    var childs = that.data.goodsDetail.specInfo[e.currentTarget.dataset.propertyindex].spec_childs;
    for (var i = 0; i < childs.length; i++) {
      that.data.goodsDetail.specInfo[e.currentTarget.dataset.propertyindex].spec_childs[i].active = false;
    }
    that.data.goodsDetail.specInfo[e.currentTarget.dataset.propertyindex].spec_childs[e.currentTarget.dataset.propertychildindex].active = true;
    var needSelectNum = that.data.goodsDetail.specInfo.length;
    var curSelectNum = 0;
    var propertyChildIds = "";
    var propertyChildNames = "";
    for (var i = 0; i < that.data.goodsDetail.specInfo.length; i++) {
      childs = that.data.goodsDetail.specInfo[i].spec_childs;
      for (var j = 0; j < childs.length; j++) {
        if (childs[j].active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + that.data.goodsDetail.specInfo[i].spec_id + ":" + childs[j].chil_id + ",";
          propertyChildNames = propertyChildNames + that.data.goodsDetail.specInfo[i].spec_name + ":" + childs[j].chil_name + "  ";
          if (childs[j].chil_icons) {
            that.setData({
              propertyChildImage: childs[j].chil_icons
            });
          }
        }
      }
    }
    var canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    if (canSubmit) {
      _server2.default.get(_urls2.default.links[0].goodsprice, { goods_id: that.data.goodsDetail.basicInfo.id, goods_childs: propertyChildIds }).then(function (res) {
        if (res.code == 0) {
          that.setData({
            selectSizePrice: res.data.goods_mini,
            propertyChildIds: propertyChildIds,
            propertyChildNames: propertyChildNames,
            buyNumMax: res.data.goods_stores,
            buyNumber: res.data.goods_stores > 0 ? 1 : 0,
            goodsbarcode: res.data.goods_barcode,
            propertyChildStore: res.data.goods_stores
          });
        }
      });
    }
    that.setData({
      goodsDetail: that.data.goodsDetail,
      canSubmit: canSubmit,
      propertyChildNames: propertyChildNames
    });
  },
  //商品评论
  reputation: function reputation(id) {
    var _this = this;

    _server2.default.get(_urls2.default.links[0].reputation, { goods_id: id }).then(function (res) {
      if (res.code == 0) {
        _this.setData({ reputation: res.data });
      } else {
        _this.setData({ reputation: "" });
      }
    });
  },
  //获取商品关联的优惠券
  getGoodsCoupons: function getGoodsCoupons(id) {
    var that = this;
    var CouponsList = [];
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].couponlist, { token: token, goods: id }).then(function (res) {
      if (res.code == 0) {
        for (var i = 0; i < 2; i++) {
          CouponsList.push(res.data[i]);
        }
        that.setData({
          GoodsCoupons: res.data,
          CouponsList: CouponsList
        });
      }
    });
  },
  //领取优惠券
  getCouponsTap: function getCouponsTap(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var token = wx.getStorageSync('__appUserInfo').token;
    var goods = that.data.goodsDetail.basicInfo.id;
    _server2.default.get(_urls2.default.links[0].getcoupons, { token: token, id: id }).then(function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 2000
        });
        that.getGoodsCoupons(goods);
      }
    });
  },
  //滚动到指定位置把标题置顶
  onPageScroll: function onPageScroll(t) {
    this.setData({ scrollTop: t.scrollTop });
    if (t.scrollTop >= 220) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      });
      this.setData({
        navigationbar: "scrollTop",
        gettopbtn: true
      });
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ffffff'
      });
      this.setData({
        navigationbar: "",
        gettopbtn: false
      });
    }
  },
  //返回顶部
  gettopTap: function gettopTap() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
    this.setData({ gettopbtn: false });
  },
  //分享弹窗（选择分享类型）
  getshareboxTap: function getshareboxTap() {
    this.setData({
      shareMask: true,
      shareTips: false
    });
  },
  //预览海报
  previewqrTap: function previewqrTap(e) {
    var that = this;
    wx.previewImage({
      urls: [e.currentTarget.dataset.img]
    });
  },
  //视频弹窗
  getvideoplayerTap: function getvideoplayerTap(e) {
    var show = e.currentTarget.dataset.show;
    this.setData({
      videoMask: show
    });
  },
  //关闭海报
  codeimgShowMask: function codeimgShowMask(e) {
    var show = e.currentTarget.dataset.show;
    this.setData({
      codeMask: show
    });
  },
  //生成商品海报
  getshareimgTap: function getshareimgTap() {
    var that = this;
    var cimg = that.data.codeimg;
    if (cimg) {
      //如果已经生成过，直接显示
      that.setData({
        codeMask: true
      });
      wx.saveImageToPhotosAlbum({
        filePath: cimg,
        success: function success(res) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
        }
      });
    } else {
      var data = that.data.goodsDetail;
      var user = that.data.userInfo;
      var ctxs = wx.createCanvasContext('shareCanvas');
      wx.showLoading({ title: '正在准备生成' });
      //下载商品海报
      wx.downloadFile({
        url: data.basicInfo.pic,
        success: function success(pic) {
          if (pic.statusCode === 200) {
            //商品海报图片
            var pictmp = pic.tempFilePath;
            wx.showLoading({ title: '生成小程序码' });
            //下载用户头像
            wx.downloadFile({
              url: user.avatar,
              success: function success(avatar) {
                //用户头像
                var userpic = avatar.tempFilePath;
                _server2.default.get(_urls2.default.links[0].getqrcodes, { scene: 'i=' + data.basicInfo.id + ',u=' + app.globalData.userid + ',s=1', page: 'pages/pages/goods/goods' }).then(function (res) {
                  if (res.code == 0) {
                    wx.showLoading({ title: '下载小程序码' });
                    wx.downloadFile({
                      url: res.data.qrimg,
                      success: function success(qr) {
                        if (qr.statusCode === 200) {
                          //商品小程序码
                          var code = qr.tempFilePath;
                          //商品名字
                          var name = data.basicInfo.name;
                          //商品介绍
                          var itce = data.basicInfo.introduce;
                          //商品价格
                          var prie = data.basicInfo.mini_price;
                          //用户名字
                          var unam = user.name;
                          wx.showLoading({ title: '绘制海报图片' });
                          ctxs.setFillStyle('#ffffff');
                          ctxs.fillRect(0, 0, 600, 1000);
                          ctxs.setFillStyle('#27323f');
                          ctxs.setFontSize(26);
                          ctxs.setTextAlign('center');
                          ctxs.fillText(unam, 300, 130);
                          ctxs.setFillStyle('#f5f5f5');
                          ctxs.fillRect(60, 165, 480, 630);
                          ctxs.setFillStyle('#ffffff');
                          ctxs.fillRect(62, 166, 476, 628);
                          ctxs.drawImage(pictmp, 60, 166, 480, 480);
                          ctxs.setFillStyle('#27323f');
                          ctxs.setFontSize(28);
                          ctxs.setTextAlign('center');
                          ctxs.fillText(name, 300, 690);
                          ctxs.setFillStyle('#7b8196');
                          ctxs.setFontSize(22);
                          ctxs.setTextAlign('center');
                          ctxs.fillText(itce, 300, 725);
                          ctxs.setFillStyle('#a18d65');
                          ctxs.setFontSize(38);
                          ctxs.setTextAlign('center');
                          ctxs.fillText('¥' + prie, 300, 775);
                          ctxs.drawImage(code, 70, 810, 160, 160);
                          ctxs.setFillStyle('#999999');
                          ctxs.setFontSize(22);
                          ctxs.setTextAlign('left');
                          ctxs.fillText('长按图片，识别二维码', 250, 880);
                          ctxs.fillText('查看商品详情信息～', 250, 920);
                          ctxs.fill();
                          ctxs.beginPath();
                          ctxs.arc(300, 60, 40, 0, 2 * Math.PI);
                          ctxs.clip();
                          ctxs.drawImage(userpic, 260, 20, 80, 80);
                          ctxs.restore();
                          ctxs.save();
                          ctxs.draw();
                          wx.showLoading({ title: '合并海报图片' });
                          setTimeout(function () {
                            wx.canvasToTempFilePath({
                              x: 0,
                              y: 0,
                              width: 600,
                              height: 1000,
                              canvasId: 'shareCanvas',
                              success: function success(res) {
                                that.setData({
                                  codeimg: res.tempFilePath,
                                  codeMask: true
                                });
                                wx.showLoading({ title: '准备保存本地' });
                                wx.hideLoading();
                                wx.saveImageToPhotosAlbum({
                                  filePath: res.tempFilePath,
                                  success: function success(res) {
                                    wx.showToast({
                                      title: '保存成功',
                                      icon: 'success',
                                      duration: 2000
                                    });
                                  }
                                });
                              }
                            });
                          }, 500);
                        }
                      }
                    });
                  } else {
                    that.getshareimgTap();
                  }
                });
              }
            });
          }
        }
      });
    }
  },
  //加入购物车
  addShopCar: function addShopCar() {
    var that = this;
    if (that.data.goodsDetail.specInfo && !that.data.canSubmit) {
      if (!that.data.canSubmit) {
        wx.showModal({
          title: "\u63D0\u793A",
          content: "\u8BF7\u9009\u62E9\u5546\u54C1\u89C4\u683C\uFF01",
          showCancel: false
        });
      }
      return;
    }
    if (that.data.buyNumber < 1) {
      wx.showModal({
        title: "\u63D0\u793A",
        content: "\u5E93\u5B58\u4E0D\u8DB3\uFF0C\u8BF7\u9009\u62E9\u5176\u4ED6\u5546\u54C1",
        showCancel: false
      });
      return;
    }
    var shopCarInfo = that.bulidShopCarInfo();
    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum,
      show: false
    });
    wx.setStorage({
      key: "__shopCarInfo",
      data: shopCarInfo
    });
    wx.showToast({
      title: "\u52A0\u5165\u8D2D\u7269\u8F66\u6210\u529F",
      icon: 'success',
      duration: 2000
    });
  },
  buyNow: function buyNow() {
    var that = this;
    if (that.data.goodsDetail.specInfo && !that.data.canSubmit) {
      wx.hideLoading();
      if (!that.data.canSubmit) {
        wx.showModal({
          title: "\u63D0\u793A",
          content: "\u8BF7\u9009\u62E9\u5546\u54C1\u89C4\u683C\uFF01",
          showCancel: false
        });
      }
      wx.showModal({
        title: "\u63D0\u793A",
        content: "\u8BF7\u5148\u9009\u62E9\u89C4\u683C\u5C3A\u5BF8\u54E6~",
        showCancel: false
      });
      return;
    }
    if (that.data.buyNumber < 1) {
      wx.hideLoading();
      wx.showModal({
        title: "\u63D0\u793A",
        content: "\u8D2D\u4E70\u6570\u91CF\u4E0D\u80FD\u4E3A0\uFF01",
        showCancel: false
      });
      return;
    }
    setTimeout(function () {
      wx.hideLoading();
      var buyNowInfo = that.buliduBuyNowInfo();
      that.setData({ show: false });
      wx.setStorage({
        key: "__buyNowInfo",
        data: buyNowInfo
      });
      wx.navigateTo({
        url: "/pages/pages/payorder/payorder?orderType=buyNow"
      });
    }, 1000);
    wx.showLoading({
      title: '商品准备中...'
    });
  },
  buliduBuyNowInfo: function buliduBuyNowInfo() {
    var that = this;
    var shopCarMap = {};
    var guid = wx.getStorageSync('__appInviter').id;
    shopCarMap.goods_id = that.data.goodsDetail.basicInfo.id;
    shopCarMap.goods_pic = that.data.goodsDetail.basicInfo.pic;
    shopCarMap.goods_name = that.data.goodsDetail.basicInfo.name;
    shopCarMap.goods_childs = that.data.propertyChildIds;
    shopCarMap.goods_label = that.data.propertyChildNames;
    shopCarMap.goods_price = that.data.selectSizePrice;
    shopCarMap.active = true;
    shopCarMap.buy_number = that.data.buyNumber;
    shopCarMap.goods_weight = that.data.goodsDetail.basicInfo.weight;
    if (guid) {
      shopCarMap.inviter_user = guid;
    }
    var buyNowInfo = {};
    if (!buyNowInfo.shopNum) {
      buyNowInfo.shopNum = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    buyNowInfo.shopList.push(shopCarMap);
    return buyNowInfo;
  },
  bulidShopCarInfo: function bulidShopCarInfo() {
    var that = this;
    var shopCarMap = {};
    var guid = wx.getStorageSync('__appInviter').id;
    shopCarMap.goods_id = that.data.goodsDetail.basicInfo.id;
    shopCarMap.goods_pic = that.data.goodsDetail.basicInfo.pic;
    shopCarMap.goods_name = that.data.goodsDetail.basicInfo.name;
    shopCarMap.goods_childs = that.data.propertyChildIds;
    shopCarMap.goods_label = that.data.propertyChildNames;
    shopCarMap.goods_price = that.data.selectSizePrice;
    shopCarMap.active = true;
    shopCarMap.buy_number = that.data.buyNumber;
    shopCarMap.goods_weight = that.data.goodsDetail.basicInfo.weight;
    if (guid) {
      shopCarMap.inviter_user = guid;
    }
    var shopCarInfo = that.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goods_id == shopCarMap.goods_id && tmpShopCarMap.goods_childs == shopCarMap.goods_childs) {
        hasSameGoodsIndex = i;
        shopCarMap.buy_number = shopCarMap.buy_number + tmpShopCarMap.buy_number;
        break;
      }
    }
    shopCarInfo.shopNum = shopCarInfo.shopNum + that.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    return shopCarInfo;
  },
  numJianTap: function numJianTap() {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      });
    }
  },
  numJiaTap: function numJiaTap() {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      });
    }
  },
  //查询收藏
  getfav: function getfav(e) {
    var that = this;
    var id = that.data.id;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].favorilist, { token: token, goods_id: e }).then(function (res) {
      if (res.code == 0) {
        that.setData({ favicon: 1 });
      }
    });
  },
  //新增收藏
  fav: function fav() {
    var _this2 = this;

    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].favoriadds, { token: token, id: that.data.goodsDetail.basicInfo.id }).then(function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: "\u6536\u85CF\u6210\u529F",
          icon: 'success',
          image: '../../../images/active.png',
          duration: 2000
        });
        _this2.setData({ favicon: 1 });
      }
    });
  },
  //删除收藏
  del: function del() {
    var _this3 = this;

    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].favoredels, { token: token, id: that.data.goodsDetail.basicInfo.id }).then(function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: "\u53D6\u6D88\u6536\u85CF",
          icon: 'success',
          image: '../../../images/error.png',
          duration: 2000
        });
        _this3.setData({ favicon: 0 });
      }
    });
  },
  //新增浏览历史
  history: function history(e) {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].mlghistory, { token: token, id: e }).then(function (res) {
      if (res.code == 0) {}
    });
  },
  swiperChange: function swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  navigateBack: function navigateBack() {
    wx.navigateBack();
  },

  handleChange: function handleChange(e) {
    var that = this;
    var index = e.detail.index;
    if (index) {
      that.setData({
        index: index,
        show1: false,
        show2: true
      });
    } else {
      that.setData({
        index: index,
        show1: true,
        show2: false
      });
    }
  },
  openPopup: function openPopup(e) {
    var show = e.currentTarget.dataset.show;
    this.setData({
      show: show
    });
  },
  //打开领取优惠券弹窗
  openPopupCoupons: function openPopupCoupons(e) {
    var Couponshow = e.currentTarget.dataset.show;
    this.setData({
      Couponshow: Couponshow
    });
  },
  //关闭领取优惠券弹窗
  handleCouponshow: function handleCouponshow() {
    this.setData({
      Couponshow: false
    });
  },
  //点击立即加入购物车按钮事件
  toAddShopCar: function toAddShopCar() {
    this.setData({
      shopType: "addShopCar",
      show: true
    });
  },
  //点击立即购买按钮事件
  tobuy: function tobuy() {
    this.setData({
      shopType: "tobuy",
      show: true
    });
  },
  //跳转购物车事件
  goShopCar: function goShopCar() {
    wx.reLaunch({
      url: "/pages/pages/shopcart/shopcart"
    });
  },
  //商品下架，返回首页事件
  gethomeTap: function gethomeTap() {
    wx.switchTab({
      url: "/pages/pages/home/home"
    });
  },
  //跳转会员中心
  getmamberTap: function getmamberTap() {
    wx.navigateTo({
      url: "/pages/pages/user/member/member"
    });
  },
  //跳转首页
  getHomeTap: function getHomeTap() {
    wx.switchTab({
      url: "/pages/pages/home/home"
    });
  },
  //分享事件
  onShareAppMessage: function onShareAppMessage() {
    var that = this;
    var data = that.data.goodsDetail;
    if (data.shareInfo.share_type != 0) {
      //分享返现
      if (data.shareInfo.share_title) {
        return {
          title: data.shareInfo.share_title,
          path: '/pages/pages/goods/goods?id=' + data.basicInfo.id + '&uid=' + app.globalData.userid + '&sid=1',
          imageUrl: data.shareInfo.share_imgs,
          success: function success(res) {
            // 转发成功
          },
          fail: function fail(res) {
            // 转发失败
          }
        };
      } else {
        return {
          title: data.basicInfo.name + ' - ' + data.basicInfo.introduce,
          path: '/pages/pages/goods/goods?id=' + data.basicInfo.id + '&uid=' + app.globalData.userid + '&sid=1',
          imageUrl: data.basicInfo.pic,
          success: function success(res) {
            // 转发成功
          },
          fail: function fail(res) {
            // 转发失败
          }
        };
      }
    } else {
      if (data.shareInfo.share_title) {
        return {
          title: data.shareInfo.share_title,
          path: '/pages/pages/goods/goods?id=' + data.basicInfo.id + '&sid=1',
          imageUrl: data.shareInfo.share_imgs,
          success: function success(res) {
            // 转发成功
          },
          fail: function fail(res) {
            // 转发失败
          }
        };
      } else {
        return {
          title: data.basicInfo.name + ' - ' + data.basicInfo.introduce,
          path: '/pages/pages/goods/goods?id=' + data.basicInfo.id + '&sid=1',
          imageUrl: data.basicInfo.pic,
          success: function success(res) {
            // 转发成功
          },
          fail: function fail(res) {
            // 转发失败
          }
        };
      }
    }
  }
});