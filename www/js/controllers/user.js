app.controller('UserController', function ($scope, $state, AuthService, UserService, SocialService, UtilsService) {

    var user = UserService.getUser();
    console.log('FriendlyUrlUserName',user.FriendlyUrlUserName);

    $scope.init = function(){
//        Crear Filtro capitalize para el nombre del perfil
        $scope.profile = UserService.getUser();
        console.log('user', $scope.profile);
    };

    $scope.profile = function () {
        SocialService.resource.getfollowed({friendlyUserName: userName}).$promise.then(function (data) {
            console.log('data', data);
        })
    };


    $scope.init();




    // $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //     console.info('view', viewData);
    //     viewData.showNavBar = true;
    //     // viewData.enableBack = true;
    // });

    if ($state.current.name == 'base.user') {
        console.info('entro en user profile');

        $scope.widget = 'settings'
    }


});