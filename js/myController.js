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
        $('#circle_logo4').css('color','#e42220');
        $('.circle_logo').css('border','0');
        $(this).find('i').css('color','#e42220');
        $(this).css('border','1px solid #e22220')
    });
}]);
