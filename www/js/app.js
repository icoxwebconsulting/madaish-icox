var app = angular.module('madaish', [
    'ionic',
    'ionic.cloud',
    'ngResource',
    'ngStorage',
    'angularMoment'
]);

app.run(function($rootScope, $ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
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

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        console.info('catch error');
        switch(error) {
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