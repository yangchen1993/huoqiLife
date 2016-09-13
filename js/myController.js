/**
 * Created by YCC on 2016/8/23.
 */
var myController = angular.module('myController',[]);

myController.controller('mainController',['$scope','$http','$cookieStore',function($scope,$http,$cookieStore){

    // var url = location.href;
    // var index = url.indexOf("?tag");
    // var openId = get_param(url,"openId");
    //
    // $cookieStore.put('openId',openId);
    //
    // if(index == -1){
    //     location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc27342194c0b6057&redirect_uri=http%3a%2f%2fhq.nongjiaotx.cn%2fwx%2fuser&response_type=code&scope=snsapi_userinfo&state=main#wechat_redirect";
    // }

    $('#myCarousel').carousel({
        interval: 3000
    });
    $('.circle_logo').click(function(){
        $('#circle_logo1').css('color','#e3c820');
        $('#circle_logo2').css('color','#36bcf4');
        $('#circle_logo3').css('color','#f5672a');
        $('#circle_logo4').css('color','#a0d021');
        $('.circle_logo').css('border','0');
        $(this).find('i').css('color','#e42220');
        $(this).css('border','1px solid #e22220');
        var type = $(this).siblings('p')[0].innerText;
        console.log(type);
        get_shopList(type);
    });


    function get_shopList(type){
        var img_index = 1;
        if(type == '液化气'){
            img_index = 1
        }
        else if(type == '桶装水'){
            img_index = 2
        }
        else if(type == '桶装水'){
            img_index = 3
        }
        else{
            img_index = 4
        }

        /*获取当前地理位置*/
        var lat,lng;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            }
            else {
                console.log("Geolocation is not supported by this browser.")
            }
        function showPosition(position)
        {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            var data_ = {
                'lng':lng,
                'lat':lat,
                'type':type
            };

            /*请求附近商家*/
            $http.post(window.API.BUYER.NEAR_BY,data_).success(function(data){
                console.log(data);
                $scope.results = data;
                for(var i=0;i<data.length;i++){
                    var s = Math.floor(Math.random()*3)+1;
                    console.log(s);
                    $scope.results[i].shopImg = img_index+'-'+s+'.jpg';
                }
            });
        }
        function showError(error)
        {
            switch(error.code)
            {
                case error.PERMISSION_DENIED:
                    console.log("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                {
                    var data_ = {
                        'lng':104.0635,
                        'lat':30.5488,
                        'type':type
                    };
                    /*请求附近商家*/
                    $http.post(window.API.BUYER.NEAR_BY,data_).success(function(data){
                        console.log(data);
                        $scope.results = data;
                        for(var i=0;i<data.length;i++){
                            var s = Math.floor(Math.random()*3)+1;
                            console.log(s);
                            $scope.results[i].shopImg = img_index+'-'+s+'.jpg';
                        }
                        console.log($scope.results)
                    });
                    // console.log("Location information is unavailable.");
                    break;
                }

                case error.TIMEOUT:
                    console.log("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.log("An unknown error occurred.");
                    break;
            }
        }
    }
    get_shopList("液化气");


    $scope.surf_shop = function(openId){
        location.href = "#/shop?openId="+openId;
    }
}]);

myController.controller('shopController',['$scope','$http',function($scope,$http){

    var openId = get_param(location.href,"openId");
    $http.post(window.API.BUYER.GET_SHOP_DETAILS,{'openId':openId}).success(function(data){
        console.log(data);
        $scope.goods = data.goods;
        for(var i=0;i<data.goods.length;i++){
            $scope.goods[i].img = data.goods[i].img.substring(data.goods[i].img.indexOf("img"));
        }
        console.log($scope.goods);
        $scope.shop = data;
    });

    $scope.surf_shopDetails = function(id){
        location.href = '#/shop_details?id='+id
    }
}]);
myController.controller('shop_detailsController',['$scope','$http',function($scope,$http){

    var id = get_param(location.href,"id");

    $http.post(window.API.BUYER.GET_GOODS_DETAILS,{id:id}).success(function(data){
        console.log(data);
        $scope.results = data;
        $scope.results.img = data.img.substring(data.img.indexOf('img'));
    })
    console.log($scope.results);

    $scope.run_shop = function(openId){
        location.href = '#/shop?openId='+openId
    }
}]);

