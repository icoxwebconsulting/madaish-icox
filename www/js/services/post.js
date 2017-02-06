'use strict';
app.factory('PostService', function ($resource, API) {

    var resource = $resource(API.url, {}, {
        'getExplorer': {
            method: 'GET',
            isArray: false,
            url: API.url  + '/xplora/getxplora'
        }
    });

    return {
        resource: resource
    };
});