app.controller('UserCardController', function ($scope, $state, PostService, UserService, UtilsService, SocialService) {

    var user = $scope.data;

    $scope.init = function(){

        $scope.followsRef = 100; //UserService.getFollowsReference();

        if($scope.widget == 'follow' && user.FriendlyUrlUserName == UserService.getUser().FriendlyUrlUserName){
            $scope.widget = '';
        }
        console.info('widget', $scope.widget);

        switch($scope.widget){
            case '': break;
            case 'follow': $scope.showFollow = true; break;
            case 'settings': $scope.showSettings = true; break;
            default: $scope.showCustom = true; break;
        }
    };


    $scope.init();

    $scope.getImageUrl = function(image){
        return UtilsService.getImageUrl(image);
    };

    $scope.showFashionist = function(){

        return $state.go('base.fashionist', {
            userName: user.FriendlyUrlUserName
        });
    };

    $scope.follow = function(){

        return userService.askForLogin().then(function(currentUser){
            var follow = !$scope.followsRef[user.FriendlyUrlUserName];
            return apiService.follow(user.UserId, follow).then(function(){
                return userService.setFollow(user.FriendlyUrlUserName, follow);
            }).then(function(){
                apiService.getUser(currentUser.FriendlyUrlUserName, true);
            });
        });
    };

    $scope.settings = function(){
        $state.go("base.user-setting");
    };


});