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

// myController.controller('shopController',['$scope',function($scope){
//     $('.top_nav div').click(function(){
//         $(this).css({'color': '#e42121'}).siblings().css({'color': '#fff'})
//     });
//
//     $scope.nav_self = function(index){
//         if(index == 1){
//             $('.hk_div').animate({'margin-left':'0'})
//         }
//         else if(index == 2){
//             $('.hk_div').animate({'margin-left':'33.33%'})
//         }
//         else if(index == 3){
//             $('.hk_div').animate({'margin-left':'66.66%'})
//         }
//     }
// }]);

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

}]);



