﻿/**
 * Created by YCC on 2016/8/23.
 */
var myController = angular.module('myController', []);

myController.controller('indexController', ['$scope', '$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    var url = window.location.href;
    var openId = get_param(url, "openId");
    if (openId) {
        $cookieStore.put('openId', openId);
    }
}]);

myController.controller('mainController', ['$scope', '$http', '$cookieStore', function ($scope, $http) {
    $('title').text('火气生活');
    $('#myCarousel').carousel({
        interval: 3000
    });

    $http.get(window.API.BUYER.GET_CAROUSELS).success(function (data) {
        console.log(data);
        $scope.carousels = JSON.parse(data.message);
    });

    $('.circle_logo').click(function () {
        $('#circle_logo1').css('color', '#e3c820');
        $('#circle_logo2').css('color', '#36bcf4');
        $('#circle_logo3').css('color', '#f5672a');
        $('#circle_logo4').css('color', '#a0d021');
        $('.circle_logo').css('border', '0');
        $(this).find('i').css('color', '#e42220');
        $(this).css('border', '1px solid #e22220');
        var type = $(this).siblings('span')[0].innerText;
        get_shopList(type);
    });

    function get_shopList(type) {
        var img_index = 1;
        if (type == 'BS01') {
            img_index = 1;
        }
        else if (type == 'BS02') {
            img_index = 2;
        }
        else if (type == 'BS03') {
            img_index = 3;
        }
        else {
            img_index = 4;
        }

        /*获取当前地理位置*/
        var lat, lng;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        }
        else {
            alert("谷歌地图不支持该浏览器")
        }
        function showPosition(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            var data_ = {
                'lng': lng,
                'lat': lat,
                // 'lng': 104.0635,
                // 'lat': 30.5488,
                'type': type
            };

            /*请求推荐商家*/
            $http.post(window.API.BUYER.NEAR_BY, {
                'lng': lng,
                'lat': lat,
                // 'lng': 104.0635,
                // 'lat': 30.5488,
                'type': 'BS02'
            }).success(function (data) {
                $scope.default_shop = [];
                console.log(data);
                $scope.default_shop.push(_.where(data, {'name': '连沁桶装水经营部'})[0]);
                $scope.default_shop.push(_.where(data, {'name': '高新区桶装水'})[0]);
                console.log($scope.default_shop)
            });

            /*请求附近商家*/
            $http.post(window.API.BUYER.NEAR_BY, data_).success(function (data) {
                console.log(data);
                $scope.results = data;
                for (var i = 0; i < data.length; i++) {
                    var s = Math.floor(Math.random() * 6) + 1;
                    $scope.results[i].shopImg = img_index + '-' + s + '.jpg';
                    $scope.results[i].backImg = 'url("./img/banner' + img_index + '-panel.png") no-repeat';
                }
            });
        }

        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED: {
                    // var data_ = {
                    //     'lng': 104.0635,
                    //     'lat': 30.5488,
                    //     'type': type
                    // };
                    //
                    // /*请求推荐商家*/
                    // $http.post(window.API.BUYER.NEAR_BY, {
                    //     'lng': 104.0635,
                    //     'lat': 30.5488,
                    //     'type': 'BS02'
                    // }).success(function (data) {
                    //     console.log(data);
                    //     $scope.default_shop = _.where(data, {'name': '连沁桶装水经营部'})
                    // });
                    //
                    // /*请求附近商家*/
                    // $http.post(window.API.BUYER.NEAR_BY, data_).success(function (data) {
                    //     console.log(data);
                    //     $scope.results = data;
                    //     for (var i = 0; i < data.length; i++) {
                    //         var s = Math.floor(Math.random() * 6) + 1;
                    //         $scope.results[i].shopImg = img_index + '-' + s + '.jpg';
                    //         $scope.results[i].backImg = 'url("./img/banner' + img_index + '-panel.png") no-repeat';
                    //     }
                    // });
                    alert("用户拒绝对获取地理位置的请求");
                    break;
                }
                case error.POSITION_UNAVAILABLE: {
                    // var data_ = {
                    //     'lng': 104.0635,
                    //     'lat': 30.5488,
                    //     'type': type
                    // };
                    //
                    // /*请求推荐商家*/
                    // $http.post(window.API.BUYER.NEAR_BY, {
                    //     'lng': 104.0635,
                    //     'lat': 30.5488,
                    //     'type': 'BS02'
                    // }).success(function (data) {
                    //     console.log(data);
                    //     $scope.default_shop = _.where(data, {'name': '连沁桶装水经营部'})
                    // });
                    //
                    // /*请求附近商家*/
                    // $http.post(window.API.BUYER.NEAR_BY, data_).success(function (data) {
                    //     console.log(data);
                    //     $scope.results = data;
                    //     for (var i = 0; i < data.length; i++) {
                    //         var s = Math.floor(Math.random() * 6) + 1;
                    //         $scope.results[i].shopImg = img_index + '-' + s + '.jpg';
                    //         $scope.results[i].backImg = 'url("./img/banner' + img_index + '-panel.png") no-repeat';
                    //     }
                    // });
                    alert("位置信息是不可用的");
                    break;
                }
                case error.TIMEOUT: {
                    alert("请求用户地理位置超时");
                    break;
                }
                case error.UNKNOWN_ERROR: {
                    alert("未知错误");
                    break;
                }
            }
        }
    }

    get_shopList("BS01");

    $scope.surf_shop = function (opensId) {
        // window.location.href = "http://web.huoqilife.com/#/shop?opensId=" + openId;
        window.location.href = "#/shop?opensId=" + opensId;
    };

    $http.post(window.API.BUYER.SHARE, {url: window.location.href}).success(function (data) {
        console.log(data);
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.noncestr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: ['onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

            wx.checkJsApi({
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ]
            });

            wx.onMenuShareTimeline({
                title: '火气生活', // 分享标题
                desc: '【火气生活】做您的生活管家！桶装水、液化气等日常用品随叫随到。赶紧来逛逛吧~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: 'http://hqsh.oss-cn-shanghai.aliyuncs.com/goods/0cb041ad-da52-42e8-9118-941036d3cbeb.jpg', // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: '火气生活', // 分享标题
                desc: '【火气生活】做您的生活管家！桶装水、液化气等日常用品随叫随到。赶紧来逛逛吧~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: 'http://hqsh.oss-cn-shanghai.aliyuncs.com/goods/0cb041ad-da52-42e8-9118-941036d3cbeb.jpg', // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: '火气生活', // 分享标题
                desc: '【火气生活】做您的生活管家！桶装水、液化气等日常用品随叫随到。赶紧来逛逛吧~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: 'http://hqsh.oss-cn-shanghai.aliyuncs.com/goods/0cb041ad-da52-42e8-9118-941036d3cbeb.jpg', // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareWeibo({
                title: '火气生活', // 分享标题
                desc: '【火气生活】做您的生活管家！桶装水、液化气等日常用品随叫随到。赶紧来逛逛吧~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: 'http://hqsh.oss-cn-shanghai.aliyuncs.com/goods/0cb041ad-da52-42e8-9118-941036d3cbeb.jpg', // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQZone({
                title: '火气生活', // 分享标题
                desc: '【火气生活】做您的生活管家！桶装水、液化气等日常用品随叫随到。赶紧来逛逛吧~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: 'http://hqsh.oss-cn-shanghai.aliyuncs.com/goods/0cb041ad-da52-42e8-9118-941036d3cbeb.jpg', // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
        });
    });

}]);

