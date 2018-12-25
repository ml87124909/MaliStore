'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _WxHelper = require('../../libs/WxHelper.js');

var _WxHelper2 = _interopRequireDefault(_WxHelper);

var _MultiHelper = require('../../libs/MultiHelper.js');

var _MultiHelper2 = _interopRequireDefault(_MultiHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ParentPath = '../../ui-tabs/dist/index';

exports.default = Component({
  relations: _WxHelper2.default.getParentRelation(ParentPath),
  data: {
    selfStyle: '',
    index: -1,
    active: false,
    width: 0,
    height: 0,
    isParentInkBar: false
  },
  ready: function ready() {
    this._init();
  },

  methods: {
    _init: function _init() {
      var _this = this;

      var parent = this.getRelationNodes(ParentPath)[0];

      _WxHelper2.default.getComponentRect(this, '.ui-tab').then(function (rect) {
        parent._increaseWalkDistance(rect);

        _this.setData({
          isParentInkBar: parent.data.inkBar,
          width: rect.width,
          height: rect.height,
          index: _MultiHelper2.default.getChildIndex(parent, _this)
        });
      });
    },
    handleTap: function handleTap() {
      var parent = this.getRelationNodes(ParentPath)[0];
      parent.handleIndexChange(this.data.index, false);
    }
  }
});