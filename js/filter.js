/**
 * Created by YCC on 2016/9/22.
 */
var myFilter = angular.module('myFilter',[]);

myFilter.filter('status_date',function () {
    return function (input) {
        var index = input.indexOf('-')+1;
        return input.substring(index);
    }
});

myFilter.filter('status_name',function () {
    return function (input) {
        if(input == 'OT01'){
            return "已提交"
        }
        else if(input == 'OT02'){
            return "已付款"
        }
        else if(input == 'OT03'){
            return "已接单"
        }
        else if(input == 'OT04'){
            return "配送中"
        }
        else{
            return "已结束"
        }
    }
});

myFilter.filter('business_type',function () {
    return function (input) {
        var newData = input.split(',');
        var types = [];
        angular.forEach(newData,function (v,k) {
            if(v == 'BS01'){
                types.push('液化气') ;
            }
            else if(v == 'BS02'){
                types.push ('桶装水')
            }
            else if(v == 'BS03'){
                types.push ('灶具')
            }
            else{
                types.push ('其他')
            }
        });
        return types
    }
});

myFilter.filter('undefinedFilter',function () {
    return function (input) {
        if(input == undefined){
            console.log('1')
        }
    }
});