myController.controller('shopController', ['$scope', '$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    var url = window.location.href;
    //判断是否从分享链接跳转进来
    if (url.indexOf('?from') != -1) {
        var my_url = url.split('#');
        var my_urls = my_url[1].substring(my_url[1].indexOf('openId=') + 7);
        console.log(my_urls);
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx662afd2f4b80d490&redirect_uri=http%3a%2f%2fm.huoqilife.com%2fwx%2fuser&response_type=code&scope=snsapi_userinfo&state=shop?" + my_urls + "#wechat_redirect"
    }
    //分享链接进来获取地址栏openId
    // if(url.indexOf('openId') != -1){
    //     var openId = get_param(location.href, "openId");
    //     $cookieStore.put('openId',openId);
    //     console.log($cookieStore.get('openId'))
    // }

    $('title').text('店铺详情');
    var opensId = get_param(url, "opensId");
    $http.post(window.API.BUYER.GET_SHOP_DETAILS, {'openId': opensId}).success(function (data) {
        console.log(data);
        var saleGoods = [];
        _.map(data.goods, function (v) {
            if (v.isMarketable) {
                saleGoods.push(v)
            }
        });
        $scope.goods = saleGoods;
        $scope.shop = data;
    });

    $scope.surf_shopDetails = function (id) {
        location.href = '#/shop_details?id=' + id
    };

    $scope.surf_orderConfirm = function (id) {
        location.href = '#/order_confirm?id=' + id
    };

    // var img_width = window.width / 2 - 20;
    // var goodsImg_height = img_width * (2 / 3);
    // $('.goods_panel img').css('height', goodsImg_height);

    $http.post(window.API.BUYER.SHARE, {url: window.location.href}).success(function (data) {
        console.log(data);
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.noncestr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: ['onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

            wx.checkJsApi({
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ]
            });

            wx.onMenuShareTimeline({
                title: $scope.shop.name, // 分享标题
                desc: '【火气生活】这家店铺很赞，价格实惠，快来逛逛吧~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: $scope.shop.member.img, // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: $scope.shop.name, // 分享标题
                desc: '【火气生活】这家店铺很赞，价格实惠，快来逛逛吧~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: $scope.shop.member.img, // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: $scope.shop.name, // 分享标题
                desc: '【火气生活】这家店铺很赞，价格实惠，快来逛逛吧~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: $scope.shop.member.img, // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareWeibo({
                title: $scope.shop.name, // 分享标题
                desc: '【火气生活】这家店铺很赞，价格实惠，快来逛逛吧~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: $scope.shop.member.img, // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQZone({
                title: $scope.shop.name, // 分享标题
                desc: '【火气生活】这家店铺很赞，价格实惠，快来逛逛吧~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: $scope.shop.member.img, // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
        });
    });

}]);
myController.controller('shop_detailsController', ['$scope', '$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    var url = window.location.href;
    //判断是否从分享链接跳转进来
    if (url.indexOf('?from') != -1) {
        var my_url = url.split('#');
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx662afd2f4b80d490&redirect_uri=http%3a%2f%2fm.huoqilife.com%2fwx%2fuser&response_type=code&scope=snsapi_userinfo&state=" + my_url[1].replace("/", "") + "#wechat_redirect"
    }
    //分享链接进来获取地址栏openId
    // if(url.indexOf('openId') != -1){
    //     var openId = get_param(location.href, "openId");
    //     $cookieStore.put('openId',openId);
    //     console.log($cookieStore.get('openId'))
    // }

    $('title').text('商品详情');
    var id = get_param(location.href, "id");

    $http.post(window.API.BUYER.GET_GOODS_DETAILS, {id: id}).success(function (data) {
        console.log(data);
        $scope.results = data;
    });

    $scope.run_shop = function (openId) {
        location.href = '#/shop?opensId=' + openId
    };

    $scope.surf_orderConfirm = function () {
        location.href = '#/order_confirm?id=' + id
    };

    var goodsImg_height = $('.img_panel>img').width() * (2 / 3);
    $('.img_panel>img').css('height', goodsImg_height);

    $http.post(window.API.BUYER.SHARE, {url: window.location.href}).success(function (data) {
        console.log(data);
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.noncestr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: ['onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

            wx.checkJsApi({
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ]
            });

            wx.onMenuShareTimeline({
                title: $scope.results.name + '、' + $scope.results.price, // 分享标题
                desc: '【火气生活】' + $scope.results.describe, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: $scope.results.img, // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: $scope.results.name + '、' + $scope.results.price, // 分享标题
                desc: '【火气生活】' + $scope.results.describe, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: $scope.results.img, // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: $scope.results.name + '、' + $scope.results.price, // 分享标题
                desc: '【火气生活】' + $scope.results.describe, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: $scope.results.img, // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareWeibo({
                title: $scope.results.name + '、' + $scope.results.price, // 分享标题
                desc: '【火气生活】' + $scope.results.describe, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: $scope.results.img, // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQZone({
                title: $scope.results.name + '、' + $scope.results.price, // 分享标题
                desc: '【火气生活】' + $scope.results.describe, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: $scope.results.img, // 分享图标
                success: function () {
                    alert('分享成功');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    alert('分享失败');
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.error(function (res) {

                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

            });
        });
    });
}]);

