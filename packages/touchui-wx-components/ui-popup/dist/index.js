'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _StyleHelper = require('../../libs/StyleHelper.js');

var _StyleHelper2 = _interopRequireDefault(_StyleHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Component({
  behaviors: [],
  properties: {
    show: {
      type: Boolean,
      observer: function observer(val) {
        var _this = this;

        var eventName = val ? 'show' : 'hide';
        this.triggerEvent(eventName);

        if (!this.data.isInit) {
          setTimeout(function () {
            _this.triggerEvent('init');
          }, 300);

          this.setData({
            isInit: true
          });
        }
      }
    },
    width: {
      type: Number | String
    },
    height: {
      type: Number | String
    },
    top: {
      type: Number | String,
      value: 0
    },
    showMask: {
      type: Boolean,
      value: true
    },
    maskStyle: {
      type: Object | String
    },
    hideOnBlur: {
      type: Boolean,
      value: true
    },
    position: {
      type: String,
      value: 'bottom'
    },
    maxHeight: String,
    background: {
      type: String
    },
    cropout: {
      type: Boolean
    }
  },
  data: {
    isInit: false
  },
  ready: function ready() {
    var style = _StyleHelper2.default.getPlainStyle({
      top: this.data.top,
      height: this.data.height,
      width: this.data.width,
      background: this.data.background
    });

    var selfStyle = '';
    var selfContentStyle = '';

    if (this.data.cropout) {
      selfStyle = style;
    } else {
      selfContentStyle = style;
    }

    this.setData({
      selfStyle: selfStyle,
      selfContentStyle: selfContentStyle,
      selfMaskStyle: _StyleHelper2.default.getPlainStyle(this.data.maskStyle)
    });
  },

  methods: {
    handleTouchMove: function handleTouchMove(e) {},
    handleMaskTap: function handleMaskTap(e) {
      if (this.data.hideOnBlur) {
        this.setData({
          show: false
        });
      }
    }
  }
});