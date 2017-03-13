'use strict';
app.factory('PostService', function ($resource, API, UserService) {

    var resource = $resource(API.url, {}, {
        'getPost':{
            method: 'GET',
            isArray: false,
            url: API.url + 'posts/getpost'
        },
        'new':{
            method: 'POST',
            isArray: false,
            headers: { 'token': UserService.getUser().Token || null },
            url: API.url + 'mypost/create'
        },
        'newFast':{
            method: 'POST',
            isArray: false,
            headers: { 'token': UserService.getUser().Token || null },
            url: API.url + 'mypost/createFast'
        },
        'getLook':{
            method: 'GET',
            isArray: false,
            url: API.url + 'looks/getlook'
        },
        'newLook':{
            method: 'POST',
            isArray: false,
            headers: { 'token': UserService.getUser().Token || null },
            url: API.url + 'mylook/create'
        },
        'newLookFast':{
            method: 'POST',
            isArray: false,
            headers: { 'token': UserService.getUser().Token || null },
            url: API.url + 'mylook/createFast'
        },
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
        },
        'deletePost':{
            method: 'POST',
            isArray: false,
            headers: { 'token': UserService.getUser().Token || null },
            url: API.url + 'mypost/delete/:id'
        },
        'deleteLook':{
            method: 'POST',
            isArray: false,
            headers: { 'token': UserService.getUser().Token || null },
            url: API.url + 'mylook/delete/:id'
        }
    });

    return {
        resource: resource
    };
});