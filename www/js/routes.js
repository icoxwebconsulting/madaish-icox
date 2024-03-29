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
            templateUrl: 'templates/base.html',
            controller: 'BaseController'
        })
        .state('base.register', {
            url: 'register',
            views: {
                'content': {
                    templateUrl: 'templates/user/register.html',
                    controller: 'UserController',
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
        .state('base.publish-post', {
            url: 'post/publish',
            views: {
                'content': {
                    templateUrl: 'templates/post/publish/post.html',
                    controller: 'PostController',
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
        .state('base.publish-look', {
            url: 'look/publish',
            views: {
                'content': {
                    templateUrl: 'templates/post/publish/look.html',
                    controller: 'PostController',
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
        .state('tabs', {
            url: '/tabs/',
            abstract: true,
            templateUrl: 'templates/tabs.html',
            controller: 'TabsController'
        })
        .state('tabs.login', {
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
        .state('tabs.login-email', {
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
        .state('tabs.timeline', {
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
        .state('tabs.explorer', {
            url: 'explorer',
            views: {
                'explorer': {
                    templateUrl: 'templates/explorer/main.html',
                    controller: 'ExplorerController'
                }
            }
        })
        .state('tabs.search', {
            url: 'search',
            views: {
                'search': {
                    templateUrl: 'templates/search/main.html',
                    controller: 'SearchController'
                }
            }
        })
        .state('tabs.search-detail', {
            url: 'search/detail/{type}/{query}',
            views: {
                'search': {
                    templateUrl: 'templates/search/detail.html',
                    controller: 'SearchController'
                }
            }
        })
        .state('tabs.user', {
            url: 'user',
            views: {
                'user': {
                    templateUrl: 'templates/user/profile/main.html',
                    controller: 'UserController',
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
        .state('base.user-setting', {
            url: 'user/setting',
            views: {
                'content': {
                    templateUrl: 'templates/user/setting/main.html',
                    controller: 'UserController'
                }
            }
        })
        .state('base.user-setting-password', {
            url: 'user/setting/password',
            views: {
                'content': {
                    templateUrl: 'templates/user/setting/password.html',
                    controller: 'UserController'
                }
            }
        })
        .state('base.user-setting-profile', {
            url: 'user/setting/profile',
            views: {
                'content': {
                    templateUrl: 'templates/user/setting/profile.html',
                    controller: 'UserController'
                }
            }
        })
        .state('base.user-setting-update', {
            url: 'user/setting/update',
            views: {
                'content': {
                    templateUrl: 'templates/user/setting/update.html',
                    controller: 'UserController'
                }
            }
        })
        .state('base.fashionist', {
            url: 'user/fashionist/{username}',
            views: {
                'content': {
                    templateUrl: 'templates/user/profile/main.html',
                    controller: 'UserController'
                }
            }
        })
        .state('base.post', {
            url: 'post/{content}/{username}/{postname}',
            views: {
                'content': {
                    templateUrl: 'templates/post/detail.html',
                    controller: 'PostController'
                }
            }
        })
        .state('base.followers', {
            url: 'user/followers/{username}',
            views: {
                'content': {
                    templateUrl: 'templates/user/followers.html',
                    controller: 'FollowersController'
                }
            }
        })
        .state('base.follows', {
            url: 'user/follows/{username}',
            views: {
                'content': {
                    templateUrl: 'templates/user/follows.html',
                    controller: 'FollowsController'
                }
            }
        })
        .state('base.follows-suggestions', {
            url: 'user/follows-suggestions',
            views: {
                'content': {
                    templateUrl: 'templates/user/follows.html',
                    controller: 'FollowsController'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tabs/timeline');
     $ionicConfigProvider.views.maxCache(0);

});
