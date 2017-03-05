var app = angular.module('madaish', [
    'ionic',
    'ionic.cloud',
    'ngResource',
    'ngStorage',
    'angularMoment'
]);

app.run(function ($rootScope, $ionicPlatform, $state) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        $rootScope.$on('cloud:push:notification', function (event, data) {
            console.info('notification', data);
            var notification = data.message;

            if (typeof notification.payload != "undefined") {
                var payload = notification.payload;

                if (typeof payload.type != "undefined") {
                    switch (payload.type) {
                        case 0:
                            $state.go('base.post', {
                                content: (payload.post_type == 1) ? 'post' : 'look',
                                userName: payload.username,
                                postName: payload.post_name
                            });
                            break;
                        case 1:
                            $state.go('base.fashionist', {
                                userName: payload.username
                            });
                            break;
                    }
                }

            }

        });

        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            console.info('catch error');
            switch (error) {
                case "not-logged":
                    event.preventDefault();
                    $state.go("base.login");
                    break;
                case "logged":
                    event.preventDefault();
                    $state.go("base.timeline");
                    break;
            }

        });


    });
});