myController.controller('orderController', ['$scope', '$http', '$cookieStore','$rootScope', function ($scope, $http, $cookieStore,$rootScope) {
    $('title').text('订单状态');
    var openId = $cookieStore.get('openId');
    var tag = location.href.indexOf('formOrder_confirm');
    if (tag != -1) {
        get_orderInfo_by_state('OT02');
        $('.nav_self div:nth-child(2)').css('color', '#e42121');
        $('.div_hk').animate({'margin-left': '28%'});
    }
    else {
        get_orderInfo_by_state('OT01');
    }

    $('.nav_self div').click(function () {
        $(this).css({'color': '#e42121'}).siblings().css({'color': '#222'})
    });
    $scope.move_hk = function (i, status) {
        $('.div_hk').animate({'margin-left': ((i - 1) * 25 + 3) + '%'});
        get_orderInfo_by_state(status);
    };

    function get_orderInfo_by_state(state) {
        var data_ = {
            opt: state,
            openId: openId,
            role: 'ORDERS_INITIATOR_ID'
        };

        $http.post(window.API.BUYER.ORDER_LIST, data_).success(function (data) {
            _.map(data, function (v) {
                var time = new Date(v.createTime);
                return v.createTime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
            });
            $scope.results = data;
            console.log(data);
        })
    }

    $scope.order_update = function (id, status) {
        $http.post(window.API.BUYER.ORDER_GET_CONFIRM, {id: id}).success(function (data) {
            console.log(data);
            alert(data.message);
            get_orderInfo_by_state(status);
        })
    };

    $scope.order_cancel = function (id, status) {
        if (confirm('是否取消订单')) {
            $http.post(window.API.BUYER.ORDER_CANCEL, {id: id}).success(function (data) {
                console.log(data);
                alert(data.message);
                get_orderInfo_by_state(status);
            })
        }
    };

    $scope.order_refund = function (orderId, id, id1, money, status) {
        var data_ = {
            id: orderId,
            wxOrderId: id,
            wxRefuseId: id1,
            totalAmount: money
        };
        $http.post(window.API.BUYER.ORDER_REFUND, data_).success(function (data) {
            console.log(data);
            alert(data.message);
            get_orderInfo_by_state(status);
        })
    };

    $scope.surf_orderConfirm = function (id) {
        location.href = '#/order_confirm?id=' + id
    };

    $scope.surf_orderDetails = function (id,status,data) {
        $rootScope.orderInfo = data;
        location.href = "#/order_details?id=" + id + "&status=" + status;
    };

    var wx_pay;
    $scope.pay = function (id, status) {
        $http.post(window.API.BUYER.PAY_ORDER, {id: id}).success(function (data) {
            console.log(data);
            wx_pay = JSON.parse(data.result);
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                onBridgeReady(status);
            }
        });
    };
    function onBridgeReady(status) {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": wx_pay.appId,     //公众号名称，由商户传入
                "timeStamp": wx_pay.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": wx_pay.nonceStr, //随机串
                "package": wx_pay.package,
                "signType": wx_pay.signType,         //微信签名方式：
                "paySign": wx_pay.paySign //微信签名
            },
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    get_orderInfo_by_state(status);
                }
            }
        );
    }

    $('html').css('background-color', '#e4e1e1');
    $scope.$on('$destroy', function () {
        $('html').css('background-color', '#fff')
    })
}]);

