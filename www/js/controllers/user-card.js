app.controller('UserCardController', function ($scope, GLOBAL, PostService, UtilsService, SocialService) {

    var user = $scope.data;

    $scope.init = function(){

    };

    $scope.init();

    $scope.getImageUrl = function(image){
        return UtilsService.getImageUrl(image);
    };

    if(!$scope.label){
        $scope.label = "@" + user.FriendlyUrlUserName;
    }

    if($scope.widget == 'follow' && user.FriendlyUrlUserName == userService.getCurrentUser().FriendlyUrlUserName){
        $scope.widget = '';
    }

    switch($scope.widget){
        case '': break;
        case 'follow': $scope.showFollow = true; break;
        case 'settings': $scope.showSettings = true; break;
        default: $scope.showCustom = true;
    }


});