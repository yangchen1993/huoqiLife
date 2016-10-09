/**
 * Created by YCC on 2016/9/1.
 */
myController.controller('business_joinController',['$scope','$http','$cookieStore','$interval',function($scope,$http,$cookieStore,$interval){
    $('title').text('商家入驻');
    var url = location.href;
    var openId = get_param(url, "openId");
    if(openId != ""){
        $cookieStore.put('openId', openId);
    }

    $scope.Vcode = "获取验证码";
    $scope.get_sms = function(){
        if(!$scope.tel){
            alert("请输入手机号")
        }
        else if($scope.tel.length != 11){
            alert('手机号码格式不正确！');
        }
        else{
            var data_ = {
                'cellPhone':$scope.tel,
                'openId':openId
            };
            $http.post(window.API.BUSINESS.GET_SMS,data_).success(function(data){
                console.log(data);
                if(data.status == 200){
                    var s = 90;
                    var timer = $interval(function(){
                        $scope.Vcode_disabled = true;
                        $scope.Vcode = s+"s后可重发";
                        console.log(s);
                        if(s == 0){
                            $interval.cancel(timer);
                            $scope.Vcode_disabled = false;
                            $scope.Vcode = "获取验证码";
                        }
                        s--;
                    },1000);
                }
                if(data.status == 500){
                    alert(data.message)
                }
            })
                .error(function (data) {
                    alert(data.message)
                })
        }
    };

    $scope.submit = function(){
        if($scope.tel && $scope.sms){
            var data_ = {
                'cellPhone': $scope.tel,
                'code':$scope.sms,
                'openId':$cookieStore.get('openId')
            };
            $http.post(window.API.BUSINESS.JOIN,data_).success(function(data){
                console.log(data);
                if(data.status == 200){
                    location.href = "#/business_info?tel="+$scope.tel;
                }
                if(data.status == 500){
                    alert(data.message);
                }
            })
                .error(function(data){
                    console.log(data);
                })
        }
        else {
            alert('请完善填写信息')
        }
    }
}]);