myController.controller('order_confirmController', ['$scope', '$http', '$cookieStore', '$rootScope', function ($scope, $http, $cookieStore, $rootScope) {
    $('title').text('订单确认');
    var id = get_param(location.href, "id");
    var openId = $cookieStore.get('openId');
    var tag = location.href.indexOf('form_addressManage');

    var surfUrl = "";

    if (tag == -1) {
        $http.post(window.API.BUYER.GET_ADDRESS_LIST, {openId: openId}).success(function (data) {
            if (data.length == 0) {
                $('.show1').css('display', 'block');
                surfUrl = "#/new_address?formOrder_confirm&id=";
            }
            else {
                $('.show2').css('display', 'block');
                var k = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].isDef) {
                        $scope.default_address = data[i];
                        k++;
                    }
                }
                if (k == 0) {
                    $scope.default_address = data[0];
                }
                surfUrl = "#/address_manage?id=";
            }
        });
    }
    else {
        console.log($rootScope.select_address);
        if ($rootScope.select_address) {
            $('.show2').css('display', 'block');
            $scope.default_address = $rootScope.select_address;
            surfUrl = "#/address_manage?id=";
        }
        else {
            $('.show1').css('display', 'block');
            surfUrl = "#/new_address?formOrder_confirm&id=";
        }
    }

    var onePrice = 0;
    $http.post(window.API.BUYER.GET_GOODS_DETAILS, {id: id}).success(function (data) {
        console.log(data);
        $scope.goods = data;
        onePrice = $scope.goods.price;
    });
    $scope.num = 1;
    $scope.goods_num = function (tag) {
        if (tag == 1) {
            $scope.num++;
            $scope.goods.price = plus($scope.goods.price, onePrice);
        }
        if ($scope.num > 1) {
            if (tag == 0) {
                $scope.num--;
                $scope.goods.price = minus($scope.goods.price, onePrice);
            }
        }
    };

    $scope.confirm_order = function () {
        var pay_way = $('input[name="pay_way"]:checked').val();
        var data_ = {
            totalAmount: $scope.goods.price,
            initiator: openId,   // 用户openId
            accepter: $scope.goods.business.openId,   //商家openId
            addressId: $scope.default_address.id,
            remark: $scope.remark,
            shipmentsDate: '立即送达',
            orderList: {
                name: $scope.goods.name,
                price: onePrice,
                quantity: $scope.num,
                orderImg: $scope.goods.img
            },
            goodId: $scope.goods.id,
            payment: pay_way
        };
        $http.post(window.API.BUYER.ADD_ORDER, data_).success(function (data) {
            if(data.status == 200){
                if(pay_way == 'PT02'){
                    wx_pay = JSON.parse(data.result);
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady();
                    }
                }
                if(pay_way == 'PT03'){
                    location.href = '#/order?formOrder_confirm';
                }
            }
            if (data.status == 500) {
                alert(data.message)
            }
        });
    };

    var wx_pay;
    function onBridgeReady() {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": wx_pay.appId,     //公众号名称，由商户传入
                "timeStamp": wx_pay.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": wx_pay.nonceStr, //随机串
                "package": wx_pay.package,
                "signType": wx_pay.signType,         //微信签名方式：
                "paySign": wx_pay.paySign //微信签名
            },

            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    location.href = '#/order?formOrder_confirm';
                }
            }
        );
    }

    $scope.surf_addressManage = function () {
        location.href = surfUrl + id;
    };

    $scope.run_shop = function (openId) {
        location.href = '#/shop?opensId=' + openId
    };
}]);

