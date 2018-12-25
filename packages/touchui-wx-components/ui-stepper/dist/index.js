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
    width: {
      type: [String, Number],
      value: 100
    },
    height: {
      type: [String, Number],
      value: 30
    },
    value: {
      type: [String, Number],
      value: 0,
      observer: function observer(val) {
        console.log(val);
        if (this.data.selfMax !== undefined && val > this.data.selfMax) {
          val = this.data.selfMax;
        }
        if (val < this.data.selfMin) {
          val = this.data.selfMin;
        }
        this.setData({
          selfValue: val,
          value: val
        });
        this.setColor();
      }
    },
    corner: {
      type: String,
      value: 'round'
    },
    min: {
      type: [String, Number],
      value: 0
    },
    max: {
      type: [String, Number]
    },
    step: {
      type: [String, Number],
      value: 1
    },
    color: {
      type: String,
      value: '#666'
    }
  },
  attached: function attached() {
    this.data.selfStep = Number(this.data.step);
    console.log(this.data.selfStep);
    if (this.data.max) {
      this.data.selfMax = Number(this.data.max);
    }
    this.data.selfMin = Number(this.data.min);
    this.data.selfValue = Number(this.data.value);
    if (this.data.selfValue < this.data.selfMin) {
      this.data.selfValue = this.data.selfMin;
    }
    this.setColor();
    this.setData({
      selfValue: this.data.selfValue,
      stepperBtnStyle: (0, _objectToStyle2.default)(this.stepperBtnStyleObj()),
      stepperNumStyle: (0, _objectToStyle2.default)(this.stepperNumStyleObj()),
      stepperStyle: (0, _objectToStyle2.default)(this.stepperStyleObj()),
      minusStyle: (0, _objectToStyle2.default)(this.minusStyleObj()),
      plusStyle: (0, _objectToStyle2.default)(this.plusStyleObj()),
      plusColStyle: (0, _objectToStyle2.default)(this.plusColStyleObj())
    });
  },

  data: {},
  methods: {
    setColor: function setColor() {
      if (this.data.selfValue === this.data.selfMin) {
        this.data.minusColor = '#ccc';
      } else {
        this.data.minusColor = this.data.color;
      }
      if (this.data.selfValue === this.data.selfMax) {
        this.data.plusColor = '#ccc';
      } else {
        this.data.plusColor = this.data.color;
      }
      this.setData({
        minusStyle: (0, _objectToStyle2.default)(this.minusStyleObj()),
        plusStyle: (0, _objectToStyle2.default)(this.plusStyleObj()),
        plusColStyle: (0, _objectToStyle2.default)(this.plusColStyleObj())
      });
    },
    minusStyleObj: function minusStyleObj() {
      var style = {};
      style.width = this.data.height / 3 + 'px';
      style.height = 2 + 'px';
      style['background-color'] = this.data.minusColor;
      style.transform = 'translate(' + (this.data.height / 3 - 3) + 'px, ' + (this.data.height / 2 - 1) + 'px)';
      return style;
    },
    plusStyleObj: function plusStyleObj() {
      var style = {};
      style.width = this.data.height / 3 + 'px';
      style.height = 2 + 'px';
      style['background-color'] = this.data.plusColor;
      style.transform = 'translate(' + (this.data.height / 3 - 3) + 'px, ' + (this.data.height / 2 - 1) + 'px)';
      return style;
    },
    plusColStyleObj: function plusColStyleObj() {
      var style = {};
      style.width = 2 + 'px';
      style.height = this.data.height / 3 + 'px';
      style['background-color'] = this.data.plusColor;
      style.transform = 'translate(' + (this.data.height / 2 - 4) + 'px, ' + (this.data.height / 3 - 2) + 'px)';
      return style;
    },
    plusHandler: function plusHandler() {
      this.data.selfValue += this.data.selfStep;
      if (this.data.selfMax !== undefined && this.data.selfValue > this.data.selfMax) {
        this.data.selfValue = this.data.selfMax;
      }
      this.setData({
        selfValue: this.data.selfValue,
        value: this.data.selfValue

      });
      this.setColor();
      this.triggerEvent('addition', this.data.selfValue);
    },
    minusHandler: function minusHandler() {
      this.data.selfValue -= this.data.selfStep;
      if (this.data.selfValue < this.data.selfMin) {
        this.data.selfValue = this.data.selfMin;
      }
      this.setData({
        selfValue: this.data.selfValue,
        value: this.data.selfValue
      });
      this.setColor();
      this.triggerEvent('subtraction', this.data.selfValue);
    },
    stepperStyleObj: function stepperStyleObj() {
      var style = {};
      style.height = this.data.height + 'px';
      style.width = this.data.width + 'px';
      style['line-height'] = this.data.height + 'px';
      return style;
    },
    stepperBtnStyleObj: function stepperBtnStyleObj() {
      var style = {};
      style.width = this.data.width / 4 + 'px';
      style.height = this.data.height + 'px';
      style['font-size'] = this.data.height / 2 + 'px';
      style['line-height'] = this.data.height + 'px';
      return style;
    },
    stepperNumStyleObj: function stepperNumStyleObj() {
      var style = {};
      style.width = this.data.width / 2 + 'px';
      style.height = this.data.height + 'px';
      style['line-height'] = this.data.height + 'px';
      return style;
    }
  }
});