app.controller('BaseController', function ($scope, UtilsService) {

    $scope.goBack = function() {
        UtilsService.goBack();
    };


});