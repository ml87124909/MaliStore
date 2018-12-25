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
    customStyle: {
      type: Object | String
    },
    title: {
      type: String
    }
  },
  options: {
    multipleSlots: true
  },
  // externalClasses: ['custom-nav-bar'],
  ready: function ready() {
    var height = wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT;
    var style = this.data.customStyle || {};
    style.height = height;
    style.paddingTop = wx.STATUS_BAR_HEIGHT;
    this.setData({
      statusBarHeight: wx.STATUS_BAR_HEIGHT,
      selfCustomStyle: _StyleHelper2.default.getPlainStyle(style)
    });
  }
});