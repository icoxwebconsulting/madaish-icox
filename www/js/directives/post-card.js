app.directive('postCard', function(){

    return {
        restrict: 'E',
        scope: {
            'type': '@',
            'data': '<'
        },
        controller: 'postCardController',
        templateUrl: 'post/card.html'
    };
});
