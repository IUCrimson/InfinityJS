(function(container) {
    // Create application module.
    var app = angular.module("constituentViewer", ["infinityjs.services"]);

    app.controller("constituentViewerController", function($scope, DataList, Navigation) {
        var allConstituents = [];
        $scope.visibleConstituents = [];

        DataList.loadAsObjects("b080d40b-5ace-4f58-a45e-3d5d6a371883").then(function (result) {
            // result is:
            // [
            //  { 
            //      CONSTITUENTID: '',
            //      NAME: '',
            //      PICTURE: ''
            //  },
            //  ...
            // ]
            allConstituents = result;
            $scope.refresh();
        });

        $scope.refresh = function() {
            $scope.visibleConstituents = _.sample(allConstituents, 12);
        };

        $scope.gotoConstituentPage = function (constituentId) {
            Navigation.goToPage("88159265-2b7e-4c7b-82a2-119d01ecd40f", null, constituentId);
        };
    });

    // Manually bootstrap the Angular app.  Necessary because this script
    // is dynamically loaded and we can't bootstrap until everything has
    // been loaded into the CRM page.
    angular.element(document).ready(function() {
        angular.bootstrap("#constituentViewer", ["constituentViewer"]);
    });
}());
