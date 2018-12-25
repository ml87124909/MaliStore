"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MultiHelper = function () {
  function MultiHelper() {
    _classCallCheck(this, MultiHelper);
  }

  _createClass(MultiHelper, null, [{
    key: "getChildIndex",
    value: function getChildIndex(parent, child) {
      return parent.data.children.indexOf(child);
    }
  }, {
    key: "callParent",
    value: function callParent(child, method) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      child.data.parent[method].apply(child.data.parent, args);
    }
  }, {
    key: "updateChildActive",
    value: function updateChildActive(parent, activeIndex) {
      parent.data.children.forEach(function (child, index) {
        if (activeIndex === index) {
          child.setData({
            active: true
          });
        } else {
          if (child.data.active) {
            child.setData({
              active: false
            });
          }
        }
      });
    }
  }]);

  return MultiHelper;
}();

exports.default = MultiHelper;