myController.controller('order_detailsController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $('title').text('订单详情');
    var url = window.location.href;
    var id = get_param(url, 'id');
    $scope.status = get_param(url,'status');
    console.log($scope.status);

    $http.post(window.API.BUYER.ORDER_DETAILS, {id: id}).success(function (data) {
        console.log(data);
        $scope.results = data;
    });

    var wx_pay;
    $scope.pay = function () {
        $http.post(window.API.BUYER.PAY_ORDER, {id: id}).success(function (data) {
            console.log(data);
            if(data.status == 500){
                alert(data.message)
            }
            wx_pay = JSON.parse(data.result);
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                onBridgeReady();
            }
        });
    };
    function onBridgeReady() {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": wx_pay.appId,     //公众号名称，由商户传入
                "timeStamp": wx_pay.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": wx_pay.nonceStr, //随机串
                "package": wx_pay.package,
                "signType": wx_pay.signType,         //微信签名方式：
                "paySign": wx_pay.paySign //微信签名
            },
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    $('.submit_btn button').attr('disabled','disabled')
                }
            }
        );
    }

    $scope.order_refund = function () {
        var data_ = {
            id: id,
            wxOrderId: $rootScope.orderInfo.wxOrderId,
            wxRefuseId: $rootScope.orderInfo.wxRefuseId,
            totalAmount: $rootScope.orderInfo.totalAmount
        };
        console.log(data_);
        $http.post(window.API.BUYER.ORDER_REFUND, data_).success(function (data) {
            console.log(data);
            alert(data.message);
            $('.submit_btn button').attr('disabled','disabled')
        })
    };

    $scope.surf_orderConfirm = function () {
        location.href = '#/order_confirm?id=' + $rootScope.orderInfo.productId;
    };

    $scope.order_update = function () {
        $http.post(window.API.BUYER.ORDER_GET_CONFIRM, {id: id}).success(function (data) {
            console.log(data);
            alert(data.message);
            $('.submit_btn button').attr('disabled','disabled')
        })
    };
}]);

