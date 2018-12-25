'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StringHelper = function () {
  function StringHelper() {
    _classCallCheck(this, StringHelper);
  }

  _createClass(StringHelper, null, [{
    key: 'isNumber',
    value: function isNumber(str) {
      return (/^\d+(\.\d+)?$/.test(str)
      );
    }
  }, {
    key: 'getLength',
    value: function getLength(str) {
      return str.toString().length;
    }
  }, {
    key: 'camelCase2Dash',
    value: function camelCase2Dash(str) {
      return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
    }
  }, {
    key: 'dash2CamelCase',
    value: function dash2CamelCase(str) {
      return str.replace(/\-([a-z])/gi, function (m, w) {
        return w.toUpperCase();
      });
    }
  }]);

  return StringHelper;
}();

exports.default = StringHelper;