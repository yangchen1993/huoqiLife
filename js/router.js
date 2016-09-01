/**
 * Created by YCC on 2016/8/19.
 */
var myApp = angular.module('myApp',['ui.router','myController']);

myApp.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when('','/main');

    $stateProvider
        // .state('login',{
        //     url:'/login',
        //     templateUrl:'template/login.html',
        //     controller:'loginController'
        // })
        .state('main',{
            url:'/main',
            templateUrl:'template/main.html',
            controller:'mainController'
        })
        .state('shop',{
            url:'/shop',
            templateUrl:'template/shop.html',
            controller:'shopController'
        })
        .state('order',{
            url:'/order',
            templateUrl:'template/order.html',
            controller:'orderController'
        })

        .state('personal',{
            url:'/personal',
            templateUrl:'template/personal.html',
            controller:'personalController'
        })

        .state('join',{
            url:'/join',
            templateUrl:'template/business/join.html',
            controller:'joinController'
        })
        .state('business_info',{
            url:'/business_info',
            templateUrl:'template/business/business_info.html',
            controller:'business_infoController'
        })

});
