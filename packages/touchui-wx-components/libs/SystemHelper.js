"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SystemHelper = function () {
  function SystemHelper() {
    _classCallCheck(this, SystemHelper);
  }

  _createClass(SystemHelper, null, [{
    key: "isIos",
    value: function isIos() {
      var systemInfo = wx.getSystemInfoSync();
      return (/ios/i.test(systemInfo.system)
      );
    }
  }, {
    key: "isAndroid",
    value: function isAndroid() {
      var systemInfo = wx.getSystemInfoSync();
      return (/android/i.test(systemInfo.system)
      );
    }
  }]);

  return SystemHelper;
}();

exports.default = SystemHelper;