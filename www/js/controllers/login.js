app.controller('LoginController', function ($scope, $state, AuthService, UserService, UtilsService) {

    $scope.init = function(){
        $scope.choice = '';
    };

    $scope.init();


    // $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //     console.info('view', viewData);
    //     viewData.showNavBar = true;
    //     // viewData.enableBack = true;
    // });


    if ($state.current.name == 'base.login-email') {
        $scope.login = {};
        $scope.login.valid = false;
        $scope.login.forgotPassword = false;

        $scope.$watch('login', function(){
            var l = $scope.login;
            l.valid = l.email && (l.password || l.forgotPassword);
        }, true);

        $scope.emailLogin = function(){
            var user = new AuthService.resource();
            user.username = $scope.login.email;
            user.password = $scope.login.password;

            UtilsService.showSpinner();
            user.$login(function (response) {
                if(response.Success){
                    UtilsService.hideSpinner();
                    response.CurrentUser.FriendlyUrlUserName = response.CurrentUser.FriendlyUrlName;
                    response.CurrentUser.UserId = response.CurrentUser.Id;
                    response.CurrentUser.Token = response.Token;
                    console.info('response',response);
                    UserService.setUser(response.CurrentUser);
                    $state.go('base.timeline');
                }else{
                    UtilsService.hideSpinner();
                    UtilsService.showAlert('Datos invalidos');
                }
            }, function (error) {
                UtilsService.hideSpinner();
                UtilsService.showAlert('Error en conexion');
                return false;
            });
        };
    }

    if ($state.current.name == 'base.login') {

        var fbLoginSuccess = function (response) {
            if (!response.authResponse) {
                fbLoginError("Cannot find the authResponse");
                return;
            }

            var authResponse = response.authResponse;

            getFacebookProfileInfo(authResponse)
                .then(function (profileInfo) {
                    apiService.loginFromFB(profileInfo).then(function (response) {
                        console.info('not connected', response);
                        $state.go('root.tabs.profile');
                        $timeout(function () {
                            $ionicLoading.hide();
                        }, 3000);
                        return userService.setCurrentUser(response);

                    }).catch(function (error) {
                        utilsService.hideSpinner();
                        $scope.loading = false;
                        $ionicLoading.hide();
                    });
                }, function (fail) {
                    // Fail get profile info
                    console.log('profile info fail', fail);
                });
        };

        // This is the fail callback from the login method
        var fbLoginError = function (error) {
            console.log('fbLoginError', error);
            $ionicLoading.hide();
        };

        // This method is to get the user profile info from the facebook api
        var getFacebookProfileInfo = function (authResponse) {
            var info = $q.defer();

            facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
                function (response) {
                    console.log(response);
                    info.resolve(response);
                },
                function (response) {
                    console.log(response);
                    info.reject(response);
                }
            );
            return info.promise;
        };

        //This method is executed when the user press the "Login with facebook" button
        $scope.facebookLogin = function () {
            facebookConnectPlugin.getLoginStatus(function (success) {
                if (success.status === 'connected') {

                    getFacebookProfileInfo(success.authResponse)
                        .then(function (profileInfo) {
                            apiService.loginFromFB(profileInfo).then(function (response) {
                                $state.go('root.tabs.profile');
                                $timeout(function () {
                                    $ionicLoading.hide();
                                }, 3000);
                                return userService.setCurrentUser(response);
                            }).catch(function (error) {
                                utilsService.hideSpinner();
                                $scope.loading = false;
                                $ionicLoading.hide();
                            });
                        }, function (fail) {
                            // Fail get profile info
                            console.log('profile info fail', fail);
                        });
                } else {

                    $ionicLoading.show({
                        template: 'Iniciando ...'
                    });
                    facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
                }
            });
        };
    }


});