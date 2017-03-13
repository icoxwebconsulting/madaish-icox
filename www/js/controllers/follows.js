app.controller('FollowsController', function ($scope, GLOBAL, SocialService, $state, $stateParams, UserService, UtilsService) {

    self.loadSuggestions = function () {
        $scope.follows = [];
        SocialService.resource.postFollowSuggestions().$promise.then(function (data) {

            data.forEach(function (follow) {
                follow.UserId = follow.Id;
                follow.FriendlyUrlUserName = follow.FriendlyUrlName;
                $scope.follows.push(follow);
            });
        });

    };

    if ($state.current.name == 'base.follows') {
        $scope.loadFollows = function(){
            UtilsService.showSpinner();
            var username = $stateParams.username;

            SocialService.resource.getFollowed({friendlyUserName: username, page: $scope.page}).$promise.then(function (data) {

                if(data.Follows.length > 0){
                    $scope.suggestions = false;
                    var follows = data.Follows;
                    follows.forEach(function (follow) {
                        follow.UserId = follow.Id;
                        follow.FriendlyUrlUserName = follow.FriendlyUrlName;
                        $scope.follows.push(follow);
                    });
                }else{

                    if($scope.page == 1)
                    {
                        $scope.suggestions = true;
                        self.loadSuggestions();
                    }

                    $scope.page = null;

                }
                UtilsService.hideSpinner();
            }).finally(function(){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                UtilsService.hideSpinner();
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
    }

    if ($state.current.name == 'base.follows-suggestions') {
        $scope.$on("$ionicView.enter", function(){
            self.loadSuggestions();
            $scope.page = null;
        });
    }


});