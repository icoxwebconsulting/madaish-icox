app.controller('PostController', function ($rootScope, $scope, $state, $stateParams, AuthService, UserService, SocialService, UtilsService, PostService) {

    self.loadPost = function(){
        if($stateParams.content == 'post')
        {
            PostService.resource.getPost({user:$stateParams.userName, post: $stateParams.postName}).$promise.then(function(data){
                $scope.post = data;
                $scope.comments = data.Comments;
            });
        }else{
            PostService.resource.getLook({user:$stateParams.userName, look: $stateParams.postName}).$promise.then(function(data){
                $scope.post = data;
                $scope.comments = data.Comments;
            });
        }
    };

    $scope.init = function(){
        $scope.type = $stateParams.content;
        $scope.comment = {};
        $scope.currentUserId = UserService.getUser().UserId;
        self.loadPost();
    };

    $rootScope.$on('comment:refresh', function(event, args) {
        $scope.loadPost();
    });

    $rootScope.$on('post:refresh', function(event, args) {
        self.loadPost();
    });

    $scope.checkNewComment = function(){
        if(typeof $scope.comment.new == 'undefined')
            return true;
        else{
            if($scope.comment.new.length < 1)
                return true;
            else
                return false;
        }
    };

    $scope.addComment = function(){
        UtilsService.showSpinner();

        var comment = new SocialService.resource();
        comment.text = $scope.comment.new;
        comment.friendlyTitle = $scope.post.FriendlyUrlTitle;
        comment.userContentName = $scope.post.Profile.UserName;
        comment.isLook = $scope.post.ContentType;

        comment.$createComment(function (response) {
            UtilsService.hideSpinner();
            $scope.comment.new = '';
            self.loadPost();
        }, function (error) {
            UtilsService.hideSpinner();
            $scope.comment.new = '';
        });
    };



    $scope.init();

});