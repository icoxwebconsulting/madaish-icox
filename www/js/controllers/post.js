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


    if($state.current.name == 'base.publish-post' || $state.current.name == 'base.publish-look')
    {
        $scope.initForm = function(){
            $scope.form = {};
            $scope.form.picture = null;
            $scope.form.videoUrl = null;
            $scope.form.videoThumbnail = null;
        };

        $scope.setPicture = function(source){

            if(!window.Camera){
                return alert("Función no disponible en este dispositivo");
            }

            var options = {
                quality: 90,
                destinationType: Camera.DestinationType.DATA_URL,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 750,
                targetHeight: 510
            };

            var cameraOptions = {
                sourceType: Camera.PictureSourceType.CAMERA,
                correctOrientation:true,
                saveToPhotoAlbum: true
            };

            var libraryOptions = {
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: Camera.MediaType.PICTURE
            };

            var extraOptions = (source == "camera") ? cameraOptions : libraryOptions;
            for(var o in extraOptions){
                options[o] = extraOptions[o];
            }

            navigator.camera.getPicture(function(imageBase64){
                $timeout(function(){
                    $scope.form.picture = 'data:image/jpeg;base64,' + imageBase64;
                });
            }, console.log, options);
        };

        $scope.removePicture = function(){
            $scope.form.picture = null;
            $scope.form.videoUrl = null;
            $scope.form.videoThumbnail = null;
        };

        $scope.searchVideo = function(){

            UtilsService.showAlert("Muy pronto!! (:");
        };

        self.publish = function(type, params){
            UtilsService.showSpinner();

            if(type == 'post')
            {

                if(!params.text && params.title){
                    params.text = params.title;
                    params.title = '';
                }


                if(params.image)
                {
                    params.image = params.image.replace(/data\:.+\;base64\,/, '');
                }

                var currentPost = new PostService.resource();
                currentPost.PostCategoryId = params.category;
                currentPost.title = params.title;
                currentPost.dataImage = params.image;
                currentPost.text = params.text;
                currentPost.category = params.category;
                currentPost.video = null;
                currentPost.bigVideoImage = null;
                currentPost.metadescription = '';
                currentPost.isDraft = false;
                currentPost.isFeatured= false;
                currentPost.isProtected = false;
                currentPost.isVideo = !!params.video;
                currentPost.lastParagraph = '';

                if(params.title)
                {
                    UtilsService.showSpinner();
                    currentPost.$new(function (response) {
                        UtilsService.hideSpinner();
                        $state.go('tabs.user');
                    }, function (error) {
                        UtilsService.hideSpinner();
                        UtilsService.showAlert('Error en conexion');
                        return false;
                    });
                }else{
                    UtilsService.showSpinner();
                    currentPost.$newFast(function (response) {
                        UtilsService.hideSpinner();
                        $state.go('tabs.user');
                    }, function (error) {
                        UtilsService.hideSpinner();
                        UtilsService.showAlert('Error en conexion');
                        return false;
                    });
                }


            }else{

                if(!params.description && params.title){
                    params.description = params.title;
                    params.title = '';
                }
                if(params.image)
                {
                    params.image = params.image.replace(/data\:.+\;base64\,/, '');
                }


                var currentPost = new PostService.resource();
                currentPost.text = params.description;
                currentPost.categoryId = 'Ibicenco';
                currentPost.LookCategoryId= 'Ibicenco';
                currentPost.image = null;
                currentPost.title = null;
                currentPost.description = null;
                currentPost.title = null;
                currentPost.isDraft= false;
                currentPost.isFeatured= false;
                currentPost.isWeekLook= false;
                currentPost.postUrl = null;
                currentPost.isScheduled= false;
                currentPost.publishDate= null;

                if(params.title)
                {
                    UtilsService.showSpinner();
                    currentPost.$newLook(function (response) {
                        UtilsService.hideSpinner();
                        $state.go('tabs.user');
                    }, function (error) {
                        UtilsService.hideSpinner();
                        UtilsService.showAlert('Error en conexion');
                        return false;
                    });
                }else{
                    UtilsService.showSpinner();
                    currentPost.$newLookFast(function (response) {
                        UtilsService.hideSpinner();
                        $state.go('tabs.user');
                    }, function (error) {
                        UtilsService.hideSpinner();
                        UtilsService.showAlert('Error en conexion');
                        return false;
                    });
                }

            }

        };

        $scope.publishPost = function(){

            if(!$scope.form.picture && !$scope.form.title && !$scope.form.text){
                return alert("Debes elegir una cabecera, o escribir algo de texto");
            }

            var params = {
                title: $scope.form.title,
                image: $scope.form.picture,
                text: $scope.form.text,
                category: $scope.form.category,
                video: $scope.form.videoUrl,
                bigVideoImage: $scope.form.videoThumbnail
            };

            self.publish('post', params);
        };

        $scope.publishLook = function(){

            if(!$scope.form.picture && !$scope.form.title && !$scope.form.description){
                return alert("Debes elegir una foto de portada para tu look y escribir una pequeña descripción");
            }

            var params = {
                image: $scope.form.picture,
                title: $scope.form.title,
                description: $scope.form.description
            };

            self.publish('look', params);
        };

        $scope.$on("$ionicView.enter", function(){
            $scope.initForm();
        });
    }



});