myController.controller('personalController', ['$scope', '$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    $('title').text('我的');
    var openId = $cookieStore.get('openId');
    $http.post(window.API.BUYER.GET_USER_INFO, {openId: openId}).success(function (data) {
        console.log(data);
        $scope.user = data;
    });
}]);

myController.controller('bang_phoneController', ['$scope', '$http', '$cookieStore', '$interval', function ($scope, $http, $cookieStore, $interval) {
    $http.post(window.API.BUYER.GET_IS_BANG, {openId: $cookieStore.get('openId')}).success(function (data) {
        console.log(data);
        $scope.phone = data.result;
        if (data.message == "yes") {
            $scope.isBing = 1;
            $('title').text('手机解绑');
        }
        else {
            $scope.isBing = 0;
            $('title').text('绑定手机');
        }
    });
    //绑定
    $scope.Vcode = "获取验证码";
    $scope.sms_disabled = true;
    $scope.get_sms = function () {
        if (!$scope.tel) {
            alert("请输入手机号")
        }
        else if ($scope.tel.length != 11) {
            alert('手机号不正确，请重新输入');
        }
        else {
            $http.post(window.API.BUYER.GET_SMS, {'cellPhone': $scope.tel}).success(function (data) {
                console.log(data);
                if (data.status == 200) {
                    var s = 90;
                    var timer = $interval(function () {
                        $scope.Vcode_disabled = true;
                        $scope.sms_disabled = false;
                        $scope.Vcode = s + "s";
                        console.log(s);
                        if (s == 0) {
                            $interval.cancel(timer);
                            $scope.Vcode_disabled = false;
                            $scope.sms_disabled = true;
                            $scope.Vcode = "再次获取验证码";
                        }
                        s--;
                    }, 1000);
                }
                if (data.status == 500) {
                    alert(data.message)
                }
            })
                .error(function (data) {
                    alert(data.message)
                })
        }
    };

    $scope.bang_submit = function () {
        if ($scope.tel && $scope.sms) {
            var data_ = {
                'cellPhone': $scope.tel,
                'code': $scope.sms,
                'openId': $cookieStore.get('openId')
            };
            $http.post(window.API.BUYER.BANG_PHONE, data_).success(function (data) {
                console.log(data);
                if (data.status == 200) {
                    alert(data.message);
                    window.location.href = '#/personal';
                }
                if (data.status == 500) {
                    alert(data.message);
                }
            })
                .error(function (data) {
                    console.log(data);
                })
        }
        else {
            alert('请完善填写信息')
        }
    };

    //解绑
    $scope.btn_unBing = function () {
        if(confirm("是否解绑已有手机号码？")){
            $http.post(window.API.BUYER.UN_BANG_PHONE, {openId: $cookieStore.get('openId')}).success(function (data) {
                window.location.href = '#/personal';
            })
        }
    }
}]);

