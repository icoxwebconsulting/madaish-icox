app.directive('parseLinks', function($timeout, $state, UtilsService){
    var parseLink = function(a){

        var href = a.getAttribute('href');
        var link = UtilsService.parseUrl(href);

        if(!link) return;

        angular.element(a).on('click', function(e){

            e.preventDefault();

            if(link.type == 'external'){
                UtilsService.openExternalLink(href);
            }
            if(link.type == 'post'){
                $state.go('base.post', {
                    content: 'post',
                    username: link.username,
                    postname: link.postname
                });
            }
            if(link.type == 'look'){
                $state.go('base.post', {
                    content: 'look',
                    username: link.username,
                    postname: link.lookname
                });
            }
            if(link.type == 'unknown'){
                throw "clicked unknown link type: " + href;
            }

            return false;
        });
    };

    return {
        restrict: 'A',

        link: function(scope, element, attrs){

            $timeout(function(){
                angular.forEach(element.find('a'), parseLink);
            });
        }
    };
});