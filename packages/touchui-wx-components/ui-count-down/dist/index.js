'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _StyleHelper = require('../../libs/StyleHelper.js');

var _StyleHelper2 = _interopRequireDefault(_StyleHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var moment = require('../../../moment/moment.js');

exports.default = Component({
  behaviors: [],
  properties: _defineProperty({
    time: {
      type: [Number, String],
      value: moment().add(1, 'days').format('YYYY/MM/DD HH:mm:ss')
    },
    timetype: {
      type: String,
      value: 'datetime'
    },
    format: {
      type: String,
      value: '{%d}天{%h}时{%m}分{%s}秒'
    },
    doneText: {
      type: String,
      value: ''
    },
    numStyle: {
      type: String,
      value: ''
    },
    splitStyle: {
      type: [String, Object],
      value: '',
      observer: function observer(val) {
        console.log(123);
        this.setData({
          selfSplitStyle: _StyleHelper2.default.getPlainStyle(val)
        });
      }
    },
    numberStyle: {
      type: [String, Object],
      value: '',
      observer: function observer(val) {
        console.log(_StyleHelper2.default.getPlainStyle(val));
        this.setData({
          selfNumberStyle: _StyleHelper2.default.getPlainStyle(val)
        });
      }
    }
  }, 'doneText', {
    type: String,
    value: '已结束'
  }),
  data: {
    futureTimeStamp: undefined,
    itemArray: [],
    mode: 0,
    day: undefined,
    hour: undefined,
    minute: undefined,
    second: undefined,
    selfSplitStyle: '',
    selfNumberStyle: ''
  },
  attached: function attached() {
    this.setData({
      selfSplitStyle: _StyleHelper2.default.getPlainStyle(this.data.splitStyle),
      selfNumberStyle: _StyleHelper2.default.getPlainStyle(this.data.numberStyle)
    });
    console.log(this.data.selfNumberStyle);

    this.onPageShow();
  },
  ready: function ready() {},
  detached: function detached() {
    this.onPageHide();
  },

  methods: {
    onPageHide: function onPageHide() {
      if (this.data.interval) {
        clearInterval(this.data.interval);
      }
    },
    onPageShow: function onPageShow() {
      var _this = this;

      if (this.data.timetype === 'second') {
        this.data.futureTimeStamp = Math.floor(moment().add(this.data.time, 'seconds').format('x') / 1000);
      } else {
        this.data.futureTimeStamp = Math.floor(moment(this.data.time).format('x') / 1000);
      }
      var tempArray = this.data.format.split(/(\{.*?\})/);
      tempArray.forEach(function (item) {
        var obj = {};
        if (item === '{%d}') {
          obj.type = 'day';
          obj.value = '';
          _this.data.day = obj;
        } else if (item === '{%h}') {
          obj.type = 'hour';
          obj.value = '';
          _this.data.hour = obj;
        } else if (item === '{%m}') {
          obj.type = 'minute';
          obj.value = '';
          _this.data.minute = obj;
        } else if (item === '{%s}') {
          obj.type = 'second';
          obj.value = '';
          _this.data.second = obj;
        } else {
          obj.type = 'split';
          obj.value = item;
        }
        _this.data.itemArray.push(obj);
      });
      this.startCountDown();
    },
    startCountDown: function startCountDown() {
      var _this2 = this;

      this.data.interval = setInterval(function () {
        var diffSecond = Math.floor(moment(_this2.data.futureTimeStamp * 1000).diff(moment()) / 1000);
        _this2.data.timeUp = diffSecond < 0 ? true : false;
        if (_this2.data.timeUp) {
          _this2.setData({
            timeUp: _this2.data.timeUp
          });
          _this2.triggerEvent('timeup');
          clearInterval(_this2.data.interval);
        } else {
          if (_this2.data.day) {
            _this2.data.day.value = Math.floor(diffSecond / (60 * 60 * 24));
            diffSecond = diffSecond % (60 * 60 * 24);
          }
          if (_this2.data.hour) {
            _this2.data.hour.value = Math.floor(diffSecond / (60 * 60));
            diffSecond = diffSecond % (60 * 60);
          }
          if (_this2.data.minute) {
            _this2.data.minute.value = Math.floor(diffSecond / 60);
            diffSecond = diffSecond % 60;
          }
          if (_this2.data.second) {
            _this2.data.second.value = Math.floor(diffSecond);
          }
          _this2.setData({
            itemArray: _this2.data.itemArray
          });
        }
      }, 1000);
    }
  }
});