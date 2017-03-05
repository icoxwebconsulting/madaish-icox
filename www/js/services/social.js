app.factory('SocialService', function ($resource, API, $localStorage) {

    var resource = $resource(API.url, {}, {
        'follow': {
            method: 'POST',
            isArray: false,
            url: API.url  + 'social/follow'
        },
        'unfollow': {
            method: 'POST',
            isArray: false,
            url: API.url  + 'social/unfollow'
        },
        'getfollowed': {
            method: 'GET',
            isArray: false,
            url: API.url  + 'social/getfollowed'
        },
        'createComment': {
            method: 'POST',
            isArray: false,
            url: API.url  + 'MyComment/Create'
        },
        'reportComment': {
            method: 'POST',
            isArray: false,
            url: API.url  + 'MyComment/Report'
        },
        'deleteComment': {
            method: 'POST',
            isArray: false,
            url: API.url  + 'MyComment/Delete'
        }

    });


    return {
        resource: resource
    };
});