myController.controller('business_infoController',['$scope','$http','$cookieStore',function($scope,$http,$cookieStore){
    $('title').text('商家入驻');
    var tel = location.href.indexOf("?tel");
    if(tel != -1){
        var tel_num = location.href.substring(tel+5);
        $scope.shop = {
            "phone":tel_num
        };
    }

    $('.license_panel div i').click(function(){
        if($(this).css('color') == "rgb(204, 203, 203)"){
            $(this).css('color','#e42121')
        }
        else{
            $(this).css('color','#cccbcb')
        }

        if($('#gas').css('color') == 'rgb(228, 33, 33)'){
            $('#license_img').css('display','block');
        }
        else{
            $('#license_img').css('display','none');
        }
    });
    $('.protocol i').click(function(){
        if($(this).css('color') == "rgb(228, 33, 33)"){
            $(this).css('color','#cccbcb');
            $('#a').attr("disabled",true);
        }
        else{
            $(this).css('color','#e42121');
            $('#a').attr("disabled",false);
        }
    });

    var lat,lng,address;
    var map = new AMap.Map('container',{
        resizeEnable:true
    });
    $scope.location_shop = function () {
        geocoder($scope.myShop);
    };
    function geocoder(myShop) {
        var geocoder = new AMap.Geocoder({
            // city: "028", //城市，默认：“全国”
            radius: 3000 //范围，默认：500
        });
        //地理编码,返回地理编码结果
        geocoder.getLocation(myShop, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result);
            }
        });
    }
    //地理编码返回结果展示
    function geocoder_CallBack(data) {
        var geocode = data.geocodes;
        addMarker(geocode[0]);
        map.setFitView();
    }
    function addMarker(d) {
        console.log(d);
        map.clearMap();
        var marker = new AMap.Marker({
            map: map,
            position: [ d.location.getLng(),  d.location.getLat()]
        });
        lat = d.location.getLat();
        lng = d.location.getLng();
        address = d.formattedAddress;
        var infoWindow = new AMap.InfoWindow({
            content: d.formattedAddress,
            offset: {x: 0, y: -30}
        });
        infoWindow.open(map, marker.getPosition());
    }

    $('#license_file').change(function(){
        $('.upload_zhizhao').css('text-align','right');
        var files = $(this)[0].files[0];
        var URL = window.URL || window.webkitURL;
        var imgURL = URL.createObjectURL(files);
        console.log(imgURL);
        $('.upload_zhizhao').find('span').remove();
        $('.upload_zhizhao').css('background-color','#fff');
        $('#preview').attr('src',imgURL);
        $('#preview').css('display','inline');

    });

    $scope.submit = function(shop){
        $('#overlay').css('height',$(document).height()+'px');    //遮罩层高度

        if(shop.name && $scope.myShop){
            var files = $('#license_file')[0].files[0];
            console.log(files);
            var checkBoxs = angular.element('.license_panel i');
            var list = [];
            var latLng = [lat,lng];
            console.log(latLng);
            angular.forEach(checkBoxs,function(v,k){
                console.log($(v).css('color'));
                if($(v).css('color') == 'rgb(228, 33, 33)'){
                    console.log($(v).attr('name'));
                    list.push($(v).attr('name'))
                }
            });
            console.log(list);

            var data_ = new FormData();
            data_.append('name',shop.name);
            data_.append('phone',shop.phone);
            data_.append('tel',shop.tel);
            data_.append('type',list);
            data_.append('picture',files);
            data_.append('longitude',lng);
            data_.append('latitude',lat);
            data_.append('address',address);
            data_.append('openId',$cookieStore.get('openId'));
            console.log(data_);
            if($('#gas').css('color') == 'rgb(228, 33, 33)'){
                if(files){
                    $('#overlay').css('display','block');
                    $http.post(window.API.BUSINESS.INFO,data_,{"headers": {"Content-Type": undefined}}).success(function(data){
                        console.log(data);
                        $('#overlay').css('display','none');
                        if(data.status == 200){
                            alert("入驻成功");
                            location.href = "#/business_user?openId="+data.message;
                        }
                    });
                }
                else{
                    alert('请上传营业执照');
                }
            }
            else{
                $('#overlay').css('display','block');
                $http.post(window.API.BUSINESS.INFO,data_,{"headers": {"Content-Type": undefined}}).success(function(data){
                    console.log(data);
                    $('#overlay').css('display','none');
                    if(data.status == 200){
                        alert("入驻成功");
                        location.href = "#/business_user?openId="+data.message;
                    }
                })
            }
        }
        else{
            alert("请完善必填信息")
        }
    };

    //免责声明协议
    $http.post(window.API.BUSINESS.GET_PROTOCOL,{status:"AT01"}).success(function (data) {
        console.log(data);
        $scope.protocol_title = data.ARTICLE_TITLE;
        $('.modal-body').append(data.ARTICLE_CONTENT)
    })
}]);

