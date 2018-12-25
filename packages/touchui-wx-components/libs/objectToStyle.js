'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (obj) {
  var rstr = '@_@_@_@_@_@_@_';
  var str = JSON.stringify(obj);
  if (str) {
    var arr = str.match(/\(.*?\)/g);
    var newStr = str.replace(/\(.*?\)/g, '@_@_@_@_@_@_@_').replace(/"|{|}/g, '').replace(/,/g, ';');
    if (arr && arr.length) {
      arr.forEach(function (item, index) {
        newStr = newStr.replace('@_@_@_@_@_@_@_', item);
      });
    }
    return newStr;
  } else {
    return '';
  }
};