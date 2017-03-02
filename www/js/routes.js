app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('base', {
            url: '/',
            abstract: true,
            templateUrl: 'templates/base.html'
        })
        .state('base.login', {
            url: 'login',
            views: {
                'timeline': {
                    templateUrl: 'templates/user/login/main.html',
                    controller: 'LoginController',
                    resolve: {
                        auth: function(UserService, $q) {
                            if (UserService.isLogged()) {
                                return $q.reject("logged");
                            }
                        }
                    }
                }
            }
        })
        .state('base.login-email', {
            url: 'login/email',
            views: {
                'timeline': {
                    templateUrl: 'templates/user/login/email.html',
                    controller: 'LoginController',
                    resolve: {
                        auth: function(UserService, $q) {
                            if (UserService.isLogged()) {
                                return $q.reject("logged");
                            }
                        }
                    }
                }
            }
        })
        .state('base.timeline', {
            url: 'timeline',
            views: {
                'timeline': {
                    templateUrl: 'templates/timeline/main.html',
                    controller: 'TimelineController',
                    resolve: {
                        auth: function(UserService, $q) {
                            if (!UserService.isLogged()) {
                                return $q.reject("not-logged");
                            }
                        }
                    }
                }
            }
        })
        .state('base.explorer', {
            url: 'explorer',
            views: {
                'explorer': {
                    templateUrl: 'templates/explorer/main.html',
                    controller: 'ExplorerController'
                }
            }
        })
        .state('user.profile', {
            url: 'user/profile',
//            views: {
//                'profile': {
                    templateUrl: 'templates/user/profile/main.html',
                    controller: 'UserController'
//                }
//            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/timeline');
    // $ionicConfigProvider.views.maxCache(0);

});
