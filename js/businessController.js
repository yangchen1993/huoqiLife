/**
 * Created by YCC on 2016/9/1.
 */
myController.controller('business_joinController',['$scope','$http','$cookieStore','$interval',function($scope,$http,$cookieStore,$interval){
    var url = location.href;
    var openId = get_param(url, "openId");
    if(openId != ""){
        $cookieStore.put('openId', openId);
    }

    $scope.Vcode = "获取验证码";
    $scope.get_sms = function(){
        if(!$scope.tel){
            alert("请输入手机号")
        }
        else{
            var data_ = {
                'cellPhone':$scope.tel,
                'openId':openId
            };
            $http.post(window.API.BUSINESS.GET_SMS,data_).success(function(data){
                console.log(data);
                if(data.status == 200){
                    var s = 90;
                    var timer = $interval(function(){
                        $scope.Vcode_disabled = true;
                        $scope.Vcode = s+"s后可重发";
                        console.log(s);
                        if(s == 0){
                            $interval.cancel(timer);
                            $scope.Vcode_disabled = false;
                            $scope.Vcode = "获取验证码";
                        }
                        s--;
                    },1000);
                }
            })
        }
    };

    $scope.submit = function(){
        var data_ = {
            'cellPhone': $scope.tel,
            'code':$scope.sms,
            'openId':$cookieStore.get('openId')
        };
        $http.post(window.API.BUSINESS.JOIN,data_).success(function(data){
            console.log(data);
            if(data.status == 200){
                location.href = "#/business_info?tel="+$scope.tel;
            }
        })
            .error(function(data){
                console.log(data);
            })
    }
}]);

myController.controller('business_infoController',['$scope','$http','$cookieStore',function($scope,$http,$cookieStore){
    var tel = location.href.indexOf("?tel");
    if(tel != -1){
        var tel_num = location.href.substring(tel+5);
        $scope.shop = {
            "phone":tel_num
        };
    }

    $('.license_panel div i').click(function(){
        if($(this).css('color') == "rgb(204, 203, 203)"){
            $(this).css('color','#e42121')
        }
        else{
            $(this).css('color','#cccbcb')
        }

        if($('#gas').css('color') == 'rgb(228, 33, 33)'){
            $('#license_img').css('display','block');
        }
        else{
            $('#license_img').css('display','none');
        }
    });
    $('.protocol i').click(function(){
        if($(this).css('color') == "rgb(228, 33, 33)"){
            $(this).css('color','#cccbcb');
            $('#a').attr("disabled",true);
        }
        else{
            $(this).css('color','#e42121');
            $('#a').attr("disabled",false);
        }
    });

    var lat,lng,address;
    var map = new AMap.Map('container',{
        resizeEnable:true
    });
    $scope.location_shop = function () {
        geocoder($scope.myShop);
    };
    function geocoder(myShop) {
        var geocoder = new AMap.Geocoder({
            // city: "028", //城市，默认：“全国”
            radius: 3000 //范围，默认：500
        });
        //地理编码,返回地理编码结果
        geocoder.getLocation(myShop, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result);
            }
        });
    }
    //地理编码返回结果展示
    function geocoder_CallBack(data) {
        var geocode = data.geocodes;
        addMarker(geocode[0]);
        map.setFitView();
    }
    function addMarker(d) {
        console.log(d);
        map.clearMap();
        var marker = new AMap.Marker({
            map: map,
            position: [ d.location.getLng(),  d.location.getLat()]
        });
        lat = d.location.getLat();
        lng = d.location.getLng();
        address = d.formattedAddress;
        var infoWindow = new AMap.InfoWindow({
            content: d.formattedAddress,
            offset: {x: 0, y: -30}
        });
        infoWindow.open(map, marker.getPosition());
    }

    $('#license_file').change(function(){
        $('.upload_zhizhao').css('text-align','right');
        var files = $(this)[0].files[0];
        var URL = window.URL || window.webkitURL;
        var imgURL = URL.createObjectURL(files);
        console.log(imgURL);
        $('.upload_zhizhao').find('span').remove();
        $('.upload_zhizhao').css('background-color','#fff');
        $('#preview').attr('src',imgURL);
        $('#preview').css('display','inline');

    });

    $scope.submit = function(shop){
        if(shop.name && $scope.myShop){
            var files = $('#license_file')[0].files[0];
            console.log(files);
            var checkBoxs = angular.element('.license_panel i');
            var list = [];
            var latLng = [lat,lng];
            console.log(latLng);
            angular.forEach(checkBoxs,function(v,k){
                console.log($(v).css('color'));
                if($(v).css('color') == 'rgb(228, 33, 33)'){
                    console.log($(v).attr('name'));
                    list.push($(v).attr('name'))
                }
            });
            console.log(list);

            var data_ = new FormData();
            data_.append('name',shop.name);
            data_.append('phone',shop.phone);
            data_.append('tel',shop.tel);
            data_.append('type',list);
            data_.append('picture',files);
            data_.append('longitude',lng);
            data_.append('latitude',lat);
            data_.append('address',address);
            data_.append('openId',$cookieStore.get('openId'));
            console.log(data_);
            if($('#gas').css('color') == 'rgb(228, 33, 33)'){
                if(files){
                    $http.post(window.API.BUSINESS.INFO,data_,{"headers": {"Content-Type": undefined}}).success(function(data){
                        console.log(data);
                        if(data.status == 200){
                            alert("入驻成功");
                            location.href = "#/business_user?openId="+data.message;
                        }
                    });
                }
                else{
                    alert('请上传营业执照');
                }
            }
            else{
                $http.post(window.API.BUSINESS.INFO,data_,{"headers": {"Content-Type": undefined}}).success(function(data){
                    console.log(data);
                    if(data.status == 200){
                        alert("入驻成功");
                        location.href = "#/business_user?openId="+data.message;
                    }
                })
            }
        }
        else{
            alert("请完善必填信息")
        }
    };
}]);

