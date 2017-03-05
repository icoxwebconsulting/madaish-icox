app.controller('ExplorerController', function ($scope, GLOBAL, PostService) {

    $scope.loadPosts = function(){
        PostService.resource.getExplorer({page:$scope.page}).$promise.then(function(data){
            if(data.Posts)
                $scope.posts = $scope.posts.concat(data.Posts);
            if(data.Looks)
                $scope.posts = $scope.posts.concat(data.Looks);

            if(!data.Posts && !data.Looks)
                $scope.page = null;

        }).finally(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.init = function(){
        $scope.categories = GLOBAL.categories;
        $scope.posts = [];
        $scope.page = 1;
        $scope.loadPosts();
    };

    $scope.init();

    $scope.loadMore = function(){
        $scope.page++;
        $scope.loadPosts();
    };

});