app.controller('PostCardController', function ($scope, $state, $timeout, GLOBAL, UtilsService, UserService, PostService, $ionicPopup) {


    $scope.delete = function () {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Eliminar Publicación',
            template: '¿estas seguro que desea eliminar esta publicación?'
        });

        confirmPopup.then(function (response) {
            if (response) {
                UtilsService.showSpinner();

                var post = new PostService.resource();
                if( self.post.ContentType == 1)
                {
                    return post.$deleteLook({id: self.post.Id},function (response) {
                        $scope.$emit('post:refresh', true);
                        UtilsService.hideSpinner();
                        return response;
                    }, function (error) {
                        UtilsService.hideSpinner();
                        UtilsService.showAlert('Error en conexion');
                        return false;
                    });
                }else{
                    return post.$deletePost({id: self.post.Id},function (response) {
                        $scope.$emit('post:refresh', true);
                        UtilsService.hideSpinner();
                        return response;
                    }, function (error) {
                        UtilsService.hideSpinner();
                        UtilsService.showAlert('Error en conexion');
                        return false;
                    });
                }
            }
        });
    };

    $scope.init = function(){
        self.post = $scope.data;
        self.user = $scope.data.Profile;
        self.waitForDoubleClick = null;
        self.currentUser = UserService.getUser();


        switch($scope.type){
            case 'post':
                $scope.subtitle = self.post.Type;
                $scope.content = self.post.Text;
                $scope.video = self.post.Video;
                $scope.widget = 'follow';
                break;
            case 'look':
                $scope.subtitle = self.post.Category.Name;
                $scope.content = self.post.Text || post.Description;
                $scope.widget = 'follow';
                break;
            default:
                if(!self.post.Image && self.post.Text){
                    $scope.data.Image = (self.post.Text.match(/\<img\s+src\s*\=\s*\"([^\"]+)\"/i) || [])[1];
                }
                $scope.subtitle = UtilsService.filter('amTimeAgo', self.post.PublishDate);
        }

        if(self.currentUser.Id == self.user.UserId){
            $scope.widget = 'ion-trash-b';
            $scope.callback = $scope.delete;
        }
    };

    $scope.init();


    $scope.getImageUrl = function(image){
        return UtilsService.getImageUrl(image);
    };

    $scope.showPost = function(){

        if($scope.content) return;

        var delay = ($scope.data.isLiked || !$scope.data.Image) ? 0 : 300;

        self.waitForDoubleClick = $timeout(function(){

            self.waitForDoubleClick = null;

            $state.go('base.post', {
                content: (self.post.ContentType == 1) ? 'look' : 'post',
                userName: self.post.Profile.FriendlyUrlUserName,
                postName: self.post.FriendlyUrlTitle
            });
        }, delay);
    };

    $scope.doubleClick = function($event){

        if($scope.data.isLiked) return;

        if($timeout.cancel(self.waitForDoubleClick)){
            $scope.like();
            $event.stopPropagation();
        }
    };

    $scope.like = function(){
        if($scope.data.isLiked) return;

        if(UserService.isLogged())
        {
            var currentPost = new PostService.resource();
            currentPost.type = (self.post.ContentType == 1) ? 'Look' : 'Post';
            currentPost.id = self.post.Id;

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