myController.controller('business_uploadController',['$scope','$http','$cookieStore','$rootScope',function($scope,$http,$cookieStore,$rootScope){
    $scope.$on('$destroy', function () {     //离开页面$rootScope对象制空;
        $rootScope.goods1 = ""
    });
    setTimeout(function () {
        if($rootScope.goods1){
            $('title').text('商品编辑');
            $scope.goods = $rootScope.goods1;
            $scope.myBtn = 1;
            $scope.goods.specNum = $rootScope.goods1.weight;
            $scope.goods.desc = $rootScope.goods1.describe;
            $scope.goods.spec = $rootScope.goods1.weightUnit;
            $scope.goods.id = $rootScope.goods1.id;
            $scope.goods.img = $rootScope.goods1.img;
            $scope.goods.createTime = $rootScope.goods1.createTime;
            $('#preview0').attr('src','http://io.huoqilife.com/img/'+$rootScope.goods1.img);
            if($rootScope.goods1.category = 'GC01'){
                $scope.goods.type = '液化气';
                $scope.spec1 = true;   //显示单位
            }
            else if($rootScope.goods1.category = 'GC02'){
                $scope.goods.type = '桶装水';
                $scope.spec1 = true;    //显示单位
            }
            else if($rootScope.goods1.category = 'GC03'){
                $scope.goods.type = '灶具';
                $scope.spec1 = true;    //显示单位
            }
            else{
                $scope.goods.type = '其他';
            }
        }
        else{
            $scope.myBtn = 2;
            $('title').text('上传商品');
        }
    },0);

    // 兼容苹果下拉
    $('#goods_type').click(function () {
        if($(this).parent('div').hasClass('open')){
            $(this).parent('div').addClass('open')
        }
        else{
            $(this).parent('div').removeClass('open')
        }
    });
    $('#goods_spec').click(function () {
        if($(this).parent('div').hasClass('open')){
            $(this).parent('div').addClass('open')
        }
        else{
            $(this).parent('div').removeClass('open')
        }
    });

    var openId = $cookieStore.get('openId');
    //获取经营范围
    $scope.goods = {};
    $http.post(window.API.BUSINESS.GET_BUSINESS_SCOPE,{openId:openId}).success(function (data) {
        console.log(data);
        var data_ = _.values(data);
        $scope.business_scope = function (type) {
            if(_.indexOf(data_,type) == -1){
                return false
            }
            else{
                return true
            }
        }

    });

    $scope.spec_self = 1;
    $scope.goods_type_choice = function(type,spec){
        if(type == "灶具"){
            $scope.spec_show = true
        }
        else{
            $scope.spec_show = false
        }
        if(type == "其他"){
            $scope.spec_self = 2;
            $scope.spec1 = false
        }
        else{
            $scope.spec_self = 1;
            $scope.spec1 = true
        }
        $scope.goods.type = type;
        $scope.goods.spec = spec;
    };

    $('.pay_way div i').click(function() {
        $(this).css('color','#e42121').parent().siblings().find('i').css('color','#cccbcb')
    });

    $scope.submit = function(goods){
        $('#overlay').css('height',$(document).height()+'px');    //遮罩层高度

        var file0 = $('#files0')[0].files[0];
        var file1 = $('#files1')[0].files[0];
        var file2 = $('#files2')[0].files[0];
        var data_ = new FormData();

        //编辑商品
        if($rootScope.goods1){
            console.log(goods);
            if((goods.name && goods.type && goods.spec && goods.price) || goods == undefined){
                data_.append('name',goods.name);
                if(goods.type == '液化气'){
                    data_.append('category','GC01');
                }
                else if(goods.type == '桶装水'){
                    data_.append('category','GC02');
                }
                else if(goods.type == '灶具'){
                    data_.append('category','GC03');
                }
                else{
                    data_.append('category','GC99');
                }
                        var myDate = new Date($rootScope.goods1.createTime);
                        var myDate1 = myDate.getFullYear()+'-'+myDate.getMonth()+'-'+myDate.getDate()+" "+myDate.getHours()+':'+myDate.getMinutes()+':'+myDate.getSeconds();
                        data_.append('time',myDate1);
                        data_.append('id',$rootScope.goods1.id);
                data_.append('img',$rootScope.goods1.img);
                data_.append('isMarketable',$rootScope.goods1.isMarketable);

                data_.append('weight',goods.specNum);
                data_.append('weightUnit',goods.spec);
                data_.append('price',goods.price);
                if(goods.desc == undefined){
                    data_.append('describe','');
                }
                else{
                    data_.append('describe',goods.desc);
                }
                data_.append('imgs',file0);
                data_.append('imgs',file1);
                data_.append('imgs',file2);
                data_.append('openId',openId);
                $('#overlay').css('display','block');
                $http.post(window.API.BUSINESS.UPLOAD,data_,{"headers": {"Content-Type": undefined}}).success(function(data){
                    console.log(data);
                    $('#overlay').css('display','none');
                    alert("商品上传成功");
                    location.href = "#/business_user?openId="+$cookieStore.get('openId');
                })
                    .error(function(data){
                        console.log(data);
                    })
            }
            else{
                alert('请完善商品信息');
            }
        }
        //上传商品
        else{
            if((goods.name && goods.type && goods.spec && goods.price && file0) || goods == undefined){
                data_.append('name',goods.name);
                if(goods.type == '液化气'){
                    data_.append('category','GC01');
                }
                else if(goods.type == '桶装水'){
                    data_.append('category','GC02');
                }
                else if(goods.type == '灶具'){
                    data_.append('category','GC03');
                }
                else{
                    data_.append('category','GC99');
                }
                data_.append('weight',goods.specNum);
                data_.append('weightUnit',goods.spec);
                data_.append('price',goods.price);
                if(goods.desc == undefined){
                    data_.append('describe','');
                }
                else{
                    data_.append('describe',goods.desc);
                }
                data_.append('imgs',file0);
                data_.append('imgs',file1);
                data_.append('imgs',file2);
                data_.append('openId',openId);
                $('#overlay').css('display','block');
                $http.post(window.API.BUSINESS.UPLOAD,data_,{"headers": {"Content-Type": undefined}}).success(function(data){
                    console.log(data);
                    $('#overlay').css('display','none');
                    alert("商品上传成功");
                    location.href = "#/business_user?openId="+$cookieStore.get('openId');
                })
                    .error(function(data){
                        console.log(data);
                    })
            }
            else{
                alert('请完善商品信息');
            }
        }
    }
}]);

