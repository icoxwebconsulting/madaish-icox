app.controller('UserController', function ($scope, $state, $stateParams, AuthService, UserService, SocialService, UtilsService) {

    if ($state.current.name == 'base.user') {

        $scope.init = function(){
            $scope.user = [];
            UserService.resource.getFashionist({user: UserService.getUser().userName}).$promise.then(function(data){
                $scope.user = angular.extend({}, data.Profile, data.extraInfo);
            });
            $scope.widget = 'settings';

        };

        $scope.profile = function () {
            SocialService.resource.getfollowed({friendlyUserName: $scope.user.userName}).$promise.then(function (data) {
                console.log('data', data);
            })
        };

        $scope.init();

    }


    if ($state.current.name == 'base.fashionist') {

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