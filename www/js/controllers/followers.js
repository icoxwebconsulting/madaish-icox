app.controller('FollowersController', function ($scope, GLOBAL, SocialService, $state, $stateParams, UserService, UtilsService) {

    $scope.loadFollowers = function(){
        UtilsService.showSpinner();

        var username = $stateParams.username;

        SocialService.resource.getFollowers({friendlyUserName: username, page: $scope.page}).$promise.then(function (data) {
            var followers = data.Follows;
            followers.forEach(function (follow) {
                follow.UserId = follow.Id;
                follow.FriendlyUrlUserName = follow.FriendlyUrlName;
                $scope.followers.push(follow);
            });
            UtilsService.hideSpinner();
        }).finally(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            UtilsService.hideSpinner();
        });

    };

    $scope.init = function(){
        $scope.followers = [];
        $scope.page = 1;
        $scope.loadFollowers();
    };

    $scope.init();

    $scope.loadMore = function(){
        $scope.page++;
        $scope.loadFollowers();
    };

});