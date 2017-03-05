app.directive('userCard', function(){

    return {
        restrict: 'E',
        scope: {
            'label': '@',
            'widget': '@',
            'callback': '&',
            'data': '='
        },
        controller: 'UserCardController',
        templateUrl: 'templates/user/profile/detail.html'
    };

});
