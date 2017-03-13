app.controller('UserController', function ($scope, $state, $stateParams, AuthService, UserService, SocialService, UtilsService, $rootScope, API) {

    if($state.current.name == 'base.register')
    {
        $scope.register = {};
        $scope.$watch('register', function(){
            var f = $scope.register;
            f.valid = f.username && f.email && f.password;
        }, true);

        $scope.signUp = function(){

            if($scope.register.password != $scope.register.confirm){
                return UtilsService.showAlert("La contraseña no coinciden");
            }

            var user = new UserService.resource();
            user.username = $scope.register.username;
            user.email = $scope.register.email;
            user.password = $scope.register.password;
            user.FbId = null;
            user.FbImage = null;

            UtilsService.showSpinner();
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
        };
    }


    self.loadUser = function(username){
        UserService.resource.getFashionist({user: username}).$promise.then(function(data){
            $scope.user = angular.extend({}, data.Profile, data.extraInfo);

            data.Results.forEach(function(post){
                post.Profile = {
                    UserId: post.UserId,
                    UserName: post.UserName,
                    FriendlyUrlName: post.FriendlyUrlUserName,
                    Avatar: post.UserAvatar
                };
                if(post.ContentType == 1){
                    post.FriendlyUrlTitle = post.FriendlyUrlLookTitle;
                }
                post.Type = post.Category.Name;
                $scope.posts.push(post);
            });

        });
    };


    if ($state.current.name == 'tabs.user') {

        $scope.init = function(){
            $scope.user = [];
            $scope.posts = [];
            self.loadUser(UserService.getUser().Name);
            $scope.widget = 'settings';

        };

        $scope.profile = function () {
            SocialService.resource.getFollowed({friendlyUserName: UserService.getUser().FriendlyUrlUserName}).$promise.then(function (data) {
                console.log('data', data);
            })
        };

        $scope.init();

        $rootScope.$on('post:refresh', function(event, args) {
            $scope.init();
        });
    }


    if ($state.current.name == 'base.fashionist') {

        $scope.loadFashionist = function() {
            $scope.user = [];
            $scope.posts = [];
            $scope.widget = 'follow';
            var username = $stateParams.username;
            self.loadUser(username);
        };

        $scope.loadFashionist();
    }

    if($state.current.name == 'base.user-setting')
    {
        $scope.logout = function(){
          UserService.logout();
        };
        $scope.$on("$ionicView.enter", function(){
            UtilsService.setLastState('tabs.user');
        });
    }

    if($state.current.name == 'base.user-setting-profile')
    {
        $scope.$on("$ionicView.enter", function(){
            UtilsService.setLastState('base.user-setting');
        });

        var user = UserService.getUser();
        $scope.profile = {
            Avatar: UtilsService.getImageUrl(user.Avatar, API.image.user.path),
            Description: user.Description,
            ReceiveEgoMail: user.ReceiveEgoMail
        };

        $scope.update = function(params){

            var userResource = new UserService.resource();

            for(var p in params){
                var value = params[p];

                if(p == 'BornDate'){
                    value = value ? UtilsService.filter('date', value, 'yyyy/MM/dd') : undefined;
                }
                if(p == 'Avatar'){
                    value = value.replace(/data\:.+\;base64\,/, '');
                }

                if(value === undefined) continue;
                if(value === false) value = 'false';
                if(value === null || value === '') value = 'null';

                userResource[p] = value;
            }


            userResource.$updateProfile(function (response) {
                UtilsService.hideSpinner();
                UtilsService.showAlert('Perfil actualizado');
            }, function (error) {
                UtilsService.hideSpinner();
                UtilsService.showAlert('Error en conexion');
                return false;
            });

        };



    }
    if($state.current.name == 'base.user-setting-update'){
        $scope.$on("$ionicView.enter", function(){
            UtilsService.setLastState('base.user-setting');
        });
        var user = UserService.getUser();

        $scope.personal = {
            Name: user.Name,
            Surname: user.Surname,
            Country: user.Country,
            City: user.City,
            PostalCode: user.PostalCode,
            Phone: user.Phone,
            BornDate: (user.BornDate != null) ? new Date(user.BornDate) : undefined,
            Sex: (user.Sex != null) ? (user.Sex ? 'Mujer' : 'Hombre') : undefined,
            ReceiveEgoMail: user.ReceiveEgoMail
        }
    }

    if($state.current.name == 'base.user-setting-password'){

        $scope.$on("$ionicView.enter", function(){
            UtilsService.setLastState('base.user-setting');
        });

        $scope.changePassword = function(){

            var f = $scope.change;

            if(f.password != f.repassword){
                return UtilsService.showAlert("Las contraseñas deben ser iguales");
            }

            var userResource = new UserService.resource();
            userResource.oldpassword = f.currentPassword;
            userResource.NewPassword= f.password;
            userResource.confirmPassword= f.repassword;

            userResource.$changePassword(function (response) {
                UtilsService.hideSpinner();
                UtilsService.showAlert('Contraseña actualizada');
                $scope.change = {};
            }, function (error) {
                UtilsService.hideSpinner();
                UtilsService.showAlert('Error en conexion');
                return false;
            });

        };
    }

});