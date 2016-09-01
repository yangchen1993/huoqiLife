/**
 * Created by YCC on 2016/9/1.
 */
myController.controller('joinController',['$scope','$http',function($scope,$http){
    $scope.submit = function(user){
        console.log(user.tel)
        $http.post('http://192.168.1.91:8080/business/merchants/in',user).success(function(data){
            console.log(data);
        })
    }
}]);

myController.controller('business_infoController',['$scope','$http',function($scope,$http){

}]);
