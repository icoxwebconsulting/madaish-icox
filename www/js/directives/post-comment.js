app.directive('postComment', function (utilsService, SocialService, $ionicPopup) {
    return {
        restrict: 'E',
        scope: {
            comment: '=',
            owner: '=',
            user: '='
        },
        template: '<ion-item class="ion-comment item">\
					<div class="ion-comment--author">{{comment.UserProfile.UserName}}:</div>\
					<div class="ion-comment--score"><span class="ion-close-round" ng-if="isDeletable()" ng-click="delete()"></span><span class="ion-flag" ng-if="isReportable() && !isDeletable()" ng-click="report()"></span></div>\
					<div class="ion-comment--text">{{comment.Text}}</div>\
				</ion-item>',
        controller: function ($scope) {
            $scope.newData = {};

            //Used to mark the post author to stand out in the comments
            $scope.isDeletable = function () {
                if($scope.owner == $scope.user){
                    return true;
                }else{
                    if($scope.user == $scope.comment.UserProfile.Id)
                        return true;
                    else
                        return false;
                }
            };

            $scope.isReportable = function () {
                if($scope.user == $scope.comment.UserProfile.Id) {
                    return false;
                } else {
                    if($scope.comment.isReported == true) {
                        return false;
                    } else
                        return true

                }
            };

            $scope.delete = function () {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Eliminar comentario',
                    template: '¿estas seguro que desea eliminar este comentario?'
                });

                confirmPopup.then(function (response) {
                    if (response) {
                        utilsService.showSpinner();

                        var comment = new SocialService.resource();
                        comment.commentId = $scope.comment.Id;
                        comment.$deleteComment(function (response) {
                            $scope.$emit('comment:refresh', true);
                            UtilsService.hideSpinner();
                        },function (error) {
                            UtilsService.hideSpinner();
                        });
                    }
                });
            };

            $scope.report = function () {
                $ionicPopup.show({
                    template: '<input type="text" ng-model="newData.report">',
                    title: 'Reportar comentario',
                    subTitle: 'Explique el motivo',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Enviar</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.newData.report) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    var comment = new SocialService.resource();
                                    comment.commentId = $scope.comment.Id;
                                    comment.motive = $scope.newData.report;

                                    comment.$reportComment(function (response) {
                                        $scope.$emit('comment:refresh', true);
                                        UtilsService.hideSpinner();
                                    },function (error) {
                                        UtilsService.hideSpinner();
                                    });
                                }
                            }
                        }
                    ]
                });
            };
        }
    };
});