app.controller('TimelineController', function ($scope, PostService){

   $scope.loadPosts = function(){
      PostService.resource.getTimeline({page:$scope.page}).$promise.then(function(data){
         var posts = [];
         // TODO: esto debe cambiar, parsear el resultado en api no en la app.
         data.Items.forEach(function(card){
            posts.push({
               Profile: {
                  UserId: card.CreatorId,
                  UserName: card.CreatorUserName,
                  FriendlyUrlName: card.CreatorUserFriendlyUrlName,
                  Avatar: card.CreatorAvatar
               },
               Id: card.ContentId,
               ContentType: card.ContentType,
               Type: card.ContentCategory,
               Title: card.ContentTitle,
               FriendlyUrlTitle: card.ContentFriendlyUrlTitle,
               IntroText: card.ContentResume,
               Text: card.ContentFull,
               Image: card.ContentImage,
               LikesCount: card.LikesCount,
               PublishDate: card.PublishDate,
               IsFast: card.IsFast
            });
         });

         $scope.posts = $scope.posts.concat(posts);
         if(!data.ShowMore)
            $scope.page = null;

      }).finally(function(){
         $scope.$broadcast('scroll.infiniteScrollComplete');
      });
   };

   $scope.init = function(){
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