app.controller('FollowsController', function ($scope, GLOBAL, SocialService, $state, $stateParams, UserService, UtilsService) {

    $scope.loadFollows = function(){
        UtilsService.showSpinner();
        var username = $stateParams.username;

        SocialService.resource.getFollowed({friendlyUserName: username, page: $scope.page}).$promise.then(function (data) {

            if(data.Follows.length > 0){
                $scope.suggestions = false;
                $scope.follows = $scope.follows.concat(data.Follows);
            }else{
                $scope.page = null;
                $scope.suggestions = true;
                self.loadSuggetions();
            }
            UtilsService.hideSpinner();
        }).finally(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            UtilsService.hideSpinner();
        });

    };

    self.loadSuggetions = function () {
        $scope.follows = [];
        SocialService.resource.postFollowSuggestions().$promise.then(function (data) {

            data.forEach(function (follow) {
                follow.UserId = follow.Id;
                follow.FriendlyUrlUserName = follow.FriendlyUrlName;
                $scope.follows.push(follow);
            });
            console.log('follows',$scope.follows);

        });

    };

    $scope.init = function(){
        $scope.follows = [];
        $scope.page = 1;
        $scope.loadFollows();
    };

    $scope.init();

    $scope.loadMore = function(){
        $scope.page++;
        $scope.loadFollows();
    };


});