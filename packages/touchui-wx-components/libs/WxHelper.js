'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _default = function () {
  function _default() {
    _classCallCheck(this, _default);
  }

  _createClass(_default, null, [{
    key: 'getComponentRect',
    value: function getComponentRect(component, selector) {
      var query = wx.createSelectorQuery().in(component);

      return new Promise(function (resolve, reject) {
        query.select(selector).boundingClientRect(function (res) {
          resolve(res);
        }).exec();
      });
    }
  }, {
    key: 'getScrollViewRect',
    value: function getScrollViewRect(scrollView, selector) {
      var query = wx.createSelectorQuery().in(scrollView);

      return new Promise(function (resolve, reject) {
        query.select(selector).scrollOffset(function (res) {
          resolve(res);
        }).exec();
      });
    }
  }, {
    key: 'getParentRelation',
    value: function getParentRelation(path) {
      var relation = {};
      relation[path] = {
        type: 'parent'
      };
      return relation;
    }
  }, {
    key: 'getChildRelation',
    value: function getChildRelation(path) {
      var relation = {};
      relation[path] = {
        type: 'child'
      };
      return relation;
    }
  }]);

  return _default;
}();

exports.default = _default;