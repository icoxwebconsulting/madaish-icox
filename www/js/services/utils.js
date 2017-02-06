app.service('UtilsService', function($window, $q, $timeout, $ionicLoading, $filter, $ionicHistory, $state, API){

    var service = this;

    this.NO_DELAY = 0;
    this.FEEDBACK_DELAY = 1000;

    var spinnerRequests = 0;
    var syncSpinner = $q.defer();

    this.showSpinner = function(when, until){

        var show = $q.defer();

        var start = ((typeof when == 'number') ? $timeout(when) : $q.resolve(when));
        var stop = until ? $q.resolve(until) : syncSpinner.promise;

        start.then(show.resolve);
        stop.finally(show.reject);

        show.promise.then(function(){
            ++spinnerRequests;
            $ionicLoading.show({
                template: 'Cargando...'
            });
            stop.finally(function(){
                if(!--spinnerRequests){
                    $ionicLoading.hide();
                }
            });
        });
    };

    this.hideSpinner = function(){
        syncSpinner.resolve();
        syncSpinner = $q.defer();
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

        service.showSpinner();

        if($state.current.name == 'root.view.followers' || $state.current.name == 'root.view.follows')
        {
            $state.go(service.lastState);
            service.hideSpinner();
        }else{
            if($ionicHistory.backView()){
                $ionicHistory.goBack();
            }else{
                $state.go('root.dispatcher');
            }
            service.hideSpinner();
        }

    };

    this.lastState = null;

    this.setLastView = function(state){
        service.lastState = state;
    };

    this.restart = function(){
        $state.go('root.tabs.timeline');
    };
});
