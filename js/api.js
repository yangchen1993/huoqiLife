/**
 * Created by YCC on 2016/9/1.
 */
// window.HOST = "http://192.168.1.92:8080/";
window.HOST = "http://m.huoqilife.com/";

window.API = {
    "BUSINESS":{
        "GET_SMS":[window.HOST,"business/sms"].join(""),  //获取验证码

        "RUN_OPENID":[window.HOST,"wx/userDetail"].join(""),    //执行openID的链接

        "JOIN":[window.HOST,"business/code"].join(""),  //商家入驻
        
        "INFO":[window.HOST,"business/merchants/in"].join(""),    //商家信息

        "UPLOAD":[window.HOST,"goods/upload"].join(""),      //商家上传商品详情

        "GET_PROTOCOL":[window.HOST,'business/certificate'].join(""),    //得到协议

        "GET_BUSINESS_SCOPE":[window.HOST,'business/status'].join(""),     //得到经营范围

        "GET_SALE_GOODS":[window.HOST,'goods/isMarketable'].join(""),     //获取上下架商品

        "OFF_SALE_GOODS":[window.HOST,'goods/unIsMarketable'].join(""),     //下架商品

        "UP_SALE_GOODS":[window.HOST,'goods/marketable'].join("")     //上架商品

    },

    "BUYER":{
        "GET_USER_INFO":[window.HOST,'order/memb'].join(""),    //获取用户基本信息

        "NEAR_BY":[window.HOST,"business/nearBy"].join(""),     //买家获取附近店铺

        "GET_SHOP_DETAILS":[window.HOST,"business/detail"].join(""),    //买家获取店铺详情

        "GET_GOODS_DETAILS":[window.HOST,'goods/detail'].join(""),      //买家获取商品详情

        "GET_ADDRESS":[window.HOST,'area/list'].join(""),      //获取省市区

        "NEW_ADDRESS":[window.HOST,'address/add'].join(""),      //新增收货地址

        "UPDATE_ADDRESS":[window.HOST,'address/update'].join(""),      //修改收货地址

        "DELETE_ADDRESS":[window.HOST,'address/delete'].join(""),      //删除收货地址

        "GET_ADDRESS_LIST":[window.HOST,'address/list'].join(""),      //获取收货地址列表

        "ADD_ORDER":[window.HOST,'order/add'].join(""),       //增加订单

        "ORDER_LIST":[window.HOST,'order/list'].join(""),       //订单列表

        "ORDER_CANCEL":[window.HOST,'order/cancel'].join(""),      //取消订单

        "ORDER_UPDATE":[window.HOST,'order/update'].join(""),      //卖家更新订单状态

        "ORDER_GET_CONFIRM":[window.HOST,'order/confirm'].join(""),      //买家确认收货

        "PAY_ORDER":[window.HOST,'order/pay'].join(""),        //订单支付

        "ORDER_DETAILS":[window.HOST,'order/detail'].join(""),     //订单详情

        "ORDERINFO_BY_ID":[window.HOST,'order/with/id'].join(""),      //获取已购买订单详情

        "ORDER_REFUND":[window.HOST,'order/refund'].join(""),            //退款

        "SHARE":[window.HOST,'wx/share'].join(""),     //微信分享

        "GET_SMS":[window.HOST,"memb/code"].join(""),  //获取验证码

        "BANG_PHONE":[window.HOST,'memb/binding'].join(""),    //绑定手机

        "UN_BANG_PHONE":[window.HOST,'memb/unbunding'].join(""),     //解绑手机

        "SUGGESTIONS":[window.HOST,'memb/feedBack'].join(""),    //提交意见

        "GET_IS_BANG":[window.HOST,'memb/isBinding'].join("")    //查询手机是否绑定
    }
};

var my_openId = 'orjMgxOka1VtwtVleqI51lFr9-K0';

var get_param = function (href, paraName) {
    var index = href.indexOf("?");

    var search = href.substring(index + 1);

    var result = "";

    angular.forEach(search.split("&"), function (value) {

        var t = value.split("=");

        if (t.length > 0) {
            if (t[0] == paraName) {
                result = t[1]
            }
        }

    });

    return result;
};

function convertBase64UrlToBlob(urlData) {

    var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], {type: 'image/png'});
}

function plus(n,m){
    n=typeof n =="string"? n: n.toString();
    m=typeof m =="string"? m: m.toString();
    var F= n.indexOf(".")!=-1?this.handleNum(n):[n,0,0],
        S= m.indexOf(".")!=-1?this.handleNum(m):[m,0,0],
        l1=F[2],
        l2=S[2],
        L=l1>l2?l1:l2,
        T=Math.pow(10,L);
    return (F[0]*T+F[1]*T/Math.pow(10,l1)+S[0]*T+S[1]*T/Math.pow(10,l2))/T
}
//减法
function minus(n,m){
    n=typeof n =="string"? n: n.toString();
    m=typeof m =="string"? m: m.toString();
    var F= n.indexOf(".")!=-1?this.handleNum(n):[n,0,0],
        S= m.indexOf(".")!=-1?this.handleNum(m):[m,0,0],
        l1=F[2],
        l2=S[2],
        L=l1>l2?l1:l2,
        T=Math.pow(10,L);
    return (F[0]*T+F[1]*T/Math.pow(10,l1)-S[0]*T-S[1]*T/Math.pow(10,l2))/T
}
function handleNum(n){
    n=typeof n !=="string"?n+"":n;
    var temp= n.split(".");
    temp.push(temp[1].length);
    return temp
}