myController.controller('business_uploadController',['$scope','$http','$cookieStore',function($scope,$http,$cookieStore){
    $scope.goods = {
        type:"液化气",
        spec:"kg"
    };
    $scope.spec_self = 1;
    $scope.goods_type_choice = function(type,spec){
        if(type == "其他"){
            $scope.spec_self = 2;
        }
        else{
            $scope.spec_self = 1;
        }

        $scope.goods = {
            type:type,
            spec:spec
        };
        if(type == "灶具"){
            $scope.spec_show = true
        }
        else{
            $scope.spec_show = false
        }
    };

    $('.pay_way div i').click(function() {
        $(this).css('color','#e42121').parent().siblings().find('i').css('color','#cccbcb')
    });

    $scope.submit = function(goods){
        console.log(goods);
        var file0 = $('#files0')[0].files[0];
        var file1 = $('#files1')[0].files[0];
        var file2 = $('#files2')[0].files[0];
        var data_ = new FormData();
        data_.append('name',goods.name);
        if(goods.type == '液化气'){
            data_.append('category','GC01');
        }
        else if(goods.type == '桶装水'){
            data_.append('category','GC02');
        }
        else if(goods.type == '灶具'){
            data_.append('category','GC03');
        }
        else{
            data_.append('category','GC99');
        }
        data_.append('weight',goods.specNum);
        data_.append('weightUnit',goods.spec);
        data_.append('price',goods.price);
        data_.append('describe',goods.desc);
        data_.append('imgs',file0);
        data_.append('imgs',file1);
        data_.append('imgs',file2);
        data_.append('openId',$cookieStore.get('openId'));
        $http.post(window.API.BUSINESS.UPLOAD,data_,{"headers": {"Content-Type": undefined}}).success(function(data){
            console.log(data);
            alert("商品上传成功");
            location.href = "#/business_user?openId="+$cookieStore.get('openId');
        })
            .error(function(data){
                console.log(data);
            })
    }
}]);

myController.controller('business_userController',['$scope','$http','$cookieStore',function($scope,$http,$cookieStore){
    var url = location.href;
    var openId = get_param(url, "openId");
    $cookieStore.put('openId', openId);
    $http.post(window.API.BUYER.GET_SHOP_DETAILS,{'openId':openId}).success(function(data){
        console.log(data);
        $scope.userInfo = data;
    })
}]);

myController.controller('business_orderController',['$scope','$http','$cookieStore',function($scope,$http,$cookieStore){
    var openId = $cookieStore.get('openId');
    $('.nav_self div').click(function () {
        $(this).css({'color': '#e42121'}).siblings().css({'color': '#222'})
    });
    $scope.move_hk = function (i,status) {
        $('.div_hk').animate({'margin-left': ((i-1)*25+3)+'%'});
        get_orderInfo_by_state(status);
    };

    function get_orderInfo_by_state(state){
        var data_ = {
            opt: state,
            openId:openId,
            role:'ORDERS_ACCEPTER_ID'
        };
        $http.post(window.API.BUYER.ORDER_LIST,data_).success(function (data) {
            _.map(data,function(v){
                var time = new Date(v.createTime);
                return v.createTime = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()
            });
            $scope.results = data;
            console.log(data);
        })
    }

    get_orderInfo_by_state('OT02');

    $scope.order_update = function(id,status,status1){
        var data_ = {
            id:id,
            status:status
        };
        $http.post(window.API.BUYER.ORDER_UPDATE,data_).success(function(data){
            console.log(data);
            alert(data.message);
            get_orderInfo_by_state(status1);
        })
    }
}]);
