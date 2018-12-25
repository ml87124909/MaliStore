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
    color: {
      type: String
    },
    padding: {
      type: String | Number
    }
  },
  data: {},
  ready: function ready() {
    this.setData({
      lineStyle: _StyleHelper2.default.getPlainStyle({
        backgroundColor: this.data.color
      }),
      contentStyle: _StyleHelper2.default.getPlainStyle({
        paddingLeft: this.data.padding,
        paddingRight: this.data.padding
      })
    });
  },

  methods: {}
});