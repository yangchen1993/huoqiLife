/**
 * Created by YCC on 2016/9/1.
 */
// window.HOST = "http://192.168.1.92:8080/";
window.HOST = "http://hq.nongjiaotx.cn/";

window.API = {
    "BUSINESS":{

        "GET_SMS":[window.HOST,"business/sms"].join(""),  //获取验证码

        "RUN_OPENID":[window.HOST,"wx/userDetail"].join(""),    //执行openID的链接

        "JOIN":[window.HOST,"business/code"].join(""),  //商家入驻
        
        "INFO":[window.HOST,"business/merchants/in"].join(""),    //商家信息

        "UPLOAD":[window.HOST,"goods/upload"].join("")      //商家上传商品详情
    },

    "BUYER":{
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

        "PAY_ORDER":[window.HOST,'order/pay'].join("")        //订单支付
    }
};

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