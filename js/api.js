/**
 * Created by YCC on 2016/9/1.
 */
window.HOST = "http://192.168.1.91:8080/";
// window.HOST = "http://hq.nongjiaotx.cn/";

window.API = {
    "BUSINESS":{
        "GET_SMS":[window.HOST,"business/sms"].join(""),  //获取验证码

        "RUN_OPENID":[window.HOST,"wx/userDetail"].join(""),    //执行openID的链接

        "JOIN":[window.HOST,"business/code"].join(""),  //商家入驻
        
        "INFO":[window.HOST,"business/merchants/in"].join(""),    //商家信息

        "UPLOAD":[window.HOST,"goods/upload"].join("")      //商家上传商品详情
    }
};