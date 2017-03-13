app.controller('UserCardController', function ($scope, $state, PostService, UserService, UtilsService, SocialService) {

    var user = $scope.data;

    $scope.init = function(){

        if($scope.widget == 'follow' && user.FriendlyUrlUserName == UserService.getUser().FriendlyUrlUserName){
            $scope.widget = '';
        }
        $scope.label = '@';

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

        console.info('user fashionist --> ', user);

        if(user.UserId == UserService.getUser().UserId || typeof user.FriendlyUrlUserName == "undefined")
        {
            $state.go('tabs.user');
        }else{
            var url = null;

            if(typeof user.FriendlyUrlUserName == "undefined")
                url = user.FriendlyUrlName;
            else
                url = user.FriendlyUrlUserName;

            return $state.go('base.fashionist', {
                username: url
            });
        }


    };

    $scope.follow = function(){

        console.info('user follow --> ', user);

        if(UserService.isLogged())
        {
            var currentPost = new PostService.resource();
            currentPost.UserId = user.UserId;

            return currentPost.$follow(function (response) {
                return response;
            }, function (error) {
                UtilsService.hideSpinner();
                UtilsService.showAlert('Error en conexion');
                return false;
            });
        }else{
            UtilsService.showAlert('Debe estar logeado.');
        }
    };

    $scope.settings = function(){
        $state.go("base.user-setting");
    };


});
