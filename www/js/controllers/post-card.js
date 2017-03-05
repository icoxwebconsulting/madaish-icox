app.controller('PostCardController', function ($scope, $state, $timeout, GLOBAL, UtilsService, UserService, PostService) {

    var post = $scope.data;
    var user = $scope.data.Profile;
    var waitForDoubleClick = null;
    var currentUser = UserService.getUser;

    $scope.getImageUrl = function(image){
        return UtilsService.getImageUrl(image);
    };

    $scope.showPost = function(){

        if($scope.content) return;

        var delay = ($scope.data.isLiked || !$scope.data.Image) ? 0 : 300;

        waitForDoubleClick = $timeout(function(){

            waitForDoubleClick = null;

            $state.go('root.view.post', {
                content: (post.ContentType == 1) ? 'look' : 'post',
                userName: post.Profile.FriendlyUrlUserName,
                postName: post.FriendlyUrlTitle
            });
        }, delay);
    };

    $scope.doubleClick = function($event){

        if($scope.data.isLiked) return;

        if($timeout.cancel(waitForDoubleClick)){
            $scope.like();
            $event.stopPropagation();
        }
    };

    $scope.like = function(){
        if($scope.data.isLiked) return;

        if(UserService.isLogged())
        {
            var currentPost = new PostService.resource();
            currentPost.type = (post.ContentType == 1) ? 'Look' : 'Post';
            currentPost.id = post.Id;

            return currentPost.$setLike(function (response) {
                return response;
            }, function (error) {
                UtilsService.hideSpinner();
                UtilsService.showAlert('Error en conexion');
                return false;
            });
        }else{
            UtilsService.showAlert('Por favor inicie sesion para dar me gusta');
        }


    };

    $scope.delete = function(){
        if(confirm("Eliminar esta publicación. ¿Está seguro?")){
            var endpoint = (post.ContentType == 1) ? apiService.deleteLook : apiService.deletePost;
            var request = endpoint(post.Id).then(function(){
                userService.checkCurrentUser().then(function(currentUser){
                    apiService.getUser(currentUser.FriendlyUrlUserName, true);
                    $scope.$root.$emit('profile.update');
                    $state.go('root.tabs.profile');
                });
            });
            utilsService.showSpinner(true, request);
        }
    };

    switch($scope.type){
        case 'post':
            $scope.subtitle = post.Type;
            $scope.content = post.Text;
            $scope.video = post.Video;
            $scope.widget = 'follow';
            break;
        case 'look':
            $scope.subtitle = post.Category.Name;
            $scope.content = post.Text || post.Description;
            $scope.widget = 'follow';
            break;
        default:
            if(!post.Image && post.Text){
                $scope.data.Image = (post.Text.match(/\<img\s+src\s*\=\s*\"([^\"]+)\"/i) || [])[1];
            }
            $scope.subtitle = UtilsService.filter('amTimeAgo', post.PublishDate);
            $scope.content = '';
            $scope.widget = '';
    }

    if(user != null)
    {
        if(currentUser.FriendlyUrlUserName == user.FriendlyUrlUserName){
            $scope.widget = 'ion-trash-b';
            $scope.callback = $scope.delete;
        }
    }



    // userService.checkLike(post.Id).then(function(liked){
    //     if(!liked) return $q.reject();
    //     $scope.data.isLiked = true;
    // }).catch(function(){
    //     $scope.$root.$on('liked_' + post.Id, function(){
    //         $scope.data.LikesCount++;
    //         $scope.data.isLiked = true;
    //     });
    // });

});