app.controller('ExplorerController', function ($scope, GLOBAL, PostService) {

    $scope.init = function(){
        $scope.categories = GLOBAL.categories;
        $scope.posts = [];

        PostService.resource.getExplorer().$promise.then(function(data){
            console.info('posts', data.Posts);
        });
    };

    $scope.init();

});