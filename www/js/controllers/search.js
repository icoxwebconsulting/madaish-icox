app.controller('SearchController', function ($scope, GLOBAL, PostService, UtilsService) {

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
        for(var i = 0; i < $scope.results.length; i++){
            self.index = i;
            PostService.resource.getExplorer({Type:$scope.results[self.index].type, searchTerm: $scope.query}).$promise.then(function(data){
                totalCount += data.TotalCount;
                $scope.results[self.index].count = data.TotalCount;
            });
        }

        

    };

});