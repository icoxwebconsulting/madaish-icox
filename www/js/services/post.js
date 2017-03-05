'use strict';
app.factory('PostService', function ($resource, API, UserService) {

    var resource = $resource(API.url, {}, {
        'getTimeline': {
            method: 'GET',
            isArray: false,
            headers: { 'token': UserService.getUser().Token || null },
            url: API.url  + 'social/gettimeline'

        },
        'getExplorer': {
            method: 'GET',
            isArray: false,
            url: API.url  + 'xplora/getxplora'
        },
        'setLike': {
            method: 'POST',
            isArray: false,
            url: API.url  + 'likes/like'
        },
        'search': {
            method: 'GET',
            isArray: false,
            url: API.url  + 'Search/search'
        }
    });

    return {
        resource: resource
    };
});