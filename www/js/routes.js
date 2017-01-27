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

        .state('base.timeline', {
            url: 'timeline',
            views: {
                'content': {
                    templateUrl: 'templates/timeline/main.html',
                    controller: 'TimelineController'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/timeline');
    $ionicConfigProvider.views.maxCache(0);

});
