'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectToStyle = require('../../libs/objectToStyle.js');

var _objectToStyle2 = _interopRequireDefault(_objectToStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Component({
  properties: {
    headerHeight: {
      type: [String, Number],
      value: 50
    },
    state: {
      type: String,
      value: 'hide',
      observer: function observer(val) {
        this.data.selfState = val;
        if (this.data.selfState === 'show') {
          this.data.selfState = 'hide';
        } else {
          this.data.selfState = 'show';
        }
        this.setData({
          buttonImageObj: this.buttonImageObjFunc(),
          contentObj: this.contentObjFunc()
        });
      }
    },
    animate: {
      type: [String, Boolean],
      value: true
    },
    animateDuration: {
      type: [String, Number],
      value: 0.3
    },
    showArrow: {
      type: [String, Boolean],
      value: true
    }
  },

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的初始数据
   */
  data: {
    selfState: 'hide',
    triangleImg: './images/triangle.png',
    selfAnimateDuration: 0.3,
    buttonImageObj: {},
    contentObj: {}
  },

  ready: function ready() {
    var _this = this;

    this.data.selfAnimateDuration = this.properties.animateDuration;
    this.data.selfState = this.properties.state;
    this.data.slotHeight = this.data.headerHeight;
    this.setData({});

    wx.createSelectorQuery().in(this).select('.content').boundingClientRect(function (res) {
      _this.data.contentHeight = res.height;
    }).exec();

    this.setData({
      buttonImageObj: this.buttonImageObjFunc(),
      contentObj: this.contentObjFunc(),
      buttonImageStyle: (0, _objectToStyle2.default)(this.buttonImageStyleObj())
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchStartHandler: function touchStartHandler() {
      if (this.data.selfState === 'show') {
        this.data.selfState = 'hide';
      } else {
        this.data.selfState = 'show';
      }
      this.setData({
        buttonImageObj: this.buttonImageObjFunc(),
        contentObj: this.contentObjFunc()
      });
    },
    touchMoveHandler: function touchMoveHandler() {},
    touchEndHandler: function touchEndHandler() {},
    buttonImageStyleObj: function buttonImageStyleObj() {
      var style = {};
      style.top = this.data.slotHeight / 2 - 4 + 'px';
      return style;
    },
    buttonImageObjFunc: function buttonImageObjFunc() {
      var style = {};
      style.top = 18 + 'px';
      if (this.data.animate) {
        style.transition = 'transform ' + this.data.selfAnimateDuration + 's';
      }
      if (this.data.selfState === 'hide') {
        style.transform = 'rotate(0deg)';
      } else {
        style.transform = 'rotate(180deg)';
      }
      return style;
    },
    contentObjFunc: function contentObjFunc() {
      var style = {};
      if (this.data.animate) {
        style.transition = 'height ' + this.data.selfAnimateDuration + 's';
      }
      if (this.data.selfState === 'hide') {
        style.height = 0;
      } else {
        style.height = this.data.contentHeight;
      }
      return style;
    }
  }
});