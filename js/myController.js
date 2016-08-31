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

    geocoder();

    function geocoder() {
        var geocoder = new AMap.Geocoder({
            // city: "028", //城市，默认：“全国”
            radius: 1000 //范围，默认：500
        });
        //地理编码,返回地理编码结果
        geocoder.getLocation("北京市", function(status, result) {
            console.log(status);
            console.log(result);
            if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result);
            }
        });
    }

    //地理编码返回结果展示
    function geocoder_CallBack(data) {
        var resultStr = "";
        //地理编码结果数组
        var geocode = data.geocodes;
        console.log(geocode[0].location);
        console.log(geocode[0].location.lat+"---"+geocode[0].location.lng);
        // for (var i = 0; i < geocode.length; i++) {
        //     //拼接输出html
        //     resultStr += "<span style=\"font-size: 12px;padding:0px 0 4px 2px; border-bottom:1px solid #C1FFC1;\">" + "<b>地址</b>：" + geocode[i].formattedAddress + "" + "&nbsp;&nbsp;<b>的地理编码结果是:</b><b>&nbsp;&nbsp;&nbsp;&nbsp;坐标</b>：" + geocode[i].location.getLng() + ", " + geocode[i].location.getLat() + "" + "<b>&nbsp;&nbsp;&nbsp;&nbsp;匹配级别</b>：" + geocode[i].level + "</span>";
            addMarker(geocode[0]);
        // }
        map.setFitView();
        // document.getElementById("result").innerHTML = resultStr;
    }

    function addMarker(d) {
        var marker = new AMap.Marker({
            map: map,
            position: [ d.location.getLng(),  d.location.getLat()]
        });
        var infoWindow = new AMap.InfoWindow({
            content: d.formattedAddress,
            offset: {x: 0, y: -30}
        });
        marker.on("mouseover", function(e) {
            infoWindow.open(map, marker.getPosition());
        });
    }
}]);