myController.controller('business_userController',['$scope','$http','$cookieStore',function($scope,$http,$cookieStore){
    $('title').text('商家中心');
    var url = location.href;
    var openId = get_param(url, "openId");
    $cookieStore.put('openId', openId);
    $http.post(window.API.BUYER.GET_SHOP_DETAILS,{'openId':openId}).success(function(data){
        console.log(data);
        $scope.userInfo = data;
    })

    $scope.surf_goods = function (id) {
        location.href = '#/business_goods?id='+id;
    }
}]);

myController.controller('business_orderController',['$scope','$http','$cookieStore',function($scope,$http,$cookieStore){
    $('title').text('订单管理');
    var openId = $cookieStore.get('openId');
    $('.nav_self div').click(function () {
        $(this).css({'color': '#e42121'}).siblings().css({'color': '#222'})
    });
    $scope.move_hk = function (i,status) {
        $('.div_hk').animate({'margin-left': ((i-1)*25+3)+'%'});
        get_orderInfo_by_state(status);
    };

    function get_orderInfo_by_state(state){
        var data_ = {
            opt: state,
            openId:openId,
            role:'ORDERS_ACCEPTER_ID'
        };
        $http.post(window.API.BUYER.ORDER_LIST,data_).success(function (data) {
            _.map(data,function(v){
                var time = new Date(v.createTime);
                return v.createTime = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()
            });
            $scope.results = data;
            console.log(data);
        })
    }

    get_orderInfo_by_state('OT02');

    $scope.order_update = function(id,status,status1){
        var data_ = {
            id:id,
            status:status
        };
        $http.post(window.API.BUYER.ORDER_UPDATE,data_).success(function(data){
            console.log(data);
            alert(data.message);
            get_orderInfo_by_state(status1);
        })
    };

    $scope.surf_businessOrderDetails = function (id) {
        location.href = "#/business_order_details?id=" + id;
    }
}]);

myController.controller('business_order_detailsController', ['$scope', '$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    $('title').text('订单详情');
    var id = get_param(location.href, 'id');
    $http.post(window.API.BUYER.ORDER_DETAILS, {id: id}).success(function (data) {
        console.log(data);
        $scope.results = data;
    })
}]);


myController.controller('business_goodsController',['$scope','$http','$cookieStore','$rootScope',function($scope,$http,$cookieStore,$rootScope){
    $('title').text('商品管理');
    var id = get_param(location.href,'id');

    $('.off_sale').click(function () {
        $(this).css({'color':'#e42121','background-color':'#fff'}).siblings().css({'color':'#fff','background-color':'#e42121'})
        get_goods(false)
    });
    $('.sale').click(function () {
        $(this).css({'color':'#e42121','background-color':'#fff'}).siblings().css({'color':'#fff','background-color':'#e42121'});
        get_goods(true);
    });

    function get_goods(status) {
        var data_ = {
            id:id,
            status:status
        };
        $http.post(window.API.BUSINESS.GET_SALE_GOODS,data_).success(function (data) {
            console.log(data);
            $scope.results = data;
        })
    }
    get_goods(true);

    $scope.self_uploadGoods = function (data) {
        $rootScope.goods1 = data;
        location.href = '#/business_upload'
    };

    $scope.self_offGoods = function (id) {
        $http.post(window.API.BUSINESS.OFF_SALE_GOODS,{ids:id}).success(function (data) {
            alert(data.message);
            get_goods(true);
        })
    };
    
    $scope.self_upGoods = function (id) {
        $http.post(window.API.BUSINESS.UP_SALE_GOODS,{ids:id}).success(function (data) {
            alert(data.message);
            get_goods(false);
        })
    }
}]);
