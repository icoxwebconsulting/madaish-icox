app.controller('UserController', function ($scope, $state, $stateParams, AuthService, UserService, SocialService, UtilsService) {

    if ($state.current.name == 'tabs.user') {

        $scope.init = function(){
            $scope.user = [];
            UserService.resource.getFashionist({user: UserService.getUser().Name}).$promise.then(function(data){
                $scope.user = angular.extend({}, data.Profile, data.extraInfo);
            });
            $scope.widget = 'settings';

        };

        $scope.profile = function () {
            SocialService.resource.getfollowed({friendlyUserName: UserService.getUser().FriendlyUrlUserName}).$promise.then(function (data) {
                console.log('data', data);
            })
        };

        $scope.init();

    }


    if ($state.current.name == 'tabs.fashionist') {

        $scope.loadFashionist = function(){
            $scope.user = {};
            $scope.widget = 'follow';
            var username = $stateParams.username;
            UserService.resource.getFashionist({user: username}).$promise.then(function(data){
                $scope.user = angular.extend({}, data.Profile, data.extraInfo)
            });
        };

        $scope.loadFashionist();
    }

});