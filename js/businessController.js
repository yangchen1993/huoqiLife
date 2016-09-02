/**
 * Created by YCC on 2016/9/1.
 */
myController.controller('joinController',['$scope','$http',function($scope,$http){

    // location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc27342194c0b6057&redirect_uri=http://hq.nongjiatx.cn/wx/userDetail&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect";

    // location.href = "http://www.baidu.com";

    $http.get(window.API.BUSINESS.RUN_OPENID).success(function(){


    });

    // $http.get("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc27342194c0b6057&redirect_uri=139.196.238.215:8081/wx/userDetail&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect").success(function(data){
    //     console.log(data);
    // });

    $scope.get_sms = function(){
        console.log({'cellPhone':$scope.tel});
        $http.post(window.API.BUSINESS.GET_SMS,{'cellPhone':$scope.tel}).success(function(data){
            console.log(data);
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
                alert("验证成功");
                location.href = "#/business_info"
            }
        })
            .error(function(data){
                console.log(data);
            })
    }
}]);

myController.controller('business_infoController',['$scope','$http',function($scope,$http){
    $('.license_panel div i').click(function(){
        if($(this).css('color') == "rgb(204, 203, 203)"){
            $(this).css('color','#e42121')
        }
        else{
            $(this).css('color','#cccbcb')
        }
    });
    $('.protocol i').click(function(){
        if($(this).css('color') == "rgb(228, 33, 33)"){
            $(this).css('color','#cccbcb')
        }
        else{
            $(this).css('color','#e42121')
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
        console.log(d.location.getLng()+"-"+d.location.getLat())
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

    $scope.submit = function(shop){
        var files = $('#license_file')[0].files[0];
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
                alert("创建成功");

            }
        })
    };
}]);

myController.controller('business_userController',['$scope','$http',function($scope,$http){

}]);
