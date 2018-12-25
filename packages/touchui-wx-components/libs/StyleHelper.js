'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _StringHelper = require('./StringHelper.js');

var _StringHelper2 = _interopRequireDefault(_StringHelper);

var _index = require('../../lodash.merge/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../lodash.trim/index.js');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SizeAttrs = ['height', 'width', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'top', 'right', 'bottom', 'left', 'lineHeight', 'fontSize'];
var DashedSizeAttrs = SizeAttrs.map(function (attr) {
  return _StringHelper2.default.camelCase2Dash(attr);
});

function getUnitizedValue(value) {
  if (/^\d+(\.\d+)?$/.test(value)) {
    return value + 'px';
  } else {
    return value;
  }
}

function getObjectStyle(target) {
  if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') {
    return target;
  }
  var attrs = target.split(';');
  var obj = {};

  attrs.forEach(function (attr) {
    var pairs = attr.split(':');
    if (pairs.length === 2) {
      var key = (0, _index4.default)(pairs[0]);
      var value = (0, _index4.default)(pairs[1]);

      if (key && value) {
        obj[key] = value;
      }
    }
  });
  return obj;
}

var StyleHelper = function () {
  function StyleHelper() {
    _classCallCheck(this, StyleHelper);
  }

  _createClass(StyleHelper, null, [{
    key: 'getPlainStyle',
    value: function getPlainStyle(target) {
      if (!target) {
        return '';
      }
      var style = '';
      var type = typeof target === 'undefined' ? 'undefined' : _typeof(target);
      if (type === 'string') {
        style = target;
      } else if (type === 'object') {
        var dashAttr = '';
        Object.keys(target).forEach(function (attr) {
          dashAttr = _StringHelper2.default.camelCase2Dash(attr);

          if (target[attr]) {
            if (DashedSizeAttrs.indexOf(dashAttr) > -1 || SizeAttrs.indexOf(attr) > -1) {
              style += dashAttr + ': ' + getUnitizedValue(target[attr]) + ';';
            } else {
              style += dashAttr + ': ' + target[attr] + ';';
            }
          }
        });
      }
      return style;
    }
  }, {
    key: 'getMergedPlainStyles',
    value: function getMergedPlainStyles(targets) {
      var objectStyles = targets.map(function (target) {
        return getObjectStyle(target);
      });
      var mergedStyles = _index2.default.apply(undefined, [{}].concat(_toConsumableArray(objectStyles)));
      return StyleHelper.getPlainStyle(mergedStyles);
    }
  }]);

  return StyleHelper;
}();

exports.default = StyleHelper;