myController.controller('riderController',['$scope',function($scope){
    $('.top_nav div').click(function(){
        $(this).css({'color': '#e42121'}).siblings().css({'color': '#fff'})
    });

    $scope.nav_self = function(index){
        if(index == 1){
            $('.hk_div').animate({'margin-left':'0'})
        }
        else if(index == 2){
            $('.hk_div').animate({'margin-left':'33.33%'})
        }
        else if(index == 3){
            $('.hk_div').animate({'margin-left':'66.66%'})
        }
    }
}]);

myController.controller('orderController',['$scope',function($scope){
    $('.nav_self div').click(function(){
        $(this).css({'color': '#e42121'}).siblings().css({'color': '#222'})
    });
    $scope.move_hk = function(i){
        if(i == 1){
            $('.div_hk').animate({'margin-left':'2%'})
        }
        if(i == 2){
            $('.div_hk').animate({'margin-left':'22%'})
        }
        if(i == 3){
            $('.div_hk').animate({'margin-left':'42%'})
        }
        if(i == 4){
            $('.div_hk').animate({'margin-left':'62%'})
        }
        if(i == 5){
            $('.div_hk').animate({'margin-left':'82%'})
        }
    }
}]);

myController.controller('personalController',['$scope',function($scope){

}]);

myController.controller('new_addressController',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
    $scope.$on('$destroy',function(){
       $rootScope.myAddress = "";
    });

    //修改地址
    if($rootScope.myAddress){
        var address_id = $rootScope.myAddress.id;
        $scope.address = $rootScope.myAddress;
        $scope.myProvince = $rootScope.myAddress.proName;
        $scope.myCity = $rootScope.myAddress.cityName;
        $scope.myArea = $rootScope.myAddress.countyName;
        if($rootScope.myAddress.isDef){
            $('.default').css('color','#e42121');
        }
        $scope.submit = function(data){
            var data_ = angular.copy(data);
            data_.id = address_id;
            data_.isDef = $rootScope.myAddress.isDef;
            data_.proName = $scope.myProvince;
            data_.cityName = $scope.myCity;
            data_.countyName = $scope.myArea;
            console.log(data_);
            $http.post(window.API.BUYER.UPDATE_ADDRESS,data_).success(function(data){
                console.log(data);
                alert(data.message);
            })
        }
    }

    else{
        //新建地址
        $scope.submit = function(data){
            var data_ = angular.copy(data);
            data_.openId = "oEQyzs4zzfJFZKHUWOA5BrD8Ssh0";
            data_.isDef = isDef;
            data_.proName = $scope.myProvince;
            data_.cityName = $scope.myCity;
            data_.countyName = $scope.myArea;
            console.log(data_);
            $http.post(window.API.BUYER.NEW_ADDRESS,data_).success(function(data){
                console.log(data);
                alert(data.message);
            })
        }

    }

    $http.get(window.API.BUYER.GET_ADDRESS).success(function(data){
        // console.log(data);
        $scope.province = data
    });

    $scope.select_province = function(name,code){
        $scope.myProvince = name;
        $http.post(window.API.BUYER.GET_ADDRESS,{'code':code}).success(function(data){
            console.log(data);
            $scope.city = data
        })
    };

    $scope.select_city = function(name,code){
        $scope.myCity = name;
        $http.post(window.API.BUYER.GET_ADDRESS,{'code':code}).success(function(data){
            console.log(data);
            $scope.area = data
        })
    };

    $scope.select_area = function(name){
        $scope.myArea = name;
    };

    var isDef;
    $('.default').click(function(){
        if($(this).css('color') == "rgb(204, 203, 203)"){
            $(this).css('color','#e42121');
            isDef = true
        }
        else{
            $(this).css('color','#cccbcb');
            isDef = false
        }
    });

}]);

myController.controller('address_manageController',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
    $http.post(window.API.BUYER.GET_ADDRESS_LIST,{openId:"oEQyzs4zzfJFZKHUWOA5BrD8Ssh0"}).success(function(data){
        // console.log(data);
        $scope.results = data;
    });

    $scope.serf_newAddress = function(){
        location.href = '#/new_address';
        $scope.$on('$destroy',function(){

        })
    };

    $scope.serf_updateAddress = function(data){
        location.href = '#/new_address';
        $rootScope.myAddress = data;
    };

    $scope.delete_address = function(id){
        $http.post(window.API.BUYER.DELETE_ADDRESS,{id:id}).success(function(data){
            console.log(data);
            alert(data.message)
        })
    };
}]);


