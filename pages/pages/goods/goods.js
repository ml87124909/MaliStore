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
    iphonex: false,
    codeMask: false,
    showMask: false,
    shareMask: false,
    shareTips: true,
    noneLogin: false,
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
  }), _defineProperty(_data, "numberStyle", {
    backgroundColor: '#ffd305',
    color: '#27323f',
    paddingLeft: '8rpx',
    paddingRight: '8rpx',
    marginLeft: '8rpx',
    marginRight: '8rpx',
    borderRadius: '2rpx',
    fontSize: '24rpx',
    display: 'inline-block'
  }), _data),
  onReady: function onReady() {
    var that = this;
    that.videoContext = wx.createVideoContext('goodsVideo');
  },
  onShow: function onShow() {
    var that = this;
    if (app.globalData.userinfo == 1e4) {
      that.setData({ noneLogin: true });
    } else {
      that.setData({ noneLogin: false });
      setTimeout(function () {
        if (app.globalData.userinfo == 1e4) {
          that.setData({ noneLogin: true });
        }
      }, 1000);
      that.onLoad(that.data.StoData);
    }
  },
  onLoad: function onLoad(e) {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    var cartInfo = wx.getStorageSync('__shopCarInfo');
    var shopInfo = wx.getStorageSync('__appShopInfo').shopInfo;
    that.setData({ StoData: e });
    //店铺信息
    if (shopInfo) {
      that.setData({ shopInfo: shopInfo });
    }
    //购物车信息
    if (cartInfo) {
      that.setData({ shopCarInfo: cartInfo, shopNum: cartInfo.shopNum });
    }
    if (e.id) {
      that.setData({ id: e.id });
      if (e.sid) {
        that.setData({ share: e.sid });
      }
      if (e.uid && e.uid != 'undefined') {
        wx.setStorage({ key: "__appInviter", data: { id: e.uid } });
        if (token) {
          that.getshareuser();
        }
      }
      //商品详情
      that.getgoodsdeft(e.id);
      if (token) {
        //收藏状态
        that.getfav(e.id);
        //商品评论
        that.reputation(e.id);
        //商品优惠券
        that.getGoodsCoupons(e.id);
        //增加浏览记录
        that.history(e.id);
      }
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
          if (uid && uid != 'undefined') {
            wx.setStorage({ key: "__appInviter", data: { id: uid } });
            if (token) {
              that.getshareuser();
            }
          }
          //商品详情
          that.getgoodsdeft(id);
          if (token) {
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
    }
    if (wx.IPHONEX == 0) {
      that.setData({ iphonex: true });
    }
  },
  //检查登录状态
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
  //商品详情
  getgoodsdeft: function getgoodsdeft(e) {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    wx.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
    _server2.default.get(_urls2.default.links[0].mlgoodsdet, { id: e, token: token }).then(function (res) {
      if (res.code == 0) {
        wx.hideLoading();
        that.setData({
          buyNumMax: res.data.basicInfo.stores,
          goodsDetail: res.data,
          picsnumber: res.data.pics.length,
          selectSizePrice: res.data.basicInfo.mini_price
        });
        _wxParse2.default.wxParse('content', 'html', res.data.basicInfo.content, that, 5);
        if (res.data.basicInfo.video) {
          that.getVideoUrl(res.data.basicInfo.video);
        }
        if (token) {
          if (res.data.vipInfo) {
            that.getuserInfo(res.data.vipInfo);
          } else {
            that.getuserInfo();
          }
          if (res.data.pingtuanInfo) {
            that.setData({
              pingtuan: res.data.pingtuanInfo,
              selectSizePTprice: res.data.pingtuanInfo.price
            });
            that.checkPingTuanGoodsList(e);
          }
        }
      } else {
        that.getgoodsdeft(e);
      }
    });
  },
  //该商品是否有在进行中的拼团
  checkPingTuanGoodsList: function checkPingTuanGoodsList(e) {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].openptgods, { token: token, goods: e }).then(function (res) {
      if (res.code == 0) {
        that.setData({
          openPingTuanList: res.data
        });
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
        //console.log('返现成功')
      }
    });
  },
  //解析视频地址
  getVideoUrl: function getVideoUrl(e) {
    var that = this;
    var Vurl = 'https://vv.video.qq.com/getinfo?vids=' + e + '&platform=101001&charge=0&otype=json';
    _server2.default.get(Vurl, {}).then(function (res) {
      var dataJson = res.replace(/QZOutputJson=/, '') + "qwe";
      var dataJson1 = dataJson.replace(/;qwe/, '');
      var data = JSON.parse(dataJson1);
      var url = data.vl.vi[0].ul.ui[0].url;
      var fu = data.vl.vi[0].fn;
      var fvkey = data.vl.vi[0].fvkey;
      var videoUrl = url + fu + '?vkey=' + fvkey;
      that.setData({
        videoUrl: videoUrl
      });
    });
  },
  //用户信息
  getuserInfo: function getuserInfo(e) {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
    if (e) {
      _server2.default.get(_urls2.default.links[0].mluserinfo, { token: token }).then(function (res) {
        if (res.code == 0) {
          if (res.data.vip_level == 0) {
            if (that.data.goodsDetail.pingtuanInfo) {
              var price = that.data.goodsDetail.pingtuanInfo.price * res.data.vip_sale / 100;
            } else {
              var price = that.data.goodsDetail.basicInfo.mini_price * res.data.vip_sale / 100;
            }
            that.setData({ userVip: price.toFixed(2) });
          } else {
            for (var i = 0; i < e.length; i++) {
              if (e[i].vip_id == res.data.vip_level) {
                that.setData({ userVip: e[i].vip_price });
              }
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
            propertyChildStore: res.data.goods_stores,
            selectSizePTprice: res.data.goods_pingtuan
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
      //console.log(res);
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
    var userid = wx.getStorageSync('__appUserInfo').uid;
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
      //console.log(data.basicInfo.pic)
      var basPic = data.basicInfo.pic
      if (data.basicInfo.pic.search("https:") == -1 ){
        var basPic = data.basicInfo.pic.replace(/'http:'/g, 'https:'); //商品图片
      }
      
      /*if (_urls2.default.images === 'A') {
        var basPic = data.basicInfo.pic.replace(/'http:\\/\\/'/g, 'https:\\/\\/'); //商品图片
      } else {
        var basPic = data.basicInfo.pic; //商品图片
      }*/
      
      //console.log(basPic)
      wx.downloadFile({
        url: basPic,
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
                _server2.default.get(_urls2.default.links[0].getqrcodes, { scene: 'i=' + data.basicInfo.id + ',u=' + userid + ',s=1', page: 'pages/pages/goods/goods' }).then(function (res) {
                  //console.log(res)
                  if (res.code == 0) {
                    wx.showLoading({ title: '下载小程序码' });
                    //已经将后台这个返回的链接默认为https
                    /*if (_urls2.default.images === 'A') {
                      var qrcodePic = res.data.qrimg.replace(/http:/g, 'https:'); //二维码图片
                    } else {
                      var qrcodePic = res.data.qrimg; //二维码图片
                    }*/
                    wx.downloadFile({
                      url: qrcodePic,
                      success: function success(qr) {
                        if (qr.statusCode === 200) {
                          //商品小程序码
                          var code = qr.tempFilePath;
                          //商品名字
                          var nams = data.basicInfo.name;
                          var nsta = nams.split('');
                          if (nsta.length >= 15) {
                            var name = data.basicInfo.name.substr(0, 15) + '...';
                          } else {
                            var name = data.basicInfo.name;
                          }
                          //商品介绍
                          var itcs = data.basicInfo.introduce.substr(0, 20);
                          var ista = itcs.split('');
                          if (ista.length >= 20) {
                            var itce = data.basicInfo.introduce.substr(0, 19) + '...';
                          } else {
                            var itce = data.basicInfo.introduce;
                          }
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
  //发起拼团
  fPingtuan: function fPingtuan() {
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
      var buyNowInfo = that.buliduBuyNowInfo(1);
      that.setData({ show: false });
      wx.setStorage({
        key: "__buyNowInfo",
        data: buyNowInfo
      });
      wx.navigateTo({
        url: "/pages/pages/payorder/payorder?orderType=buyNow&ktype=0&ktid=" + that.data.goodsDetail.pingtuanInfo.id
      });
    }, 1000);
    wx.showLoading({
      title: '商品准备中...'
    });
  },
  //参加拼团
  cPingtuan: function cPingtuan() {
    var that = this;
    var ktid = that.data.canTuanId;
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
      var buyNowInfo = that.buliduBuyNowInfo(1);
      that.setData({ show: false });
      wx.setStorage({
        key: "__buyNowInfo",
        data: buyNowInfo
      });
      wx.navigateTo({
        url: "/pages/pages/payorder/payorder?orderType=buyNow&ktype=1&ktid=" + ktid
      });
    }, 1000);
    wx.showLoading({
      title: '商品准备中...'
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
  buliduBuyNowInfo: function buliduBuyNowInfo(e) {
    var that = this;
    var shopCarMap = {};
    var guid = wx.getStorageSync('__appInviter').id;
    shopCarMap.goods_id = that.data.goodsDetail.basicInfo.id;
    shopCarMap.goods_pic = that.data.goodsDetail.basicInfo.pic;
    shopCarMap.goods_name = that.data.goodsDetail.basicInfo.name;
    shopCarMap.goods_childs = that.data.propertyChildIds;
    shopCarMap.goods_label = that.data.propertyChildNames;
    if (e) {
      shopCarMap.goods_price = that.data.selectSizePTprice;
    } else {
      shopCarMap.goods_price = that.data.selectSizePrice;
    }
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
    var that = this;
    var nums = e.detail.current;
    var data = that.data.goodsDetail.basicInfo;
    if (data.video) {
      if (nums != 0) {
        that.videoContext.pause();
      } else {
        that.videoContext.play();
      }
      that.setData({ swiperCurrent: nums });
    } else {
      that.setData({ swiperCurrent: nums });
    }
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
  //发起拼团点击事件
  toPingtuan: function toPingtuan() {
    var that = this;
    var id = that.data.goodsDetail.basicInfo.id;
    var ptid = that.data.goodsDetail.pingtuanInfo.id;
    var data = that.data.goodsDetail.specInfo;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].openewtuan, { token: token, goods: id, ptid: ptid }).then(function (res) {
      if (res.code == 0) {
        //that.setData({favicon: 1});
        if (data) {
          that.setData({
            shopType: "fPingtuan",
            show: true
          });
        } else {
          that.setData({
            shopType: "fPingtuan",
            show: true
          });
        }
      } else if (res.code == 301) {
        wx.showConfirm({
          content: "\u62FC\u56E2\u4FE1\u606F\u4E0D\u6B63\u786E\uFF0C\u8BF7\u68C0\u67E5\u540E\u91CD\u8BD5",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      } else if (res.code == 302) {
        wx.showConfirm({
          content: "\u62FC\u56E2\u5DF2\u7ECF\u7ED3\u675F\uFF0C\u4E0B\u6B21\u65E9\u70B9\u6765\u5662",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      } else if (res.code == 303) {
        wx.showConfirm({
          content: "\u6B64\u5546\u54C1\u5DF2\u7ECF\u5F00\u8FC7\u56E2\uFF0C\u8BF7\u7EE7\u7EED\u4E4B\u524D\u7684\u62FC\u56E2",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      } else if (res.code == 304) {
        wx.showConfirm({
          content: "\u8BE5\u5546\u54C1\u4EC5\u9650\u65B0\u7528\u6237\u53EF\u4EE5\u5F00\u56E2",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      } else if (res.code == 305) {
        wx.showConfirm({
          content: "\u8BE5\u5546\u54C1\u4EC5\u9650\u8001\u7528\u6237\u53EF\u4EE5\u5F00\u56E2",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      }
    });
  },
  //参加拼团点击事件
  toFaqiPingtuan: function toFaqiPingtuan(e) {
    var that = this;
    var ptid = that.data.goodsDetail.pingtuanInfo.id;
    var ptkid = e.currentTarget.dataset.id;
    var goods = that.data.goodsDetail.basicInfo.id;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].opentyuanc, { goods: goods, ptid: ptid, ptkid: ptkid, token: token }).then(function (res) {
      console.log(ptkid, res);
      if (res.code == 0) {
        that.setData({
          show: true,
          shopType: "cPingtuan",
          canTuanId: e.currentTarget.dataset.id
        });
      } else if (res.code == 301) {
        wx.showConfirm({
          content: "\u62FC\u56E2ID\u4E0D\u6B63\u786E\uFF0C\u8BF7\u68C0\u67E5\u540E\u91CD\u8BD5",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      } else if (res.code == 302) {
        wx.showConfirm({
          content: "\u5F00\u56E2ID\u4E0D\u6B63\u786E\uFF0C\u8BF7\u68C0\u67E5\u540E\u91CD\u8BD5",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      } else if (res.code == 303) {
        wx.showConfirm({
          content: "\u62FC\u56E2\u5DF2\u7ECF\u7ED3\u675F\uFF0C\u4E0B\u6B21\u65E9\u70B9\u6765\u54E6",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      } else if (res.code == 304) {
        wx.showConfirm({
          content: "\u62FC\u56E2\u5DF2\u7ECF\u8FC7\u671F\uFF0C\u4E0D\u80FD\u5728\u8FDB\u884C\u53C2\u56E2",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      } else if (res.code == 305) {
        wx.showConfirm({
          content: "\u8BE5\u5546\u54C1\u4EC5\u9650\u65B0\u7528\u6237\u53EF\u4EE5\u53C2\u56E2",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      } else if (res.code == 306) {
        wx.showConfirm({
          content: "\u8BE5\u5546\u54C1\u4EC5\u9650\u8001\u7528\u6237\u53EF\u4EE5\u53C2\u56E2",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      } else if (res.code == 307) {
        wx.showConfirm({
          content: "\u5DF2\u6709\u6B63\u5728\u8FDB\u884C\u7684\u62FC\u56E2\uFF0C\u8BF7\u7EE7\u7EED\u4E4B\u524D\u7684\u62FC\u56E2",
          showCancel: false,
          confirmColor: '#ffd305',
          confirmText: "\u6211\u77E5\u9053\u4E86",
          success: function success(res) {}
        });
        return;
      }
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
  //跳转拼团详情页
  getPingtuanTap: function getPingtuanTap(e) {
    wx.navigateTo({
      url: "/pages/pages/goods/pingtuan?id=" + e.currentTarget.dataset.id
    });
  },
  //跳转拼团说明页
  getPingtuanInfotap: function getPingtuanInfotap() {
    wx.navigateTo({
      url: "/pages/pages/goods/ptinfo"
    });
  },
  //分享事件
  onShareAppMessage: function onShareAppMessage() {
    var that = this;
    var data = that.data.goodsDetail;
    var user = wx.getStorageSync('__appUserInfo').uid;
    if (data.shareInfo.share_type != 0) {
      //分享返现
      if (data.shareInfo.share_title) {
        return {
          title: data.shareInfo.share_title,
          path: '/pages/pages/goods/goods?id=' + data.basicInfo.id + '&uid=' + user + '&sid=1',
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
          path: '/pages/pages/goods/goods?id=' + data.basicInfo.id + '&uid=' + user + '&sid=1',
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