/**
 * Created by YCC on 2016/8/19.
 */
var myApp = angular.module('myApp',['ui.router','ngCookies','myController']);

myApp.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when('','/main');

    $stateProvider
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
        .state('shop_details',{
            url:'/shop_details',
            templateUrl:'template/shop_details.html',
            controller:'shop_detailsController'
        })
        .state('rider',{
            url:'/rider',
            templateUrl:'template/rider.html',
            controller:'riderController'
        })
        .state('order',{
            url:'/order',
            templateUrl:'template/order.html',
            controller:'orderController'
        })
        .state('order_confirm',{
            url:'/order_confirm',
            templateUrl:'template/order_confirm.html',
            controller:'order_confirmController'
        })
        .state('personal',{
            url:'/personal',
            templateUrl:'template/personal.html',
            controller:'personalController'
        })
        .state('new_address',{
            url:'/new_address',
            templateUrl:'template/new_address.html',
            controller:'new_addressController'
        })
        .state('address_manage',{
            url:'/address_manage',
            templateUrl:'template/address_manage.html',
            controller:'address_manageController'
        })





        .state('business_user',{
            url:'/business_user',
            templateUrl:'template/business/business_user.html',
            controller:'business_userController'
        })
        .state('business_join',{
            url:'/business_join',
            templateUrl:'template/business/business_join.html',
            controller:'business_joinController'
        })
        .state('business_info',{
            url:'/business_info',
            templateUrl:'template/business/business_info.html',
            controller:'business_infoController'
        })
        .state('business_upload',{
            url:'/business_upload',
            templateUrl:'template/business/business_upload.html',
            controller:'business_uploadController'
        })

});
