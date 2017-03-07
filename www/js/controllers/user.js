app.controller('UserController', function ($scope, $state, $stateParams, AuthService, UserService, SocialService, UtilsService, $rootScope) {

    if ($state.current.name == 'tabs.user') {

        $scope.init = function(){
            $scope.user = [];
            $scope.posts = [];
            UserService.resource.getFashionist({user: UserService.getUser().Name}).$promise.then(function(data){
                $scope.user = angular.extend({}, data.Profile, data.extraInfo);

                data.Results.forEach(function(post){
                    post.Profile = {
                        UserId: post.UserId,
                        UserName: post.UserName,
                        FriendlyUrlUserName: post.FriendlyUrlUserName,
                        Avatar: post.UserAvatar
                    };
                    if(post.ContentType == 1){
                        post.FriendlyUrlTitle = post.FriendlyUrlLookTitle;
                    }
                    post.Type = post.Category.Name;
                    $scope.posts.push(post);
                });

            });
            $scope.widget = 'settings';

        };

        $scope.profile = function () {
            SocialService.resource.getfollowed({friendlyUserName: UserService.getUser().FriendlyUrlUserName}).$promise.then(function (data) {
                console.log('data', data);
            })
        };

        $scope.init();

        $rootScope.$on('post:refresh', function(event, args) {
            console.log('$rootScope.$on | post:refresh');
            $scope.init();
        });
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