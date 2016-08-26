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

myController.controller('categoryController',['$scope',function($scope){
    $scope.top1 = "./img/category/top1.png";
    $scope.top2 = "./img/category/top2_c.png";
    $scope.top3 = "./img/category/top3_c.png";
    $scope.top4 = "./img/category/top4_c.png";
    
    $('.top_nav div').click(function(){
        $(this).css({'color': '#e42121'}).siblings().css({'color': '#fff'})
    });

    $scope.nav_self = function(index){
        if(index == 1){
            $scope.top1 = "./img/category/top1.png";
            $scope.top2 = "./img/category/top2_c.png";
            $scope.top3 = "./img/category/top3_c.png";
            $scope.top4 = "./img/category/top4_c.png";
            $('.hk_div').animate({'margin-left':'0'})
        }
        else if(index == 2){
            $scope.top2 = "./img/category/top2.png";
            $scope.top1 = "./img/category/top1_c.png";
            $scope.top3 = "./img/category/top3_c.png";
            $scope.top4 = "./img/category/top4_c.png";
            $('.hk_div').animate({'margin-left':'25%'})
        }
        else if(index == 3){
            $scope.top3 = "./img/category/top3.png";
            $scope.top2 = "./img/category/top2_c.png";
            $scope.top1 = "./img/category/top1_c.png";
            $scope.top4 = "./img/category/top4_c.png";
            $('.hk_div').animate({'margin-left':'50%'})
        }
        else if(index == 4){
            $scope.top4 = "./img/category/top4.png";
            $scope.top2 = "./img/category/top2_c.png";
            $scope.top3 = "./img/category/top3_c.png";
            $scope.top1 = "./img/category/top1_c.png";
            $('.hk_div').animate({'margin-left':'75%'})
        }
    }
}]);

myController.controller('personalController',['$scope',function($scope){

}]);

myController.controller('shopController',['$scope',function($scope){

}]);
