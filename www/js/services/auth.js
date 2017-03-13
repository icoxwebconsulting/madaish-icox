app.factory('AuthService', function ($resource, API, $localStorage) {

    var resource = $resource(API.url, {}, {
        'login': {
            method: 'POST',
            isArray: false,
            url: API.url  + 'Account/login'
        },
        'recoverPassword': {
            method: 'POST',
            isArray: false,
            url: API.url  + 'Account/recoverpassword'
        },
        'facebookSignIn': {
            method: 'GET',
            isArray: false,
            url: API.url  + 'Account/fblogin'
        }

    });


    return {
        resource: resource
    };
});