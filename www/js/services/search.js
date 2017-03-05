app.factory('SearchService', function ($resource, API, $localStorage) {

    var resource = $resource(API.url, {}, {
        'get': {
            method: 'GET',
            isArray: false,
            url: API.url  + 'Search/search'
        }

    });


    return {
        resource: resource
    };
});