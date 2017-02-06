app.controller('TimelineController', function ($scope) {

   $scope.init = function(){
      $scope.page = 1;
      $scope.posts = [];
   };

   var addPosts = function(cards){

      $scope.cards = $scope.cards.concat(cards);
   };

   $scope.reload = function(){

      $scope.page = 0;
      apiService.getTimeline(true).then(function(){
         $scope.page = 1;
         $scope.cards = [];
         $ionicScrollDelegate.resize();
      }).finally(function(){
         $scope.$broadcast('scroll.refreshComplete');
      });
   };

   $scope.nextPage = function(prefetch){

      apiService.getTimeline(false, $scope.page).then(function(cards){

         if(!cards.length) return $scope.page = 0;

         if(!prefetch){
            addCards(cards);
            $scope.page++;
            $scope.nextPage(true);
            $scope.$broadcast('scroll.infiniteScrollComplete');
         }
      });
   };

});