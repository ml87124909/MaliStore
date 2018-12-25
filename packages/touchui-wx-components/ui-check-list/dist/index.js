'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _StyleHelper = require('../../libs/StyleHelper.js');

var _StyleHelper2 = _interopRequireDefault(_StyleHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Component({
  behaviors: [],
  properties: {
    options: {
      type: Array
    },
    value: {
      type: Array,
      value: []
    },
    type: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    color: {
      type: String
    },
    labelPosition: {
      type: String
    },
    max: {
      type: Number | String
    },
    min: {
      type: Number | String
    }
  },
  data: {
    innerCheckStyle: '',
    checkBoxStyle: ''
  },
  ready: function ready() {
    this.init();
  },

  methods: {
    init: function init() {
      var innerCheckStyle = this._getInnerCheckStyle();
      var checkBoxStyle = this._getCheckBoxStyle();

      this.setData({
        innerCheckStyle: innerCheckStyle,
        checkBoxStyle: checkBoxStyle
      });

      var _data = this.data,
          min = _data.min,
          max = _data.max;


      if (min != null) {
        this.setData({
          selfMin: Number(min)
        });
      } else {
        this.setData({
          selfMin: 0
        });
      }
      if (max != null) {
        this.setData({
          selfMax: Number(max)
        });
      } else {
        this.setData({
          selfMax: 999
        });
      }
    },
    _getInnerCheckStyle: function _getInnerCheckStyle() {
      var style = {};
      var _data2 = this.data,
          color = _data2.color,
          type = _data2.type,
          disabled = _data2.disabled;

      if (color) {
        if (!disabled && type !== 'plain') {
          style.backgroundColor = color;
          style.borderColor = color;
        }
      }
      return _StyleHelper2.default.getPlainStyle(style);
    },
    _getCheckBoxStyle: function _getCheckBoxStyle() {
      var style = {};
      var _data3 = this.data,
          color = _data3.color,
          type = _data3.type,
          disabled = _data3.disabled;

      if (color) {
        if (!disabled && type === 'plain') {
          style.borderColor = color;
        }
      }
      return _StyleHelper2.default.getPlainStyle(style);
    },
    handleChange: function handleChange(e) {
      var item = e.currentTarget.dataset.item;
      var itemValue = this.getItemValue(item);

      var _data4 = this.data,
          value = _data4.value,
          disabled = _data4.disabled,
          selfMax = _data4.selfMax,
          selfMin = _data4.selfMin;


      if (!disabled) {
        var index = value.indexOf(itemValue);

        // 单选的场景
        if (selfMax === 1) {
          if (index < 0) {
            value = [itemValue];
            this._changeValue(value);
          }
        } else {
          if (index < 0) {
            if (selfMax > value.length) {
              value.push(itemValue);
              this._changeValue(value);
            }
          } else {
            if (selfMin < value.length) {
              value.splice(index, 1);
              this._changeValue(value);
            }
          }
        }
      }
    },
    _changeValue: function _changeValue(value) {
      this.setData({
        value: value
      });

      this.triggerEvent('change', { value: value });
    },
    getItemValue: function getItemValue(item) {
      return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' ? item.key : item;
    }
  }
});