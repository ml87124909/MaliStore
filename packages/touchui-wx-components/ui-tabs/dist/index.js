'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _StyleHelper = require('../../libs/StyleHelper.js');

var _StyleHelper2 = _interopRequireDefault(_StyleHelper);

var _WxHelper = require('../../libs/WxHelper.js');

var _WxHelper2 = _interopRequireDefault(_WxHelper);

var _MultiHelper = require('../../libs/MultiHelper.js');

var _MultiHelper2 = _interopRequireDefault(_MultiHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChildPath = '../../ui-tab/dist/index';

exports.default = Component({
  relations: _WxHelper2.default.getChildRelation(ChildPath),
  behaviors: [],
  properties: {
    index: {
      type: Number | String,
      value: 0,
      observer: function observer(index) {
        this.handleIndexChange(index, true);
      }
    },
    probe: {
      type: Number | String,
      value: 0
    },
    width: {
      type: Number | String,
      value: wx.WIN_WIDTH
    },
    autoWidth: {
      type: Boolean,
      value: true
    },
    inkBar: {
      type: Boolean
    },
    inkBarStyle: {
      type: String | Object
    },
    tabStyle: {
      type: Object | String
    },
    activeTabStyle: {
      type: Object | String
    }
  },
  data: {
    isInit: false,
    scrollTop: 0,
    scrollLeft: 0,
    children: [],
    rect: {},
    outerChange: false,
    walkDistance: 0,
    walkCount: 0,
    selfStyle: '',
    selfProbe: 0,
    selfIndex: 0,
    selfInkBarStyle: '',
    inkBarWrapperStyle: ''
  },
  ready: function ready() {
    this.setData({
      selfIndex: Number(this.data.index),
      selfProbe: Number(this.data.probe),
      height: Number(this.data.height)
    });
    this._init();
  },

  methods: {
    _init: function _init() {
      this._initRect();
      this._initChildren();
      this._initChildActive();
      this._initSelfStyle();

      if (this.data.inkBar) {
        this._initSelfInkBarStyle();
      }
    },
    _initChildren: function _initChildren() {
      var children = this.getRelationNodes(ChildPath);
      this.setData({
        children: children
      });
    },
    _initChildActive: function _initChildActive() {
      // 将index项设置为active
      this.data.children[this.data.selfIndex].setData({
        active: true
      });
    },
    _initRect: function _initRect() {
      var _this = this;

      _WxHelper2.default.getComponentRect(this, '.ui-tabs').then(function (rect) {
        _this.setData({
          rect: rect
        });
      });
    },
    _initSelfStyle: function _initSelfStyle() {
      this.setData({
        selfStyle: _StyleHelper2.default.getPlainStyle({
          width: this.data.width
        })
      });
    },
    _initSelfInkBarStyle: function _initSelfInkBarStyle() {
      this.setData({
        selfInkBarStyle: _StyleHelper2.default.getPlainStyle(this.data.inkBarStyle)
      });
    },
    handleIndexChange: function handleIndexChange(index, outerChange) {
      _MultiHelper2.default.updateChildActive(this, index);

      var selfProbe = this.data.selfProbe;

      if (selfProbe === 0 || selfProbe === 1 && !outerChange) {
        this.triggerEvent('change', { index: index });
      }

      this.setData({
        selfIndex: index
      });

      this._setTabStyle();

      // 初始化完成时再执行_autoCenterTab，否则WxHelper.getComponentRect可能会报错
      if (this.data.isInit) {
        this._autoCenterTab();
      }

      if (this.data.inkBar) {
        this._setInkBarWrapperStyle();
      }
    },
    _setTabStyle: function _setTabStyle() {
      var _data = this.data,
          children = _data.children,
          selfIndex = _data.selfIndex,
          tabStyle = _data.tabStyle,
          activeTabStyle = _data.activeTabStyle,
          autoWidth = _data.autoWidth;


      var style = _StyleHelper2.default.getPlainStyle(tabStyle);
      var activeStyle = _StyleHelper2.default.getMergedPlainStyles([tabStyle, activeTabStyle]);

      children.forEach(function (child, index) {
        var renderStyle = index === selfIndex ? activeStyle : style;

        if (autoWidth) {
          renderStyle += ';width: ' + child.data.width + 'px';
        }

        child.setData({
          selfStyle: renderStyle
        });
      });
    },
    _autoCenterTab: function _autoCenterTab() {
      var _this2 = this;

      var child = this.data.children[this.data.selfIndex];
      _WxHelper2.default.getScrollViewRect(this, '.ui-tabs').then(function (scrollRect) {
        _WxHelper2.default.getComponentRect(child, '.ui-tab').then(function (rect) {
          var diff = rect.left - (_this2.data.rect.width - child.data.width) / 2;
          _this2.setData({
            scrollLeft: diff + scrollRect.scrollLeft
          });
        });
      });
    },
    _setInkBarWrapperStyle: function _setInkBarWrapperStyle() {
      var _data2 = this.data,
          children = _data2.children,
          rect = _data2.rect;


      var left = 0;
      var width = 0;

      for (var i = 0; i < children.length; i++) {
        if (children[i].data.active) {
          width = children[i].data.width;
          break;
        } else {
          left += children[i].data.width;
        }
      }

      this.setData({
        inkBarWrapperStyle: _StyleHelper2.default.getPlainStyle({
          top: rect.height - 2,
          left: left,
          width: width
        })
      });
    },
    _increaseWalkDistance: function _increaseWalkDistance(rect) {
      var _this3 = this;

      this.data.walkDistance += rect.width;
      this.data.walkCount++;

      // 最后一个tab初始化完成时
      if (this.data.walkCount === this.data.children.length) {
        var _data3 = this.data,
            walkDistance = _data3.walkDistance,
            walkCount = _data3.walkCount,
            _rect = _data3.rect,
            tabStyle = _data3.tabStyle,
            activeTabStyle = _data3.activeTabStyle,
            children = _data3.children,
            selfIndex = _data3.selfIndex;


        var resetTabHandle = null;

        var fixedStyle = {};

        var width = null;

        // 当walkDistance < 容器宽度时，tab项的样式需要重设
        if (walkDistance < _rect.width && this.data.autoWidth) {
          width = _rect.width / walkCount;
          fixedStyle = { width: width };
        }

        var style = _StyleHelper2.default.getMergedPlainStyles([tabStyle, fixedStyle]);
        var activeStyle = _StyleHelper2.default.getMergedPlainStyles([tabStyle, activeTabStyle, fixedStyle]);

        this.setData({
          isInit: true
        });

        this._autoCenterTab();

        resetTabHandle = function resetTabHandle() {
          children.forEach(function (child, index) {
            child.setData({
              selfStyle: index === selfIndex ? activeStyle : style
            });

            if (width) {
              child.setData({
                width: width
              });
            }
          });
        };

        setTimeout(function () {
          if (resetTabHandle) {
            resetTabHandle();
          }

          if (_this3.data.inkBar) {
            _this3._setInkBarWrapperStyle();
          }
        });
      }
    }
  }
});