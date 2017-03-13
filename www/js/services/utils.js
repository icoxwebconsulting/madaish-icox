app.service('UtilsService', function($window, $q, $timeout, $ionicLoading, $ionicPopup, $filter, $ionicHistory, $state, API){

    var service = this;

    this.showSpinner = function(message){

        if(typeof message === "undefined")
            message = 'Cargando...';

        $ionicLoading.show({
            template: message
        });
    };

    this.hideSpinner = function(){
        $ionicLoading.hide();
    };

    this.showAlert = function(message){
        $ionicPopup.alert({
            title: message
        });
    };

    this.filter = function(filterName, input, params){

        var args = [input].concat(params || []);
        return $filter(filterName).apply(input, args);
    };

    this.parseUrl = function(url){

        if(!url) return null;

        var parsed = document.createElement('a');
        parsed.href = url;

        var external = /^(https?:)?\/\//i;
        var resource = /(.+)\/(.+)\.(.+)$/i;
        var post = /^\/(.+)\/(.+)$/;
        var look = /^\/(.+)\/looks\/(.+)$/i;

        if(url.match(external)){
            return {
                type: 'external',
                protocol: parsed.protocol,
                hostname: parsed.hostname,
                port: parsed.port,
                pathname: parsed.pathname,
                search: parsed.search,
                hash: parsed.hash
            };
        }
        if(match = parsed.pathname.match(resource)){
            return {
                type: 'resource',
                path: match[1],
                filename: match[2],
                extension: match[3]
            };
        }
        if(match = parsed.pathname.match(post)){
            return {
                type: 'post',
                username: match[1],
                postname: match[2]
            };
        }
        if(match = parsed.pathname.match(look)){
            return {
                type: 'look',
                username: match[1],
                lookname: match[2]
            };
        }

        return {
            type: 'unknown'
        };
    };

    this.getImageUrl = function(image, defaultSrc){

        if(!image) return defaultSrc;

        if(service.parseUrl(image).type == 'external'){
            return image;
        }

        return API.image.user.path + image;
    };

    this.openExternalLink = function(url){

        return window.open(url, '_system');
    };

    this.goBack = function(){
        if(service.lastState)
            $state.go(service.lastState);
        else
            service.restart();
    };

    this.lastState = null;

    this.setLastState = function(state){
        service.lastState = state;
    };

    this.restart = function(){
        $state.go('tabs.timeline');
    };
});
