'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectToStyle = require('../../libs/objectToStyle.js');

var _objectToStyle2 = _interopRequireDefault(_objectToStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Component({
  behaviors: [],
  properties: {
    data: {
      type: [Array, Object],
      value: {
        normalSrc: './images/starnone.png',
        selectedSrc: './images/starfull.png',
        halfSrc: './images/starhalf.png'
      },
      observer: function observer(val) {
        console.log(val);
        this.setData({
          starArray: this.data.starArray,
          data: val
        });
      }
    },
    starWidth: {
      type: [Number, String],
      value: 35
    },
    starHeight: {
      type: [Number, String],
      value: 35
    },
    half: {
      type: Boolean,
      value: false
    },
    value: {
      type: [Number, String],
      value: 0,
      observer: function observer(val) {
        this.selectStar(val);
      }
    },
    length: {
      type: [Number, String],
      value: 5
    },
    readonly: {
      type: Boolean,
      value: false
    }
  },
  data: {
    starArray: [],
    selfValue: 0,
    selfLength: 0,
    selfStarWidth: 0,
    selfStarHeight: 0
  },
  attached: function attached() {
    this.data.selfLength = Number(this.data.length);
    this.data.selfValue = Number(this.data.value);
    console.log(this.data.selfLength);
    this.data.selfStarWidth = Number(this.data.starWidth);
    this.data.selfStarHeight = Number(this.data.starHeight);

    this.setData({
      selfLength: this.data.selfLength,
      selfValue: this.data.selfValue,
      selfStarWidth: this.data.selfStarWidth,
      selfStarHeight: this.data.selfStarWidth,
      starsWrapStyle: (0, _objectToStyle2.default)(this.starsWrapStyleObj()),
      starWrapStyle: (0, _objectToStyle2.default)(this.starWrapStyleObj())
    });

    this.selectStar(this.data.selfValue);
  },

  methods: {
    /* 
      星星个数
    */
    tapHandler: function tapHandler(e) {
      var _this = this;

      if (this.data.readonly) {
        return;
      }
      // let offsetX = (e.detail.x - e.currentTarget.offsetLeft)
      wx.createSelectorQuery().in(this).select('.stars-wrap').boundingClientRect(function (res) {
        var offsetX = e.detail.x - res.left;
        var percent = offsetX / (_this.data.selfStarWidth * _this.data.selfLength);
        var value = void 0;
        if (_this.data.half) {
          value = Number(percent * _this.data.selfLength).toFixed(1);
          if (Number(value.split('.')[1]) < 5) {
            // 是否小于5
            value = _this.selectStar(Math.floor(value.split('.')[0]) + 0.5);
          } else {
            value = _this.selectStar(Math.floor(value.split('.')[0]) + 1);
          }
        } else {
          value = _this.selectStar(Math.floor(percent * _this.data.selfLength) + 1);
        }
        _this.triggerEvent('change', value);
      }).exec();
    },
    selectStar: function selectStar(value) {
      value = Number(value);
      this.data.starArray.length = 0;
      var starNum = Math.floor(value);
      var fixNum = Number(('' + value).split('.')[1]);
      var count = 0;
      for (var i = 0; i < starNum; i++) {
        this.data.starArray.push('selected');
        count++;
      }
      if (fixNum) {
        this.data.starArray.push('half');
        count++;
      }
      for (var _i = count; _i < this.data.length; _i++) {
        this.data.starArray.push('normal');
      }
      this.setData({
        starArray: this.data.starArray,
        value: value
      });
      return value;
    },
    starsWrapStyleObj: function starsWrapStyleObj() {
      var style = {};
      style.height = this.data.selfStarHeight + 'px';
      style.width = this.data.selfStarWidth * this.data.selfLength + 'px';
      return style;
    },
    starWrapStyleObj: function starWrapStyleObj() {
      var style = {};
      style.height = this.data.selfStarHeight + 'px';
      style.width = this.data.selfStarWidth + 'px';
      return style;
    }
  }
});