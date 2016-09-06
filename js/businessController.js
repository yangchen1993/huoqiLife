/**
 * Created by YCC on 2016/9/1.
 */
myController.controller('business_joinController',['$scope','$http','$interval',function($scope,$http,$interval){
    // $http.get("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc27342194c0b6057&redirect_uri=http://hq.nongjiaotx.cn/wx/user&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect").success(function(data){
    //     alert(data+"success");
    // })
    //     .error(function(data){
    //         alert(data+"failed");
    //     });
    // location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc27342194c0b6057&redirect_uri=http://hq.nongjiaotx.cn/wx/user&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect";
    // window.history.back();

    $scope.Vcode = "获取验证码";
    $scope.get_sms = function(){
        if(!$scope.tel){
            alert("请输入手机号")
        }
        console.log({'cellPhone':$scope.tel});
        $http.post(window.API.BUSINESS.GET_SMS,{'cellPhone':$scope.tel}).success(function(data){
            console.log(data);
            if(data.status == 200){
                var s = 60;
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
    };
    $scope.submit = function(){
        var data_ = {
            'cellPhone': $scope.tel,
            'code':$scope.sms
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

myController.controller('business_infoController',['$scope','$http',function($scope,$http){
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

    var lat,lng;
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
        console.log(d.location.getLng()+"-"+d.location.getLat());
        map.clearMap();
        var marker = new AMap.Marker({
            map: map,
            position: [ d.location.getLng(),  d.location.getLat()]
        });
        lat = d.location.getLat();
        lng = d.location.getLng();
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
            console.log(files)
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
            data_.append('longitude',lat);
            data_.append('latitude',lng);
            console.log(data_);
            $http.post(window.API.BUSINESS.INFO,data_,{"headers": {"Content-Type": undefined}}).success(function(data){
                console.log(data);
                if(data.status == 200){
                    alert("入驻成功");
                }
            })
        }
        else{
            alert("请完善必填信息")
        }

    };
}]);

myController.controller('business_uploadController',['$scope','$http',function($scope,$http){
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
        // var imgs = [file0,file1,file2];

        var data_ = new FormData();
        data_.append('name',goods.name);
        data_.append('category',goods.type);
        data_.append('weight',goods.specNum);
        data_.append('weightUnit',goods.spec);
        data_.append('price',goods.price);
        data_.append('describe',goods.desc);
        data_.append('imgs',file0);
        data_.append('imgs',file1);
        data_.append('imgs',file2);
        $http.post(window.API.BUSINESS.UPLOAD,data_,{"headers": {"Content-Type": undefined}}).success(function(data){
            console.log(data);
        })
            .error(function(data){
                console.log(data);
            })
    }
}]);

myController.controller('business_userController',['$scope','$http',function($scope,$http){

}]);
