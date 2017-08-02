var scApp = angular.module('scApp', ['ui.router','ui.bootstrap','ngAnimate']);

scApp.service("scCollection",SCCollection);

scApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        .state('home', {
            url: '/home',
            templateUrl: 'app/sct/home.pane.html'
        })
});

scApp.run(function($rootScope,$state,$location,scCollection){

    var that = this;

    $rootScope.$on('$stateChangeStart',

        function(e, toState, toParams, fromState, fromParams) {

            if(toState.name=='home')scApp.value("IsHomePage",true);
            else scApp.value("IsHomePage",false);
        }
    );

});

//ShowCase Model

scApp.directive("homePane",homePaneDir);

function homePaneDir() {
    return {
        restrict: "A",
        transclude: true,
        template:'<ng-transclude></ng-transclude>',
        controller: homePaneCtrl,
        controllerAs: "hpc"
    };
}

scApp.controller("homePaneCtrl",['$scope','scCollection',homePaneCtrl]);

function homePaneCtrl($scope,scCollection){

    var hpc = this;

    this.scope = $scope;

    this.scColl = scCollection;

    hpc.domain = rea_domain;

    hpc.propertyDetails = [];

    hpc.info = [];

    var that = this;

   this.scColl.GetInfo(function(info) {

       this.info = info;

       this.scope.$apply();

   },this);

    this.scColl.GetListingFullDetails(function(details) {

        this.propertyDetails = details;

        this.scope.$apply();

    },this);
}

scApp.controller('DisplayDetailsDlg',DisplayDetailsDlg);

function DisplayDetailsDlg($scope, $uibModalInstance, data) {

    $scope.property = data.property;

    this.center = new google.maps.LatLng(data.property.lat, data.property.lng);

    this.poiNames = ['Restaurants','Day Care','Pre Schools','Elementary Schools','High Schools','train stations'];

    var mapOptions = {

        center: this.center,
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }

    this.map = null;

    this.marker = null;

    this.poiMarkers = [];

    this.streetViewPanorama = null;

    var that = this;

    $uibModalInstance.rendered.then(function(){

        that.map = new google.maps.Map(document.getElementById('rea_property_details_map'),mapOptions);

        that.marker = new google.maps.Marker({
            position: that.center,
            map: that.map,
            icon: new google.maps.MarkerImage('images/home_b.png', null, null, new google.maps.Point(2, 3)),
            zIndex: 200
        });
    });

    $scope.ok = function () {

        $uibModalInstance.close('ok');
    };

    $scope.getproperty = function(dir) {
        console.log("in get property")

        if(data.getproperty) {

            data.getproperty.call(data.context,dir,function(property) {

                if (property) {

                    $scope.property = property;

                    $scope.$apply();
                }
            });
        }
    }

    $scope.showstreetview = function() {

        if(that.streetViewPanorama) {

            that.streetViewPanorama.setVisible(true);

            return;
        }

        var service = new google.maps.StreetViewService();

        service.getPanoramaByLocation(that.center, 200, function(result, status) {

            if (status == google.maps.StreetViewStatus.OK) {

                that.streetViewPanorama = that.map.getStreetView();

                that.streetViewPanorama.setPosition(result.location.latLng);

                that.streetViewPanorama.setVisible(true);

                /* google.maps.event.addListener(that.streetViewPanorama, 'visible_changed', function() {

                 that.streetViewPanorama.setVisible(false);
                 });*/
            }
        });
    };

    $scope.showpoi = function() {

        if(that.streetViewPanorama)that.streetViewPanorama.setVisible(false);

        that.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);

        that.map.setZoom(13);

        var iconSize = 32;

        if(rea_util.IsEmptyObject(that.poiSets)) {

            var request = {

                bounds:that.map.getBounds(),
                query:''
            };

            console.log(' request bounds '+request.bounds.toString());

            for(var i=0;i<that.poiNames.length;i++) {

                (function(index) {

                    var name = that.poiNames[index].toLowerCase();

                    request.query = name;

                    var service = new google.maps.places.PlacesService(that.map);

                    service.textSearch(request,function(places,status) {

                        if (status == google.maps.places.PlacesServiceStatus.OK) {

                            places.forEach(function(place) {

                                that.poiMarkers.push(new POIMarker(that,that.map,place,place.icon,true,500,iconSize));
                            });
                        }
                    });

                }(i));
            }
        }
    }

    $scope.showaerial = function() {

        if(that.streetViewPanorama)that.streetViewPanorama.setVisible(false);

        that.map.setMapTypeId(google.maps.MapTypeId.HYBRID);

        that.map.setZoom(20);
    }

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
}







