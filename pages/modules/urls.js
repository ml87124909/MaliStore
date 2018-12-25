'use strict';

var _config = require('../../config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subDomain = _config2.default.suburl;
var mlwxappId = wx.getAccountInfoSync();
var urlDomain = subDomain + '&appid=' + mlwxappId.miniProgram.appId;
var links = [{
	/* 第三方接口 */
	'tencentmap': 'https://apis.map.qq.com/ws/location/v1/ip', //腾讯地图
	/* 系统接口 */
	'wxapplogin': urlDomain + '&part=login', //登录
	'wxregister': urlDomain + '&part=register', //注册
	'checktoken': urlDomain + '&part=checktoken', //token效验
	'mlshopinfo': urlDomain + '&part=shopinfo', //店铺信息
	'mlshopslis': urlDomain + '&part=shopinfo_shops', //商铺列表
	'porderlist': urlDomain + '&part=order_delivery', //订单配送列表
	'mluserinfo': urlDomain + '&part=user_info', //用户信息详情
	'userprofit': urlDomain + '&part=user_profit_record', //用户收益记录
	'imgsbanner': urlDomain + '&part=banner_list', //图片广告
	'mltextarea': urlDomain + '&part=textarea_list', //文字广告
	'mlcategory': urlDomain + '&part=shop_category', //商品分类
	'categorydf': urlDomain + '&part=category_detail', //商品分类详情
	'mlgoodlist': urlDomain + '&part=goods_list', //商品列表
	'newdagoods': urlDomain + '&part=goods_newday', //上新商品列表
	'mlgoodsdet': urlDomain + '&part=goods_detail', //商品详情
	'mlghistory': urlDomain + '&part=user_history_add', //新增商品浏览记录
	'historylis': urlDomain + '&part=user_history_list', //商品浏览记录列表
	'historydel': urlDomain + '&part=user_history_del', //删除商品浏览记录
	'reputation': urlDomain + '&part=goods_reputation', //商品评论
	'goodsprice': urlDomain + '&part=goods_price', //查询商品价格
	'couponlist': urlDomain + '&part=coupons_list', //优惠券列表
	'getcoupons': urlDomain + '&part=coupons_fetch', //领取优惠券
	'mincoupons': urlDomain + '&part=my_coupons', //用户领取的优惠券
	'ordercoups': urlDomain + '&part=order_coupons', //检索订单可用优惠券
	'getqrcodes': urlDomain + '&part=goods_qrcode', //生成小程序码
	'addreslist': urlDomain + '&part=user_address_list', //用户地址列表
	'addresdefa': urlDomain + '&part=user_address', //用户地址详情信息
	'addresedit': urlDomain + '&part=user_address_edit', //编辑、新增用户地址信息
	'addressdel': urlDomain + '&part=user_address_del', //删除用户地址信息
	'favorilist': urlDomain + '&part=user_favorite_list', //收藏商品列表
	'favoriadds': urlDomain + '&part=user_favorite_add', //添加收藏商品
	'favoredels': urlDomain + '&part=user_favorite_del', //删除收藏商品
	'ordecreate': urlDomain + '&part=order_create', //创建订单
	'orderslist': urlDomain + '&part=order_list', //订单列表
	'ordepaypal': urlDomain + '&part=order_paypal', //订单支付
	'orderdetas': urlDomain + '&part=order_details', //订单详情
	'ordercance': urlDomain + '&part=order_cancel', //订单取消
	'orderdelet': urlDomain + '&part=order_delete', //订单删除
	'ordereceiv': urlDomain + '&part=order_receiving', //订单确认收货
	'orderefund': urlDomain + '&part=order_service_refund', //申请退款
	'canceltuik': urlDomain + '&part=order_service_refund_cancel', //撤销退款申请
	'recoverytk': urlDomain + '&part=order_service_refund_recovery', //恢复退款订单状态
	'deletetuik': urlDomain + '&part=order_service_refund_delete', //删除退款订单
	'tuikuanlis': urlDomain + '&part=order_service_refund_list', //退款订单列表
	'exchanglis': urlDomain + '&part=order_service_exchange_list', //售后商品列表
	'exchangesh': urlDomain + '&part=order_service_exchange', //申请售后
	'cancelshou': urlDomain + '&part=order_service_exchange_cancel', //撤销售后申请
	'exorderlis': urlDomain + '&part=order_service_exchange_order_list', //售后订单列表
	'delexchang': urlDomain + '&part=order_service_exchange_delete', //删除售后申请
	'addchanges': urlDomain + '&part=order_service_exchange_addinfo', //补充售后申请信息
	'pingjalist': urlDomain + '&part=order_evaluate_list', //订单评价商品列表
	'pingjasend': urlDomain + '&part=order_evaluate', //发表商品评价
	'wechatpays': urlDomain + '&part=get_wechat_paypal', //微信支付
	'userpaypal': urlDomain + '&part=user_money_paypal', //用户提现
	'usrecharge': urlDomain + '&part=user_money_recharge', //用户充值
	'usepaylist': urlDomain + '&part=get_paypal_list', //充值赠送列表
	'paypalinfo': urlDomain + '&part=user_money_paypalinfo', //用户余额记录
	'usfeedback': urlDomain + '&part=user_feedback', //用户反馈
	'scorerules': urlDomain + '&part=score_rules', //积分签到规则
	'scoresigin': urlDomain + '&part=score_sign', //每日签到
	'vipopaypal': urlDomain + '&part=user_vip_paypal', //开通、续费会员
	'wuliuinfos': urlDomain + '&part=order_wuliuinfo', //查询物流信息
	'uploadfile': urlDomain + '&part=get_upload', //文件上传
	'sharegoods': urlDomain + '&part=goods_share' //商品分享返现
}];

module.exports = {
	links: links,
	mapkey: _config2.default.mapkey
};