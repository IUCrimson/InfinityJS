(function (container) {
    // Create application module.
    var app = angular.module("helloCrmApp", []);

    app.controller('helloCrmController', function ($scope) {
        $scope.message = 'Hello, CRM.';

        $scope.sayHello = function() {
            alert('Hello');
        };
    });

    // Manually bootstrap the Angular app.  Necessary because this script
    // is dynamically loaded and we can't bootstrap until everything has
    // been loaded into the CRM page.
    angular.element(document).ready(function () {
        angular.bootstrap('#helloCrmApp', ['helloCrmApp']);
    });
}());
