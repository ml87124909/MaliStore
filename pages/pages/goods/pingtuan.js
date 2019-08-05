"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

var _wxParse = require("../../../static/wxParse/wxParse.js");

var _wxParse2 = _interopRequireDefault(_wxParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        numberStyle: {
            backgroundColor: '#ffd305',
            color: '#27323f',
            paddingLeft: '8rpx',
            paddingRight: '8rpx',
            marginLeft: '8rpx',
            marginRight: '8rpx',
            borderRadius: '2rpx',
            fontSize: '24rpx',
            display: 'inline-block'
        },
        show: false,
        share: false,
        shopType: "cPingtuan",
        buyNumber: 1,
        buyNumMin: 1,
        buyNumMax: 0,
        showMask: false,
        iphonex: false,
        codeMask: false,
        propertyChildIds: '',
        shareboxStyle: {
            'background-color': 'rgba(255, 255, 255, 0.8)'
        },
        codeboxStyle: {
            'background': 'rgba(51, 51, 51, 0.9)'
        }
    },
    onPullDownRefresh: function onPullDownRefresh() {
        var that = this;
        var id = that.data.pingTuanDetail.kid;
        that.ptundetailTap(id);
        wx.stopPullDownRefresh();
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
        that.setData({ StoData: e });
        if (e.id) {
            that.ptundetailTap(e.id);
            if (e.sid) {
                that.setData({ share: true });
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
                    var sid = dict.s;
                    that.ptundetailTap(id);
                    if (sid) {
                        that.setData({ share: true });
                    }
                }
            }
        }
        _server2.default.get(_urls2.default.links[0].recptgoods, {}).then(function (res) {
            that.setData({
                ptGoodsList: res.data
            });
        });
        if (wx.IPHONEX == 0) {
            that.setData({ iphonex: true });
        }
    },
    ptundetailTap: function ptundetailTap(e) {
        var that = this;
        var userId = wx.getStorageSync('__appUserInfo').uid;
        _server2.default.get(_urls2.default.links[0].ptundetail, { ptkid: e }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    userId: userId,
                    pingTuanDetail: res.data,
                    selectSizePTprice: res.data.ptprice
                });
                that.getgoodsdeft(res.data.gid);
                _wxParse2.default.wxParse('content', 'html', res.data.gcontent, that, 5);
                that.getuserInfo();
            }
        });
    },
    getgoodsdeft: function getgoodsdeft(e) {
        var that = this;
        _server2.default.get(_urls2.default.links[0].mlgoodsdet, { id: e }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    buyNumMax: res.data.basicInfo.stores,
                    goodsDetail: res.data,
                    picsnumber: res.data.pics.length,
                    selectSizePrice: res.data.basicInfo.mini_price
                });
            }
        });
    },
    //用户信息
    getuserInfo: function getuserInfo() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].mluserinfo, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({ userInfo: res.data });
            }
        });
    },
    //分享弹窗（选择分享类型）
    getshareboxTap: function getshareboxTap() {
        this.setData({
            shareMask: true
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
    //参加拼团点击事件
    toPingtuan: function toPingtuan() {
        var that = this;
        var id = that.data.pingTuanDetail.gid;
        var ptid = that.data.pingTuanDetail.id;
        var ptkid = that.data.pingTuanDetail.kid;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].opentyuanc, { goods: id, ptid: ptid, ptkid: ptkid, token: token }).then(function (res) {
            console.log(res);
            if (res.code == 0) {
                that.setData({
                    shopType: "cPingtuan",
                    show: true
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
    //参加拼团
    cPingtuan: function cPingtuan() {
        var that = this;
        var ktid = that.data.pingTuanDetail.kid;
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
            var ptid = that.data.pingTuanDetail.kid; //开团ID
            var shot = that.data.pingTuanDetail.short; //还差几人成团
            var pric = that.data.pingTuanDetail.ptprice; //拼团价
            var nams = that.data.pingTuanDetail.gname; //商品名字
            var nsta = nams.split('');
            if (nsta.length >= 15) {
                var name = that.data.pingTuanDetail.gname.substr(0, 15) + '...';
            } else {
                var name = that.data.pingTuanDetail.gname;
            }
            if (_urls2.default.images === 'A') {
                var basPic = that.data.pingTuanDetail.gpic.replace(/http:/g, 'https:'); //商品图片
            } else {
                var basPic = that.data.pingTuanDetail.gpic; //商品图片
            }
            var user = that.data.userInfo; //用户信息
            var ctxs = wx.createCanvasContext('shareCanvas');
            wx.showLoading({ title: '正在准备生成' });
            //下载商品海报
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
                                //用户名字
                                var unam = user.name;
                                //用户头像
                                var userpic = avatar.tempFilePath;
                                _server2.default.get(_urls2.default.links[0].getqrcodes, { scene: 'i=' + ptid + ',s=1', page: 'pages/pages/goods/pingtuan' }).then(function (res) {
                                    if (res.code == 0) {
                                        wx.showLoading({ title: '下载小程序码' });
                                        if (_urls2.default.images === 'A') {
                                            var qrcodePic = res.data.qrimg.replace(/http:/g, 'https:'); //二维码图片
                                        } else {
                                            var qrcodePic = res.data.qrimg; //二维码图片
                                        }
                                        wx.downloadFile({
                                            url: qrcodePic,
                                            success: function success(qr) {
                                                if (qr.statusCode === 200) {
                                                    //商品小程序码
                                                    var code = qr.tempFilePath;
                                                    wx.showLoading({ title: '绘制海报图片' });
                                                    ctxs.setFillStyle('#ffd305');
                                                    ctxs.fillRect(0, 0, 600, 1000);
                                                    ctxs.setFillStyle('#27323f');
                                                    ctxs.setFontSize(26);
                                                    ctxs.setTextAlign('center');
                                                    ctxs.fillText(unam, 300, 130);
                                                    ctxs.setFillStyle('#ffffff');
                                                    ctxs.fillRect(60, 165, 480, 480);
                                                    ctxs.drawImage(pictmp, 60, 166, 480, 480);
                                                    ctxs.setFillStyle('#27323f');
                                                    ctxs.setFontSize(28);
                                                    ctxs.setTextAlign('left');
                                                    ctxs.fillText('拼团价', 60, 690);
                                                    ctxs.setFontSize(42);
                                                    ctxs.setTextAlign('left');
                                                    ctxs.fillText('¥' + pric, 155, 692);
                                                    ctxs.setFontSize(28);
                                                    ctxs.fillText('【还差' + shot + '人】快来和我一起拼', 46, 730);
                                                    ctxs.setFillStyle('#27323f');
                                                    ctxs.setFontSize(30);
                                                    ctxs.fillText(name, 60, 772);
                                                    ctxs.setFillStyle('#7b8196');
                                                    ctxs.setFontSize(22);
                                                    ctxs.setTextAlign('center');
                                                    ctxs.setFillStyle('#a18d65');
                                                    ctxs.setFontSize(38);
                                                    ctxs.setTextAlign('center');
                                                    ctxs.save();
                                                    ctxs.fill();
                                                    ctxs.beginPath();
                                                    ctxs.arc(150, 890, 80, 0, 2 * Math.PI);
                                                    ctxs.clip();
                                                    ctxs.drawImage(code, 70, 810, 160, 160);
                                                    ctxs.restore();
                                                    ctxs.save();
                                                    ctxs.beginPath();
                                                    ctxs.arc(300, 60, 40, 0, 2 * Math.PI);
                                                    ctxs.clip();
                                                    ctxs.drawImage(userpic, 260, 20, 80, 80);
                                                    ctxs.restore();
                                                    ctxs.save();
                                                    ctxs.setFillStyle('#27323f');
                                                    ctxs.setFontSize(26);
                                                    ctxs.setTextAlign('left');
                                                    ctxs.fillText('长按图片，识别二维码', 250, 875);
                                                    ctxs.fillText('马上参与拼团～', 250, 925);
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
    //分享事件
    onShareAppMessage: function onShareAppMessage() {
        var that = this;
        var ptid = that.data.pingTuanDetail.kid;
        var shot = that.data.pingTuanDetail.short;
        var pric = that.data.pingTuanDetail.ptprice;
        var name = that.data.pingTuanDetail.gname;
        that.setData({ shareMask: false });
        return {
            title: '【还差' + shot + '人】快来' + pric + '元拼' + name,
            path: '/pages/pages/goods/pingtuan?id=' + ptid + '&sid=1',
            success: function success(res) {
                // 转发成功
            }
        };
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
    getGoodsTap: function getGoodsTap(e) {
        wx.navigateTo({
            url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
        });
    },
    getPingTuanGoodsTap: function getPingTuanGoodsTap() {
        wx.navigateTo({
            url: "/pages/pages/menu/pingtuan/pingtuan"
        });
    },
    getHomeTap: function getHomeTap() {
        wx.switchTab({
            url: "/pages/pages/home/home"
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});