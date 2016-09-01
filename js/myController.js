/**
 * Created by YCC on 2016/8/23.
 */
var myController = angular.module('myController',[]);

myController.controller('mainController',['$scope',function($scope){
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
        $(this).css('border','1px solid #e22220')
    });
}]);

myController.controller('shopController',['$scope',function($scope){
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
    })
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

        var infoWindow = new AMap.InfoWindow({
            content: d.formattedAddress,
            offset: {x: 0, y: -30}
        });
        // console.log(infoWindow)
        // marker.on("mouseover", function(e) {
            infoWindow.open(map, marker.getPosition());
        // });
    }
}]);



