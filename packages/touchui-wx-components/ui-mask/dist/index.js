'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SystemHelper = require('../../libs/SystemHelper.js');

var _SystemHelper2 = _interopRequireDefault(_SystemHelper);

var _StyleHelper = require('../../libs/StyleHelper.js');

var _StyleHelper2 = _interopRequireDefault(_StyleHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Component({
  behaviors: [],
  properties: {
    customStyle: {
      type: String | Object
    },
    show: {
      type: Boolean,
      observer: function observer(val) {
        var _this = this;

        if (val) {
          this.setData({
            selfShow: true
          });
        } else {
          if (this.data.hideDelay) {
            setTimeout(function () {
              _this.setData({
                selfShow: false
              });
            }, this.data.hideDelay);
          } else {
            this.setData({
              selfShow: false
            });
          }
        }
      }
    },
    top: {
      type: Number | String,
      value: 0
    },
    effect: {
      type: String
    },
    hideDelay: {
      type: Number
    },
    hideOnTap: {
      type: Boolean,
      value: true
    },
    blur: {
      type: String
    }
  },
  ready: function ready() {
    var selfCustomStyle = _StyleHelper2.default.getMergedPlainStyles([{ top: this.data.top }, this.data.customStyle]);
    var blurClass = '';
    var platform = _SystemHelper2.default.isIos();
    if (this.data.blur) {
      var _platform = _SystemHelper2.default.isIos() ? 'ios' : 'android';
      blurClass = 'blur-' + this.data.blur + '-' + _platform;
    }
    this.setData({
      selfCustomStyle: selfCustomStyle,
      blurClass: blurClass
    });
  },

  data: {
    selfShow: false,
    isInTimeout: false,
    blurClass: ''
  },
  methods: {
    handleMaskTap: function handleMaskTap() {
      if (this.data.hideOnTap) {
        this.setData({
          show: false
        });
      }
    }
  }
});