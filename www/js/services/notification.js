app.factory('NotificationService', function ($resource, API, $localStorage) {

    var resource = $resource(API.url, {}, {
        'createDevice': {
            method: 'POST',
            isArray: false,
            url: API.url  + 'Notification/SaveDevice'
        },
        'deleteDevice': {
            method: 'POST',
            isArray: false,
            url: API.url  + 'Notification/RemoveDevice'
        }

    });


    return {
        resource: resource
    };
});