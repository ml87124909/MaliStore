'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Component({
  behaviors: [],
  properties: {
    width: {
      type: [Number, String],
      value: 73
    },
    height: {
      type: [Number, String],
      value: 13
    },
    value: {
      type: [Number, String],
      value: 0,
      observer: function observer(val) {
        this.reRender();
      }
    },
    data: {
      type: [Object]
    }
  },
  data: {
    imgSrc: './images/sku_star10.png',
    selfImg: false
  },
  methods: {
    reRender: function reRender() {
      if (this.data.data) {
        this.data.selfImg = true;
      }
      var num = Number(this.data.value);
      if (num <= 0.9) {
        this.data.imgSrc = this.data.selfImg ? this.data.data.imgSrc1 : './images/sku_star0.png';
      } else if (num >= 1 && num < 2) {
        this.data.imgSrc = this.data.selfImg ? this.data.data.imgSrc2 : './images/sku_star10.png';
      } else if (num >= 2 && num < 3) {
        this.data.imgSrc = this.data.selfImg ? this.data.data.imgSrc3 : './images/sku_star20.png';
      } else if (num === 3) {
        this.data.imgSrc = this.data.selfImg ? this.data.data.imgSrc4 : './images/sku_star30.png';
      } else if (num > 3 && num < 4) {
        this.data.imgSrc = this.data.selfImg ? this.data.data.imgSrc5 : './images/sku_star35.png';
      } else if (num === 4) {
        this.data.imgSrc = this.data.selfImg ? this.data.data.imgSrc6 : './images/sku_star40.png';
      } else if (num > 4 && num < 5) {
        this.data.imgSrc = this.data.selfImg ? this.data.data.imgSrc7 : './images/sku_star45.png';
      } else if (num === 5) {
        this.data.imgSrc = this.data.selfImg ? this.data.data.imgSrc8 : './images/sku_star50.png';
      }
      this.setData({
        imgSrc: this.data.imgSrc
      });
    }
  },
  ready: function ready() {
    this.reRender();
  }
});