myController.controller('suggestionsController', ['$scope', '$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    $('title').text('意见反馈');
    $scope.btn_suggestions = function (suggestion) {
        if (suggestion.text && suggestion.tel) {
            var data_ = {
                content: suggestion.text,
                phone: suggestion.tel
            };
            $http.post(window.API.BUYER.SUGGESTIONS, data_).success(function (data) {
                console.log(data);
                alert(data.message);
                window.location.href = '#/personal'
            })
        }
        else {
            alert('请完善必填信息！')
        }
    };

    $('html').css('background-color', '#e4e1e1');
    $scope.$on('$destroy', function () {
        $('html').css('background-color', '#fff')
    })

}]);

myController.controller('aboutUsController', ['$scope', '$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    $('title').text('关于我们');
    $http.get(window.API.BUYER.ABOUT_US).success(function (data) {
        console.log(JSON.parse(data.message));
        var content = JSON.parse(data.message).content;
        $('.content').append(content)
    })
}]);

myController.controller('new_addressController', ['$scope', '$http', '$rootScope', '$cookieStore', function ($scope, $http, $rootScope, $cookieStore) {
    // 兼容苹果下拉
    var url = window.location.href;
    $('.arrow_down').click(function () {
        if ($(this).parent('div').hasClass('open')) {
            $(this).parent('div').addClass('open')
        }
        else {
            $(this).parent('div').removeClass('open')
        }
    });
    var id = get_param(url, 'id');
    var openId = $cookieStore.get('openId');
    $scope.$on('$destroy', function () {
        $rootScope.myAddress = "";
    });

    var tag = url.indexOf('formOrder_confirm');

    //修改地址
    if ($rootScope.myAddress) {
        $('title').text('修改地址');
        var address_id = $rootScope.myAddress.id;
        $scope.address = $rootScope.myAddress;
        $scope.myProvince = $rootScope.myAddress.proName;
        $scope.myCity = $rootScope.myAddress.cityName;
        $scope.myArea = $rootScope.myAddress.countyName;
        if ($rootScope.myAddress.isDef) {
            $('.default').css('color', '#e42121');
        }

        $scope.submit = function (data) {
            var data_ = angular.copy(data);
            data_.id = address_id;
            if ($('.default').css('color') == "rgb(204, 203, 203)") {
                data_.isDef = false
            }
            else {
                data_.isDef = true
            }
            data_.proName = $scope.myProvince;
            data_.cityName = $scope.myCity;
            data_.countyName = $scope.myArea;
            console.log(data_);
            if (data_.contactName != "" && data_.contactName && data_.mobile != "" && data_.mobile && data_.proName != "" && data_.proName && data_.cityName != "" && data_.cityName && data_.countyName != "" && data_.countyName && data_.address != "" && data_.address) {
                $http.post(window.API.BUYER.UPDATE_ADDRESS, data_).success(function (data) {
                    console.log(data);
                    alert(data.message);
                    if(id){
                        location.href = '#/address_manage?id=' + id;
                    }
                    else{
                        location.href = '#/address_manage';
                    }
                })
            }
            else {
                alert("请完善地址信息")
            }
        }
    }

    //新建地址
    else {
        $('title').text('新增地址');
        $scope.submit = function (data) {
            console.log(openId);
            var data_ = angular.copy(data);
            data_.openId = openId;
            data_.isDef = isDef;
            data_.proName = $scope.myProvince;
            data_.cityName = $scope.myCity;
            data_.countyName = $scope.myArea;
            console.log(data_);
            if (data_.contactName != "" && data_.contactName && data_.mobile != "" && data_.mobile && data_.proName != "" && data_.proName && data_.cityName != "" && data_.cityName && data_.countyName != "" && data_.countyName && data_.address != "" && data_.address) {
                $http.post(window.API.BUYER.NEW_ADDRESS, data_).success(function (data) {
                    console.log(data);
                    alert(data.message);
                    if (tag != -1) {
                        $rootScope.select_address = data_;
                        $rootScope.select_address.id = data.result;
                        location.href = '#/order_confirm?form_addressManage&id=' + id;
                    }
                    else {
                        location.href = '#/address_manage?id=' + id;
                    }
                })
            }
            else {
                alert("请完善地址信息")
            }
        }
    }

    $http.get(window.API.BUYER.GET_ADDRESS).success(function (data) {
        $scope.province = data
    });

    $scope.select_province = function (name, code) {
        $scope.myProvince = name;
        $http.post(window.API.BUYER.GET_ADDRESS, {'code': code}).success(function (data) {
            console.log(data);
            $scope.city = data
        })
    };

    $scope.select_city = function (name, code) {
        $scope.myCity = name;
        $http.post(window.API.BUYER.GET_ADDRESS, {'code': code}).success(function (data) {
            console.log(data);
            $scope.area = data
        })
    };

    $scope.select_area = function (name) {
        $scope.myArea = name;
    };

    var isDef;
    $('.default').click(function () {
        if ($(this).css('color') == "rgb(204, 203, 203)") {
            $(this).css('color', '#e42121');
            isDef = true
        }
        else {
            $(this).css('color', '#cccbcb');
            isDef = false
        }
    });

    $('html').css('background-color', '#e4e1e1');
    $scope.$on('$destroy', function () {
        $('html').css('background-color', '#fff')
    })

}]);

