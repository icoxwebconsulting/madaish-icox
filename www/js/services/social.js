app.factory('SocialService', function ($resource, API, $localStorage, UserService) {

    var resource = $resource(API.url, {}, {
        'like': {
            method: 'POST',
            isArray: false,
            headers: { 'token': UserService.getUser().Token || null },
            url: API.url  + 'Likes/Like'
        },
        'disLike': {
            method: 'POST',
            isArray: false,
            headers: { 'token': UserService.getUser().Token || null },
            url: API.url  + 'Likes/RemoveLike'
        },
        'follow': {
            method: 'POST',
            isArray: false,
            headers: { 'token': UserService.getUser().Token || null },
            url: API.url  + 'social/follow'
        },
        'unfollow': {
            method: 'POST',
            isArray: false,
            headers: { 'token': UserService.getUser().Token || null },
            url: API.url  + 'social/unfollow'
        },
        'getFollowed': {
            method: 'GET',
            isArray: false,
            url: API.url  + 'social/getfollowed'
        },
        'getFollowers': {
            method: 'GET',
            isArray: false,
            url: API.url  + 'social/getfollowers'
        },
        'postFollowSuggestions': {
            method: 'POST',
            isArray: true,
            url: API.url  + 'social/FollowDefaultSuggestion'
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
