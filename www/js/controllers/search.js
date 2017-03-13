app.controller('SearchController', function ($scope, $state, $stateParams, PostService, UtilsService) {

    if ($state.current.name == 'tabs.search') {

        $scope.init = function(){
            $scope.message = 'Descubre fashionistas como tú y encuentra contenidos muy molones de moda, belleza y lifestyle.';
            $scope.form = {
                query: ''
            };

            $scope.results = [{
                title: 'Fashionistas',
                type: 2,
                count: 0
            },{
                title: 'Looks',
                type: 1,
                count: 0
            },{
                title: 'Posts',
                type: 0,
                count: 0
            }];
        };

        $scope.init();


        self.showMessage = function(message){

            $scope.message = message;
            for(var i = 0; i < $scope.results.length; i++){
                $scope.results[i].count = 0;
            }
        };

        $scope.search = function(){
            UtilsService.showSpinner();


            if($scope.form.query.length < 3)
                return self.showMessage('Prueba con un texto más largo');
            else
                self.showMessage('');

            $scope.query = $scope.form.query;
            var totalCount = 0;

            // TODO: endpoint retorne tipo de busqueda

            PostService.resource.search({Type:2, searchTerm: $scope.query}).$promise.then(function(data){
                totalCount += data.TotalCount;
                $scope.results[0].count = data.TotalCount;
            });

            PostService.resource.search({Type:1, searchTerm: $scope.query}).$promise.then(function(data){
                totalCount += data.TotalCount;
                $scope.results[1].count = data.TotalCount;
            });

            PostService.resource.search({Type:0, searchTerm: $scope.query}).$promise.then(function(data){
                totalCount += data.TotalCount;
                $scope.results[2].count = data.TotalCount;
                UtilsService.hideSpinner();
            });


        };
    }


    if ($state.current.name == 'tabs.search-detail') {
        var type = $stateParams.type;

        $scope.page = 0;
        $scope.posts = [];

        self.addPosts = function(posts){

            $scope.posts = $scope.posts.concat(posts);
        };

        $scope.loadPosts = function(){
            PostService.resource.search({Type: type, searchTerm: $stateParams.query, page: $scope.page}).$promise.then(function(data){
                if(data.Results.length > 0)
                    $scope.posts = $scope.posts.concat(data.Results);
                else
                    $scope.page = null;

            }).finally(function(){
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };


        $scope.getImageUrl = function(image){
            return UtilsService.getImageUrl(image);
        };

        $scope.showDetail = function(post){

            if(type == 2){
                $state.go('base.fashionist', {username: post.FriendlyUrlUserName});
            }else{
                $state.go('base.post', {
                    content: (type == 0) ? 'post' : 'look',
                    username: post.FriendlyUrlUserName,
                    postname: post.FriendlyUrlTitle
                });
            }
        };

        $scope.loadMore = function(){
            $scope.page++;
            $scope.loadPosts();
        };

        $scope.loadMore();

    }





});