myController.controller('address_manageController', ['$scope', '$http', '$rootScope', '$cookieStore', function ($scope, $http, $rootScope, $cookieStore) {
    $('title').text('地址管理');
    var openId = $cookieStore.get('openId');
    var index = location.href.indexOf('id');
    var id = location.href.substring(index + 3);
    $http.post(window.API.BUYER.GET_ADDRESS_LIST, {openId: openId}).success(function (data) {
        console.log(data);
        $scope.results = data;
        if (data.length == 0) {
            $('#no_addr').css('display', 'block')
        }
    });

    $scope.surf_orderConfirm = function (data) {
        if (index != -1) {
            $rootScope.select_address = data;
            location.href = '#/order_confirm?form_addressManage&id=' + id;
        }
    };

    $scope.serf_newAddress = function () {
        if (index == -1) {
            location.href = '#/new_address';
        }
        else {
            location.href = '#/new_address?id=' + id;
        }
    };

    $scope.serf_updateAddress = function (data) {
        if(index == -1){
            location.href = '#/new_address';
            $rootScope.myAddress = data;
        }
        else{
            location.href = '#/new_address?id=' + id;
            $rootScope.myAddress = data;
        }

    };

    $scope.delete_address = function (id) {
        $http.post(window.API.BUYER.DELETE_ADDRESS, {id: id}).success(function (data) {
            console.log(data);
            alert(data.message);
            location.reload();
        })
    };
}]);


