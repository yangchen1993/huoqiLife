/**
 * Created by YCC on 2016/8/23.
 */
var myController = angular.module('myController',[]);

myController.controller('mainController',['$scope',function($scope){
    $('#myCarousel').carousel({
        interval: 3000
    });
    $('.banner i').click(function(){
        $(this).css('color','#e42220');
    })
}]);
