'use strict';

var config = {
  'version': '1.4.8',
  //版本标识，不用管
  'suburl': 'https://api.maliapi.com/api/268?viewid=home',
  //suburl在码力小店后台首页——>基本信息
  'mapkey': 'DNTBZ-JZRC4-AB7US-XWO2R-KUVSZ-HVBQG',
  //mapkey请自己到腾讯地图开放平台申请：https://lbs.qq.com/
  'stypes': 'A',
  //stypes参数为A时：下单返现不会删除推荐人信息（用户二次购买也会返给推荐人）
  //stypes参数为B时：下单返现会删除推荐人信息（用户二次购买不会返给推荐人）
  'mendian_type':0 //1 这个值是控制在提交自提订单的时候是否提交地址 默认是0不提交，如需提交就改为1.

};
module.exports = config;