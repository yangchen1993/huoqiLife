/**
 * Created by YCC on 2016/10/17.
 */
var myDirective = angular.module('myDirective',[]);

myDirective.directive('myUrl',function () {
    return{
        restrict:'AE',
        link:function (scope,element,attrs) {
            console.log(attrs.myUrl);
            element.css({'background':attrs.myUrl,'background-size': '300px 148px'})
        }
    }
});