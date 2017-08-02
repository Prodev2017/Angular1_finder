var mod = angular.module("listingDetailsMod", ['globalServicesMod', 'ui.router', 'ngSanitize', 'ngAnimate', 'ui.bootstrap']);


mod.directive("listingDetailsPage", listingDetailsDir);

function listingDetailsDir() {
    return {
        restrict: "E",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        controller: listingDetailsCtrl,
        controllerAs: 'ldt'
    }
}

mod.controller("listingDetailsCtrl", ['$scope', '$stateParams', '$uibModal', '$timeout', 'userDataCollection', 'featuredPropertiesCollection','Fullscreen', listingDetailsCtrl]);

function listingDetailsCtrl($scope, $stateParams, $uibModal, $timeout, userDataCollection, featuredPropertiesCollection, Fullscreen) {

    var ldt = this;

    ldt.uDataColl = userDataCollection;

    ldt.modal = $uibModal;

    this.marker = null;

    this.streetViewPanorama = null;

    this.poiNames = ['Restaurants','Day Care','Pre Schools','Elementary Schools','High Schools','train stations'];

    this.poiMarkers = [];

    $scope.property = $stateParams.property;

    this.center = new google.maps.LatLng($scope.property.lat, $scope.property.lng);

    var mapOptions = {
        center: this.center,
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }

    var that = this;

    $timeout(function () {

        that.map = new google.maps.Map(document.getElementById('rea_property_details_map'), mapOptions);

        that.marker = new google.maps.Marker({
            position: this.center,
            map: this.map,
            icon: new google.maps.MarkerImage('images/home_b.png', null, null, new google.maps.Point(2, 3)),
            zIndex: 200
        });
		
		this.popupMapUrl();

    }, 1000);

    ldt.expandPhotos = function (data, condition) {
        console.log(condition);
		if (condition) {
			
            var dialogInst = ldt.modal.open({
                templateUrl: 'listingdetailspage/photoview.dlg.html',
                controller: 'PhotoViewDlg',
                animation: true,
                size: 'lg',
                windowClass: 'modal-transparent',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });
        } else {
            /*--  Browser Fullscreen  --*/
            /* Fullscreen.all(); */
            var dialogInst = ldt.modal.open({
                templateUrl: 'listingdetailspage/mapview.dlg.html',
                controller: 'MapViewDlg',
                animation: false,
                size: 'lg',
                windowClass: 'modal-transparent map-view-popup',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });
        }
    }
	
	popupMapUrl = function(){
		console.log("poup mapp");
		 $timeout(function () {
			var centerpnt= new google.maps.LatLng(49.2827,-123.1207);

			var mapOptions = {
				center: centerpnt,
				zoom: 12,
				scrollwheel: false,
				navigationControl: false,
				mapTypeControl: false,
				scaleControl: false,
				zoomControl:false,
				draggable: false,
				streetViewControl:false,
				styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
			}
			
			new google.maps.Map(document.getElementById('popup_map'), mapOptions);
		 }, 1000);
		/* if(!property) {

			console.log('property is null');

			return;
		}

		

		var style = '&style=feature:all|element:labels.text.fill|color:0xd3d3d3&style=feature:all|element:labels.text.stroke|color:0x1a3646|lightness:5&style=feature:administrative|element:geometry.fill|color:0x000000&style=feature:administrative|element:geometry.stroke|color:0x144b53|lightness:14|weight:1.4&style=feature:landscape|element:all|color:0x08304b&style=feature:poi|element:geometry|color:0x0c4152|lightness:5&style=feature:road.highway|element:geometry.fill|color:0x000000&style=feature:road.highway|element:geometry.stroke|color:0x0b434f|lightness:25&style=feature:road.arterial|element:geometry.fill|color:0x000000&style=feature:road.arterial|element:geometry.stroke|color:0x0b3d51|lightness:16&style=feature:road.local|element:geometry|color:0x000000&style=feature:transit|element:all|color:0x146474&style=feature:water|element:all|color:0x021019';
		var sneezyStyle='&style=feature:all|element:labels.text.fill|color:0x000000|lightness:40&style=feature:all|element:labels.text.stroke|color:0x000000|lightness:16&style=feature:administrative|element:geometry.fill|color:0x000000|lightness:20&style=feature:administrative|element:geometry.stroke|color:0x000000|lightness:17|weight:1.2&style=feature:landscape|element:geometry|color:0x000000|lightness:20&style=feature:poi|element:geometry|color:0x000000|lightness:21&style=feature:road.highway|element:geometry.fill|color:0x000000|lightness:17&style=feature:road.highway|element:geometry.stroke|color:0x000000|lightness:29|weight:0.2&style=feature:road.arterial|element:geometry|color:0x000000|lightness:18&style=feature:transit|element:geometry|color:0x000000|lightness:19&style=feature:road.local|element:geometry|color:0x000000|lightness:16&style=feature:water|element:geometry|color:0x000000|lightness:17&style=feature:all|element:labels.icon|visibility:off';
		var url = "http://maps.googleapis.com/maps/api/staticmap?center=49.2827,-123.1207" +
				  "&zoom=12&size=570x350&key=AIzaSyDEGrhHf_tIMo-mdc1zCToGN81Zg2UbByI" +
				  sneezyStyle;
				  
				  console.log(url);
		return url; */
	}

    ldt.saveProperty= function(properties){
        console.log(properties);
    };

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

        if(that.poiMarkers.length==0) {

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

        else {

            for(var n=0;n<that.poiMarkers.length;n++) {

                that.poiMarkers[n].show(true);
            }
        }
    }

    $scope.showaerial = function() {

        if(that.streetViewPanorama)that.streetViewPanorama.setVisible(false);

        that.map.setMapTypeId(google.maps.MapTypeId.HYBRID);

        that.map.setZoom(20);

        if(that.poiMarkers.length>0) {

            for(var n=0;n<that.poiMarkers.length;n++) {

                that.poiMarkers[n].show(false);
            }
        }
    }

    $scope.showTour = function () {
        var dialogInst = ldt.modal.open({
            templateUrl: 'listingdetailspage/tourView.dlg.html',
            controller: 'TourViewDlg',
            animation: true,
            size: 'lg',
            windowClass: 'modal-transparent-height'
        });
    }

    $scope.showFloorPlan = function () {
        var dialogInst = ldt.modal.open({
            templateUrl: 'listingdetailspage/floorPlanView.dlg.html',
            controller: 'TourViewDlg',
            animation: true,
            size: 'lg',
            windowClass: 'modal-transparent-height'
        });
    }

    // ldt.saveProperty = function(property) {
    //   ldt.uDataColl.SaveProperty(property.tablename, property.listingid,false,function(savedproperty){
    //   console.log('saving property');
    //     property.savedpropertyid = savedproperty.id;

    //     ldt.scope.$apply();

    //     ldt.uDataColl.AddPropertiesToList(ldt.uDataColl.currentList, savedproperty.id);
    //     console.log('end saving');
    //   }, ldt);
    // }

    $scope.property.photourls1 = [{
            id: 0,
            image1: '//www.232.vancouverhom.es/wp-content/uploads/2017/03/447-232-street-1-1.jpg',
            image2: '//www.232.vancouverhom.es/wp-content/uploads/2017/03/447-232-street-1-7.jpg'
        }, {
            id: 1,
            image1: '//www.232.vancouverhom.es/wp-content/uploads/2017/03/447-232-street-1-2.jpg',
            image2: '//www.232.vancouverhom.es/wp-content/uploads/2016/04/DSC1033-HDR-1.jpg'
        }];

    $scope.featuredProperties = featuredPropertiesCollection.GetProperties();

    $scope.propertiesSlider = {
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [{
                breakpoint: 1919,
                settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2
                }
            }, {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1
                }
            }, {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1
                }
            }]
    }
}

