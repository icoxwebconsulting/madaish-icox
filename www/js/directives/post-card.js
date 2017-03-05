app.directive('postCard', function(){

    return {
        restrict: 'E',
        scope: {
            'type': '@',
            'data': '<'
        },
        controller: 'PostCardController',
        templateUrl: 'templates/post/card.html'
    };
});
