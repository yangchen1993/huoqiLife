/**
 * Created by YCC on 2016/8/23.
 */
var myController = angular.module('myController', []);

myController.controller('mainController', ['$scope', '$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    $('title').text('火气生活');
    var url = location.href;
    var openId = get_param(url, "openId");
    if (openId != "") {
        $cookieStore.put('openId', openId);
    }

    $('#myCarousel').carousel({
        interval: 3000
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
        console.log(type);
        get_shopList(type);
    });

    function get_shopList(type) {
        var img_index = 1;
        if (type == 'BS01') {
            img_index = 1
        }
        else if (type == 'BS02') {
            img_index = 2
        }
        else if (type == 'BS03') {
            img_index = 3
        }
        else {
            img_index = 4
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
            console.log(lat + '-' + lng);
            var data_ = {
                'lng': lng,
                'lat': lat,
                // 'lng': 104.0635,
                // 'lat': 30.5488,
                'type': type
            };

            /*请求附近商家*/
            $http.post(window.API.BUYER.NEAR_BY, data_).success(function (data) {
                console.log(data);
                $scope.results = data;
                for (var i = 0; i < data.length; i++) {
                    var s = Math.floor(Math.random() * 3) + 1;
                    $scope.results[i].shopImg = img_index + '-' + s + '.jpg';
                }
            });
        }

        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED: {
                    alert("用户拒绝对获取地理位置的请求");
                    break;
                }
                case error.POSITION_UNAVAILABLE: {
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

    $scope.surf_shop = function (openId) {
        location.href = "#/shop?openId=" + openId;
    }
}]);

myController.controller('shopController', ['$scope', '$http', function ($scope, $http) {
    $('title').text('店铺详情');
    var openId = get_param(location.href, "openId");
    $http.post(window.API.BUYER.GET_SHOP_DETAILS, {'openId': openId}).success(function (data) {
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

    var img_width = window.width / 2 - 20;
    var goodsImg_height = img_width * (2 / 3);
    $('.goods_panel img').css('height', goodsImg_height);

}]);
myController.controller('shop_detailsController', ['$scope', '$http', function ($scope, $http) {
    $('title').text('商品详情');
    var id = get_param(location.href, "id");

    $http.post(window.API.BUYER.GET_GOODS_DETAILS, {id: id}).success(function (data) {
        console.log(data);
        $scope.results = data;
    });
    console.log($scope.results);

    $scope.run_shop = function (openId) {
        location.href = '#/shop?openId=' + openId
    };

    $scope.surf_orderConfirm = function () {
        location.href = '#/order_confirm?id=' + id
    };

    var goodsImg_height = $('.img_panel>img').width() * (2 / 3);
    $('.img_panel>img').css('height', goodsImg_height);
}]);

myController.controller('orderController', ['$scope', '$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    $('title').text('订单状态');
    var openId = $cookieStore.get('openId');
    var tag = location.href.indexOf('formOrder_confirm');
    if (tag != -1) {
        get_orderInfo_by_state('OT02');
        $('.nav_self div:nth-child(2)').css('color', '#e42121');
        $('.div_hk').animate({'margin-left': '22%'});
    }
    else {
        get_orderInfo_by_state('OT01');
    }


    console.log(openId);
    $('.nav_self div').click(function () {
        $(this).css({'color': '#e42121'}).siblings().css({'color': '#222'})
    });
    $scope.move_hk = function (i, status) {
        $('.div_hk').animate({'margin-left': ((i - 1) * 20 + 2) + '%'});
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

    $scope.surf_orderDetails = function (id) {
        location.href = "#/order_details?id=" + id;
    };

    var wx_pay;
    $scope.pay = function (id, status) {
        console.log(id);
        $http.post(window.API.BUYER.PAY_ORDER, {id: id}).success(function (data) {
            console.log(data);
            wx_pay = JSON.parse(data.result);
            console.log(wx_pay);
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
        $('.show2').css('display', 'block');
        $scope.default_address = $rootScope.select_address;
        surfUrl = "#/address_manage?id=";
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
            goodId: $scope.goods.id
        };
        $http.post(window.API.BUYER.ADD_ORDER, data_).success(function (data) {
            if (data.status == 500) {
                alert(data.message)
            }
            wx_pay = JSON.parse(data.result);
            console.log(wx_pay);
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
    }
}]);

myController.controller('order_detailsController', ['$scope', '$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    $('title').text('订单详情');
    var id = get_param(location.href, 'id');
    $http.post(window.API.BUYER.ORDER_DETAILS, {id: id}).success(function (data) {
        console.log(data);
        $scope.results = data;
    })
}]);

myController.controller('personalController', ['$scope', '$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    $('title').text('我的');
    var openId = $cookieStore.get('openId');
    $http.post(window.API.BUYER.GET_USER_INFO, {openId: openId}).success(function (data) {
        console.log(data);
        $scope.user = data;
    });
}]);

myController.controller('new_addressController', ['$scope', '$http', '$rootScope', '$cookieStore', function ($scope, $http, $rootScope, $cookieStore) {
    // 兼容苹果下拉
    $('.arrow_down').click(function () {
        if ($(this).parent('div').hasClass('open')) {
            $(this).parent('div').addClass('open')
        }
        else {
            $(this).parent('div').removeClass('open')
        }
    });
    var id = get_param(location.href, 'id');
    var openId = $cookieStore.get('openId');
    $scope.$on('$destroy', function () {
        $rootScope.myAddress = "";
    });

    var tag = location.href.indexOf('formOrder_confirm');

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
                    location.href = '#/address_manage?formOrder_confirm';
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

}]);

myController.controller('address_manageController', ['$scope', '$http', '$rootScope', '$cookieStore', function ($scope, $http, $rootScope, $cookieStore) {
    $('title').text('地址管理');
    var openId = $cookieStore.get('openId');
    var index = location.href.indexOf('id');
    var id = location.href.substring(index + 3);
    $http.post(window.API.BUYER.GET_ADDRESS_LIST, {openId: openId}).success(function (data) {
        console.log(data.length);
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
            $scope.$on('$destroy', function () {

            })
        }
        else {
            location.href = '#/new_address?id=' + id;
            $scope.$on('$destroy', function () {

            })
        }

    };

    $scope.serf_updateAddress = function (data) {
        location.href = '#/new_address';
        $rootScope.myAddress = data;
    };

    $scope.delete_address = function (id) {
        $http.post(window.API.BUYER.DELETE_ADDRESS, {id: id}).success(function (data) {
            console.log(data);
            alert(data.message);
            location.reload();
        })
    };
}]);