mod.controller('PhotoViewDlg', PhotoViewDlg);

function PhotoViewDlg($scope, $uibModalInstance, data) {
    var newPhotos = [];
    var id = -1;
    angular.forEach(data, function (ph) {
        id++;
        newPhotos.push({
            id: id,
            image: ph.image1
        });
        id++;
        newPhotos.push({
            id: id,
            image: ph.image2
        });
    })
    $scope.photos = newPhotos;

    $scope.ok = function () {
        $uibModalInstance.close('ok');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}
mod.controller('PopUpPhotoViewDlg', PopUpPhotoViewDlg);

function PopUpPhotoViewDlg($scope, $uibModalInstance, data) {
    var newPhotos = [];
    angular.forEach(data, function (ph) {
        newPhotos.push({
            id: ph.id,
            image: ph.image
        });
    });
    $scope.photos = newPhotos;

    $scope.ok = function () {
        $uibModalInstance.close('ok');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
mod.controller('MapViewDlg', MapViewDlg);

function MapViewDlg($scope, $uibModalInstance, Fullscreen, data) {

    this.center = new google.maps.LatLng(data.lat, data.lng);

    var mapOptions = {
        center: this.center,
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }

    this.map = null;

    this.marker = null;

    this.streetViewPanorama = null;

    this.poiNames = ['Restaurants','Day Care','Pre Schools','Elementary Schools','High Schools','train stations'];

    this.poiMarkers = [];

    var that = this;

    $uibModalInstance.rendered.then(function () {

        that.map = new google.maps.Map(document.getElementById('rea_property_details_map'), mapOptions);

        that.marker = new google.maps.Marker({
            position: that.center,
            map: that.map,
            icon: new google.maps.MarkerImage('images/home_b.png', null, null, new google.maps.Point(2, 3)),
            zIndex: 200
        });
    });

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

        if(that.poiMarkers.length==0) {

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

        else {

            for(var n=0;n<that.poiMarkers.length;n++) {

                that.poiMarkers[n].show(true);
            }
        }
    }

    $scope.showaerial = function() {

        if(that.streetViewPanorama)that.streetViewPanorama.setVisible(false);

        that.map.setMapTypeId(google.maps.MapTypeId.HYBRID);

        that.map.setZoom(20);

        if(that.poiMarkers.length>0) {

            for(var n=0;n<that.poiMarkers.length;n++) {

                that.poiMarkers[n].show(false);
            }
        }
    }

    $scope.ok = function () {
        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {
        /* Fullscreen.cancel(); */
        $uibModalInstance.dismiss('cancel');
    };
}

mod.controller('TourViewDlg', TourViewDlg);

function TourViewDlg($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}


