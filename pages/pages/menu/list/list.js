"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
        popup_NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
        popupHeight: wx.WIN_HEIGHT - (wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT),
        scrollTop: 0,
        show1: false,
        show2: false,
        current: 0,
        checklist1: [],
        checklist2: [],
        customStyle: {
            'background-color': '#eee',
            'height': '46px',
            'line-height': '46px'
        },
        sortList1: ["\u4EF7\u683C\u4ECE\u9AD8\u5230\u4F4E", "\u4EF7\u683C\u4ECE\u4F4E\u5230\u9AD8"],
        sortList2: ["\u9500\u91CF\u4ECE\u9AD8\u5230\u4F4E", "\u9500\u91CF\u4ECE\u4F4E\u5230\u9AD8"],
        navList: [{
            name: "\u4EF7\u683C\u6392\u5E8F",
            active: '',
            arrow: 'slide_down',
            bindtap: 'openPopup1'
        }, {
            name: "\u9500\u91CF\u6392\u5E8F",
            active: '',
            arrow: 'slide_down',
            bindtap: 'openPopup2'
        }]
    },
    onLoad: function onLoad(e) {
        var that = this;
        wx.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
        that.setData({ id: e.id, name: e.name, pid: e.pid });
        //商品二级分类
        _server2.default.get(_urls2.default.links[0].categorydf, { id: e.pid, tid: e.id }).then(function (res) {
            if (res.code == 0) {
                that.setData({ categorieslist: res.data });
                for (var i = 0; i < res.data.length; i++) {
                    if (e.id == res.data[i].id) {
                        that.setData({ remark: res.data[i].remark });
                    }
                }
            } else {
                that.setData({ categorieslist: 0 });
            }
        });
        //分类下对应的商品
        _server2.default.get(_urls2.default.links[0].mlgoodlist, { category_id: e.id }).then(function (res) {
            if (res.code == 0) {
                wx.hideLoading();
                that.setData({ goods: res.data });
            } else {
                wx.hideLoading();
                that.setData({ goods: '' });
            }
        });
    },
    handleChange: function handleChange(e) {
        var that = this;
        var inde = e.detail.index; //传过来的数值
        var data = that.data.categorieslist; //二级分类数据
        that.setData({ current: inde, goods: '' });
        for (var i = 0; i < data.length; i++) {
            if (inde == i) {
                //分类下对应的商品
                that.setData({ remark: data[i].remark });
                _server2.default.get(_urls2.default.links[0].mlgoodlist, { category_id: data[i].id }).then(function (res) {
                    if (res.code == 0) {
                        that.setData({ goods: res.data });
                    } else {
                        that.setData({ goods: '' });
                    }
                });
            }
        }
    },
    toDetailsTap: function toDetailsTap(e) {
        wx.navigateTo({
            url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
        });
    },
    onPageScroll: function onPageScroll(e) {
        this.setData({ scrollTop: e.scrollTop });
    },
    openPopup: function openPopup(e) {
        wx.pageScrollTo({
            scrollTop: this.data.swiperHeight
        });
        var index = e.currentTarget.dataset.idx;
        if (index === 0) {
            this.setData({
                show2: false,
                show1: !this.data.show1
            });
        } else if (index === 1) {
            this.setData({
                show1: false,
                show2: !this.data.show2
            });
        }
    },
    popHide1: function popHide1() {
        this.data.navList[0].active = '';
        this.setData({
            show1: false,
            navList: this.data.navList
        });
    },
    popShow1: function popShow1() {
        this.data.navList[0].active = 'active';
        this.setData({
            show1: true,
            navList: this.data.navList
        });
    },
    popHide2: function popHide2() {
        this.data.navList[1].active = '';
        this.setData({
            show2: false,
            navList: this.data.navList
        });
    },
    popShow2: function popShow2() {
        console.log(this.data.show2);
        this.data.navList[1].active = 'active';
        this.setData({
            show2: true,
            navList: this.data.navList
        });
    },
    change1: function change1(e) {
        var val = e.detail.value;
        this.data.navList[0].name = val.join('-');
        this.setData({
            navList: this.data.navList,
            show1: false
        });
    },
    change2: function change2(e) {
        var val = e.detail.value;
        this.data.navList[1].name = val.join('-');
        this.setData({
            navList: this.data.navList,
            show2: false
        });
    },
    handleContentChange: function handleContentChange(e) {
        var that = this;
        var curr = e.detail.current; //传过来的数值
        var data = that.data.categorieslist; //二级分类数据
        that.setData({ current: curr });
        wx.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
        for (var i = 0; i < data.length; i++) {
            if (curr == i) {
                //分类下对应的商品
                that.setData({ remark: data[i].remark });
                _server2.default.get(_urls2.default.links[0].mlgoodlist, { category_id: data[i].id }).then(function (res) {
                    if (res.code == 0) {
                        wx.hideLoading();
                        that.setData({ goods: res.data });
                    } else {
                        wx.hideLoading();
                        that.setData({ goods: '' });
                    }
                });
            }
        }
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});