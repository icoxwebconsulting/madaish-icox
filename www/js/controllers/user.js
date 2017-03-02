app.controller('UserController', function ($scope, $state, AuthService, UserService, UtilsService) {

    $scope.init = function(){
        $scope.choice = '';
    };

    $scope.init();


    // $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //     console.info('view', viewData);
    //     viewData.showNavBar = true;
    //     // viewData.enableBack = true;
    // });

    if ($state.current.name == 'user.profile') {

    }

});