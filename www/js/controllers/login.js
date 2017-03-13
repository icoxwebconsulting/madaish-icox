app.controller('LoginController', function ($scope, $state, AuthService, UserService, UtilsService) {

    if ($state.current.name == 'tabs.login-email') {
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

            if($scope.login.forgot){
                if(!/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/.test($scope.login.email)){
                    $ionicLoading.hide();
                    return UtilsService.showAlert("Introduzca la dirección de email con la que realizó el registro");
                }else{
                    user.$recoverPassword(function (response) {
                        UtilsService.hideSpinner();
                        UtilsService.showAlert(response);
                        $state.go('base.login');
                    },function (error) {
                        UtilsService.hideSpinner();
                        UtilsService.showAlert('Error en conexion');
                        return false;
                    });
                }
            }else{
                UtilsService.showSpinner();
                user.password = $scope.login.password;
                user.$login(function (response) {
                    if(response.Success){
                        UtilsService.hideSpinner();
                        response.CurrentUser.FriendlyUrlUserName = response.CurrentUser.FriendlyUrlName;
                        response.CurrentUser.UserId = response.CurrentUser.Id;
                        response.CurrentUser.Token = response.Token;
                        UserService.setUser(response.CurrentUser);
                        $state.go('tabs.timeline');
                    }else{
                        UtilsService.hideSpinner();
                        UtilsService.showAlert('Datos invalidos');
                    }
                }, function (error) {
                    UtilsService.hideSpinner();
                    UtilsService.showAlert('Error en conexion');
                    return false;
                });
            }

        };
    }

    if ($state.current.name == 'tabs.login') {

        $scope.$on("$ionicView.enter", function(){
            UtilsService.setLastState('tabs.login');
        });

        self.loginFb = function(data){
            UtilsService.showSpinner();
            var user = new AuthService.resource();
            user.fbId = data.id;
            user.$facebookSignIn(function (response) {

                if(response.Success)
                {
                    response.CurrentUser.FriendlyUrlUserName = response.CurrentUser.FriendlyUrlName;
                    response.CurrentUser.UserId = response.CurrentUser.Id;
                    response.CurrentUser.Token = response.Token;
                    UtilsService.hideSpinner();
                    UserService.setUser(response.CurrentUser);
                    $state.go('tabs.timeline');
                }else{
                    var fbPicture = data.picture.data.is_silhouette ? null : 'https://graph.facebook.com/' + fbData.id + '/picture?width=250';
                    var user = new UserService.resource();
                    user.username = data.name;
                    user.email = data.email;
                    user.password = '';
                    user.FbId = data.id;
                    user.FbImage = fbPicture;

                    user.$new(function (response) {
                        if(response.Success){
                            var auth = new AuthService.resource();
                            auth.username = $scope.register.username;
                            auth.password = $scope.register.password;
                            auth.$login(function (response) {
                                if(response.Success){
                                    UtilsService.hideSpinner();
                                    response.CurrentUser.FriendlyUrlUserName = response.CurrentUser.FriendlyUrlName;
                                    response.CurrentUser.UserId = response.CurrentUser.Id;
                                    response.CurrentUser.Token = response.Token;
                                    UserService.setUser(response.CurrentUser);
                                    $state.go('tabs.timeline');
                                }else{
                                    UtilsService.hideSpinner();
                                    UtilsService.showAlert('Datos invalidos');
                                }
                            }, function (error) {
                                UtilsService.hideSpinner();
                                UtilsService.showAlert('Error en conexion');
                                return false;
                            });
                        }else{
                            UtilsService.hideSpinner();
                            UtilsService.showAlert(response.error);
                        }
                    }, function (error) {
                        UtilsService.hideSpinner();
                        UtilsService.showAlert('Error en conexion');
                        return false;
                    });
                }


            }, function (error) {
                UtilsService.hideSpinner();
                UtilsService.showAlert('Error en conexion');
                return false;
            });
        };

        var fbLoginSuccess = function (response) {
            if (!response.authResponse) {
                fbLoginError("Cannot find the authResponse");
                return;
            }
            var authResponse = response.authResponse;

            getFacebookProfileInfo(authResponse)
                .then(function (profileInfo) {
                    self.loginFb(profileInfo);
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
                            self.loginFb(profileInfo);
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

        $scope.guestLogin = function(){
            $state.go('tabs.explorer');
        }
    }


});