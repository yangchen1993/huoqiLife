/**
 * Created by YCC on 2016/9/1.
 */
window.HOST = "http://192.168.1.92:8080/";
// window.HOST = "http://hq.nongjiaotx.cn/";

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

        "GET_ADDRESS":[window.HOST,'area/list'].join(""),      //获取用户收货地址

        "NEW_ADDRESS":[window.HOST,'address/add'].join("")      //新增收货地址
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