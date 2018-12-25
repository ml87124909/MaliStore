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
    top: {
      type: String | Number
    },
    right: {
      type: String | Number
    },
    bottom: {
      type: String | Number
    },
    left: {
      type: String | Number
    }
  },
  data: {},
  ready: function ready() {
    this.setData({
      selfStyle: _StyleHelper2.default.getPlainStyle({
        top: this.data.top,
        right: this.data.right,
        bottom: this.data.bottom,
        left: this.data.left
      })
    });
  },

  methods: {}
});