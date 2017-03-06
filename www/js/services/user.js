app.factory('UserService', function ($resource, API, $localStorage, $ionicPush, NotificationService) {

    var resource = $resource(API.url, {}, {
        'getExplorer': {
            method: 'GET',
            isArray: false,
            url: API.url  + 'xplora/getxplora'
        },
        'getFashionist': {
            method: 'GET',
            isArray: false,
            url: API.url  + 'fashionists/getuserprofile'
        }
    });

    function isLogged(){

        if(typeof $localStorage.user === "undefined")
            return false;
        else
            return (typeof $localStorage.user.Token === "undefined") ? false : true;
    }

    function getUser(){
        return $localStorage.user || {};
    }

    function getUserId(){
        return isLogged() ? getUser().id : 0;
    }

    function notificationActive(){
        return isLogged() ? getUser().notification : false;
    }

    function setUser(user){
        $localStorage.user = user;
        registerDevice(user.Id);
    }

    function logout(){
        var data = {};
        data.access_token = $localStorage.user.access_token;
        data.device_token = $localStorage.device_token;
        data.os = $localStorage.os;
        unRegisterDevice(data).then(function(response){
            $localStorage.user = {};
            $state.go("tabs.login");
        });
    }

    function validateEmail(email) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(email);
    }

    function unRegisterDevice(data) {
        var deferred = $q.defer();
        var deviceResource = new DeviceService.resource();
        deviceResource.$unRegister({access_token: data.access_token, device_token: data.device_token }, function (response){
            deferred.resolve(response);
        }, function (error) {
            deferred.resolve(error);
        });
        return deferred.promise;
    }


    function registerDevice(userId) {
        return $ionicPush.register().then(function(t) {
            return $ionicPush.saveToken(t);
        }).then(function(t) {
            console.log('Token saved:', t.token);

            var os = '0';
            if (ionic.Platform.isIOS())
                os = '1';

            $localStorage.device_token = t.token;
            $localStorage.os = os;

            var notification = new NotificationService.resource();
            notification.user_id = userId;
            notification.os = os;
            notification.device_token = t.token;

            notification.$createDevice(function (response) {
                return true;
            }, function (error) {
                return false;
            });
        });
    }

    return {
        resource: resource,
        isLogged: isLogged,
        validateEmail: validateEmail,
        getUser: getUser,
        getUserId:getUserId,
        setUser: setUser,
        logout: logout,
        registerDevice:registerDevice,
        unRegisterDevice:unRegisterDevice,
        notificationActive: notificationActive
    };
});