var theme = angular.module("themeMod", []);

theme.directive("themeHeader",themeHeaderDir);

theme.value("showMiniBanner", false);
theme.value("noBanner", false);
theme.value("noFooter", false);

function themeHeaderDir() {
    return {
        restrict: "E",
        scope:{},
        templateUrl:'theme/header.tpl.html',
        controller: headerCtrl
    }
}

function headerCtrl($scope, theme) {

    // Watching for banner values and update the header state
    $scope.$watch(function() {
        return theme.getMiniBanner();
    }, function(newValue, oldValue) {
        $scope.showMiniBanner = newValue;
    });

    $scope.$watch(function() {
        return theme.getBanner();
    }, function(newValue, oldValue) {
        //console.log("No Banner" + newValue);
        $scope.noBanner = newValue;
    });

}

theme.service("theme", function(showMiniBanner, noBanner, noFooter) {

    this.showMiniBanner = function() {
        showMiniBanner = true;
        noBanner = false;
    }

    this.showBigBanner = function() {
        showMiniBanner = false;
        noBanner = false;
    }

    this.hideFooter = function() {
        noFooter = true;
    }
    this.showFooter = function() {
        noFooter = false;
    }
    this.getFooter = function() {
        return noFooter;
    }

    this.getMiniBanner = function() {
        return showMiniBanner;
    }

    this.getBanner = function() {
        return noBanner;
    }

    this.hideBanner = function() {
        noBanner = true;
    }
});



theme.directive("themeFooter",themeFooterDir);

function themeFooterDir() {
    return {
        restrict: "E",
        scope:{},
        templateUrl:'theme/footer.tpl.html',
        controller: footerCtrl
    }
}

function footerCtrl($scope, theme) {

    $scope.$watch(function() {
        return theme.getFooter();
    }, function(newValue, oldValue) {
        $scope.noFooter = newValue;
    });

}
