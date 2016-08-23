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
});
