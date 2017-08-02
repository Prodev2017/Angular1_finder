var mod = angular.module('globalServicesMod', ['ngAnimate', 'ui.bootstrap','angularFileUpload','LocalStorageModule']);

mod.config(function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix("harcourts");
})
//Data Services

//User Manager (Login,Logout,Register,etc)

mod.service("userManager", UserManager);

//Featured Communities Collection

mod.service("featuredCommunitiesCollection", FeaturedCommunitiesCollection);

//Featured Properties Collection

mod.service("featuredPropertiesCollection", FeaturedPropertiesCollection);

//Message Collection

mod.service("messageCollection", MessageCollection);

//Search Collection (Listing Data)

mod.service("propertyDataCollection", PropertyDataCollection);

//User Data (Saved Property Lists,Saved Searches,etc.

mod.service("userDataCollection", UserDataCollection);

//Common UI Services

//Property Details Dialog

mod.service("propertyDetailsCtrl", ['propertyDataCollection', 'userDataCollection', '$uibModal', 'Fullscreen', PropertyDetailsCtrl]);

function PropertyDetailsCtrl(propertyDataCollection, userDataCollection, $uibModal, Fullscreen) {

    this.pDataColl = propertyDataCollection;

    this.uDataColl = userDataCollection;

    this.modal = $uibModal;

    this.currenObject = {};

    this.allProperties = {};

    var that = this;

    this.DisplayNextDetails = function () {

        if (that.allProperties) {

            var curIndex = that.allProperties.findIndex(function (obj) {

                return obj.listingid === that.currenObject.listingid;
            });

            if (Number.isInteger(curIndex) && curIndex < that.allProperties.length - 1) {

                that.DisplayDetails(that.allProperties[curIndex + 1].tablename, that.allProperties[curIndex + 1].listingid, that.allProperties);
            }
            else {
                console.log('last Item');
            }
        }
        else {
            console.log('Only item');
        }
    };

    this.DisplayPreviousDetails = function () {

        if (that.allProperties) {

            var curIndex = that.allProperties.findIndex(function (obj) {

                return obj.listingid === that.currenObject.listingid;
            });

            if (Number.isInteger(curIndex) && curIndex > 0) {

                that.DisplayDetails(that.allProperties[curIndex - 1].tablename, that.allProperties[curIndex - 1].listingid, that.allProperties);
            }
            else {

                console.log('first Item');
            }
        } else {

            console.log('Only item');
        }
    };
	
	this.DisplayPopupMap = function(property){
		if(!property) {

			console.log('property is null');

			return;
		}

		/* var polyArray = [];

		community.coords.forEach(function(coor) {
			polyArray.push(coor.lat + ',' + coor.lng);
		});

		var polyUrl = polyArray.join('|'); */

		var style = '&style=feature:all|element:labels.text.fill|color:0xd3d3d3&style=feature:all|element:labels.text.stroke|color:0x1a3646|lightness:5&style=feature:administrative|element:geometry.fill|color:0x000000&style=feature:administrative|element:geometry.stroke|color:0x144b53|lightness:14|weight:1.4&style=feature:landscape|element:all|color:0x08304b&style=feature:poi|element:geometry|color:0x0c4152|lightness:5&style=feature:road.highway|element:geometry.fill|color:0x000000&style=feature:road.highway|element:geometry.stroke|color:0x0b434f|lightness:25&style=feature:road.arterial|element:geometry.fill|color:0x000000&style=feature:road.arterial|element:geometry.stroke|color:0x0b3d51|lightness:16&style=feature:road.local|element:geometry|color:0x000000&style=feature:transit|element:all|color:0x146474&style=feature:water|element:all|color:0x021019';
		var sneezyStyle='&style=feature:all|element:labels.text.fill|color:0x000000|lightness:40&style=feature:all|element:labels.text.stroke|color:0x000000|lightness:16&style=feature:administrative|element:geometry.fill|color:0x000000|lightness:20&style=feature:administrative|element:geometry.stroke|color:0x000000|lightness:17|weight:1.2&style=feature:landscape|element:geometry|color:0x000000|lightness:20&style=feature:poi|element:geometry|color:0x000000|lightness:21&style=feature:road.highway|element:geometry.fill|color:0x000000|lightness:17&style=feature:road.highway|element:geometry.stroke|color:0x000000|lightness:29|weight:0.2&style=feature:road.arterial|element:geometry|color:0x000000|lightness:18&style=feature:transit|element:geometry|color:0x000000|lightness:19&style=feature:road.local|element:geometry|color:0x000000|lightness:16&style=feature:water|element:geometry|color:0x000000|lightness:17&style=feature:all|element:labels.icon|visibility:off';
		var url = "http://maps.googleapis.com/maps/api/staticmap?center=49.2827,-123.1207" +
				  "&zoom=12&size=570x350&key=AIzaSyDEGrhHf_tIMo-mdc1zCToGN81Zg2UbByI" +
				  sneezyStyle;
				  
				  console.log(url);
		return url;
	}
	
	this.SaveProperty = function (property, event) {
		console.log("in global save property");
		
		this.uDataColl.SaveProperty(property.tablename, property.listingid, false, this.uDataColl.currentList, function (savedproperty) {

			property.savedpropertyid=savedproperty.savedpropertyid;

			that.scope.$apply();

		}, this);
	}
	
	this.RequestInfo = function (property) {

		console.log("in request info");
		var data = {
			message: 'Please Send Me More Info On This Property'
		};

		var dialogInst = this.modal.open({
			templateUrl: 'search/requestinfo.dlg.html',
			controller: 'RequestInfoDlg',
			size: 'md',
			windowClass: 'add-list',
			resolve: {
				data: function () {
					return data;
				}
			}
		});

		var that = this;

		dialogInst.result.then(function (result) {

			that.SendToAgent(property, data.message);

		}, function () {

		});
	}

    this.DisplayDetails = function (idxtable, listingid, getproperty, context) {

        /*-- Browser Fullscreen  --*/

        /* Fullscreen.all(); */

        this.allProperties = getproperty;

        this.pDataColl.GetListingFullDetails(idxtable, listingid, function (property) {

            if (!property)return;

            that.currenObject = property;

            var data = {
                domain: rea_domain,
                property: property,
                dataColl: this.pDataColl,
                getproperty: getproperty,
                context: context
            };

            if (!that.dialogInst) {

                that.dialogInst = this.modal.open({
                    templateUrl: 'search/details.dlg.html',
                    controller: 'DisplayDetailsDlg',
                    animation: false,
                    windowClass: 'property-details popup-small',
                    resolve: {
                        data: function () {
                            return data;
                        }
                    }
                });
            }
            else {

                PubSub.publish("detailsmodal.render", {data: data});
            }

            that.dialogInst.result.then(function (result) {

            }, function () {

            });

        }, this);
    }
}

mod.controller('DisplayDetailsDlg', ['$scope','localStorageService', '$uibModalInstance', 'data','userManager','AuthenticationCtrl', 'propertyDetailsCtrl', 'featuredPropertiesCollection', '$uibModal', 'Fullscreen', DisplayDetailsDlg]);

function DisplayDetailsDlg($scope,localStorageService, $uibModalInstance, data, userManager,AuthenticationCtrl,propertyDetailsCtrl, featuredPropertiesCollection, $uibModal, Fullscreen) {

    this.scope = $scope;

    this.$uibModalInstance = $uibModalInstance;

    this.propertyDetailsCtrl = propertyDetailsCtrl;

    this.localStorageService = localStorageService;
 
    $scope.mortgage = {
        homePrice: 0,
        downPayment: 0,
        downPaymentRate:20,
        newHomeAmt: 0,
        interestRate: 2.5,
        aprMonthlyRate: 0,
        numberOfPayments: 0,
        interestPayments: 0,
        mortgagePeriod: 15,
        mortgagePeriods: [5,10,15,20,25,30],
        downPayments:[5,10,15,20],
        interestRates: [2.5,2.8,3.25,3.4,4],
        monthlyPayment: 0,
        mortgageAmount : 0
    }

    
    var that = this;

    $scope.hideVow = !userManager.isAuthenticated;

    $scope.doLogin = function() {

        AuthenticationCtrl.Login(function(response){

            if(userManager.isAuthenticated) {

                $scope.hideVow = false;

                $scope.$apply();
            }
        });
    }

    var setHomePrice = function() {
        $scope.mortgage.homePrice = $scope.property.listprice;
    }
    $scope.$watch('property', setHomePrice);

    

    //subtract down payment from home price
    var findNewHomeAmt = function() {
        console.log("new home amount");
        $scope.mortgage.newHomeAmt = $scope.mortgage.homePrice - $scope.mortgage.downPayment;
        console.log($scope.mortgage.newHomeAmt);
    }
    $scope.$watch('mortgage.homePrice + mortgage.downPayment',findNewHomeAmt);

    //Calculate monthly APR Rate
    var aprMonthly = function() {
        console.log("interestRate changed");
        $scope.mortgage.aprMonthlyRate = (($scope.mortgage.interestRate / 100) / 12);
    };
    $scope.$watch('mortgage.interestRate', aprMonthly);

    //Calculate Total Number of Mortgage Payments
    var numOfPayments = function()  {
        $scope.mortgage.numberOfPayments = ($scope.mortgage.mortgagePeriod * 12);
    };
    $scope.$watch('mortgage.mortgagePeriod', numOfPayments);

    //Calculate term (1+i)^n or interestPayments^numberOfPayments
    var interestPayments = function()   {
        $scope.mortgage.interestPayments = Math.pow(1 + $scope.mortgage.aprMonthlyRate, $scope.mortgage.numberOfPayments);
    };
    $scope.$watch('mortgage.mortgagePeriod + mortgage.interestRate + mortgage.downPayment', interestPayments);

    //calculate monthly mortgage payment
    var monthlyPayment = function() {
        console.log($scope.mortgage.downPaymentRate)
        $scope.mortgage.monthlyPayment = ($scope.mortgage.newHomeAmt * ($scope.mortgage.aprMonthlyRate *      $scope.mortgage.interestPayments) / ($scope.mortgage.interestPayments - 1)).toFixed(2);
        $scope.mortgage.mortgageAmount = (($scope.mortgage.monthlyPayment *      $scope.mortgage.numberOfPayments)).toFixed(2);
    };
    $scope.$watch('mortgage.aprMonthlyRate + mortgage.interestPayments + mortgage.homePrice + mortgage.newHomeAmt', monthlyPayment);

    //Calculate down payment
    var calculateDownPayment = function() {
        $scope.mortgage.downPayment = (($scope.mortgage.downPaymentRate/100) * $scope.mortgage.homePrice);
      
    }
    $scope.$watch('mortgage.downPaymentRate + mortgage.homePrice', calculateDownPayment);

	$scope.resizeCount = true;

    if(Fullscreen.isEnabled()){

        $scope.resizeCount = true;
    }

    this.init(data);

    PubSub.subscribe("detailsmodal.render", function (msg, data) {
        that.init(data.data);
    });

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
    };

    $scope.handleResize = function () {
        if ($scope.resizeCount){
            /*-- Browser Fullscreen  --*/

			Fullscreen.all();
			document.getElementsByClassName('modal-content ')[0].style.width = '100%';
			document.getElementsByClassName('modal-prev-btn')[0].style.margin = '0px';
			document.getElementsByClassName('modal-next-btn')[0].style.margin = '0px';
            document.getElementsByClassName('modal-dialog ')[0].classList.add('full-modal');
        }
        else{
			/*--  Exit Browser full screen  --*/
			Fullscreen.cancel();
            document.getElementsByClassName('modal-content ')[0].style.width = '80%';
			document.getElementsByClassName('modal-prev-btn')[0].style.margin = '0 0 0 -12.3%';
			document.getElementsByClassName('modal-next-btn')[0].style.margin = '0 -12.3% 0 0';
            document.getElementsByClassName('modal-dialog ')[0].classList.remove('full-modal');
        }
        $scope.resizeCount = !$scope.resizeCount;
    };
	
	$scope.handlePrint = function () {
        window.print();
    };

    $scope.calculateMortgage = function() {

    }

    $scope.listingdetailspage = function(property) {
  
        localStorageService.set("showDetails", property);
        window.open(window.location.href, "_blank");
        $scope.cancel();
    };

    $scope.ok = function () {

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        /*--  Exit Browser full screen  --*/
        /* Fullscreen.cancel(); */

        $uibModalInstance.dismiss('cancel');
    };

    $scope.displayNextDetails = function () {

        propertyDetailsCtrl.DisplayNextDetails();
    };

    $scope.displayPreviousDetails = function () {

        propertyDetailsCtrl.DisplayPreviousDetails();
    };
	
	$scope.requestInfo = function (property,event){
		propertyDetailsCtrl.RequestInfo(property);
	}
	
	$scope.popupMapUrl = function (property) {
		console.log("in poopupmapurl");
		return propertyDetailsCtrl.DisplayPopupMap(property);
	}
	
    $scope.SaveProperty = function (property, event) {
		console.log("in global save property");
		// alert('=rajaram="');
		propertyDetailsCtrl.SaveProperty(property,event);
	}
	

    $scope.expandPhotos = function (data, condition) {
		console.log(data);
					
						/* console.log(JSON.stringify(images)); */
        if (condition) {
			var images=[];
		 angular.forEach(data, function(value, key){
						images.push('http:'+value.image);
						
						});
		
			$.fancybox.open([
					{
						href : images[0]
						
						
					},
					{
						href : images[1]
					},
					{
						href : images[2]
					}
			], {
					helpers : {
						thumbs : {
							width: 75,
							height: 50
						}
					}
				});
	            /* var dialogInst = $uibModal.open({
                templateUrl: 'listingdetailspage/photoview.dlg.html',
                controller: 'PopUpPhotoViewDlg',
                animation: true,
                size: 'lg',
                windowClass: 'modal-transparent',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            }); */
        }
        else {
            var dialogInst = $uibModal.open({
                templateUrl: 'listingdetailspage/mapview.dlg.html',
                controller: 'MapViewDlg',
                animation: false,
                size: 'lg',
                windowClass: 'modal-transparent map-view-popup ',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });
        }
    }

    $scope.$on('modal.closing', function () {
        that.propertyDetailsCtrl.dialogInst = null;
    })
}

DisplayDetailsDlg.prototype.init = function (data) {

    this.scope.property = data.property;

    this.scope.possibleProperties = [];

    this.center = new google.maps.LatLng(data.property.lat, data.property.lng);

    var mapOptions = {
        center: this.center,
        zoom: 20,
		mapTypeId: google.maps.MapTypeId.HYBRID
        /* styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}] */
    }

    if(data.getproperty){
        for (var i = 0; i < 3; i++) {
            var count = Math.floor(Math.random() * (data.getproperty.length));
            this.scope.possibleProperties.push(data.getproperty[count]);
        }
    }

    this.map = null;

    this.marker = null;

    this.streetViewPanorama = null;

    this.poiNames = ['Restaurants','Day Care','Pre Schools','Elementary Schools','High Schools','train stations'];

    this.poiMarkers = [];

    var that = this;

    this.$uibModalInstance.rendered.then(function () {

        that.map = new google.maps.Map(document.getElementById('rea_property_details_map'), mapOptions);

        that.marker = new google.maps.Marker({
            position: that.center,
            map: that.map,
            icon: new google.maps.MarkerImage('images/home_b.png', null, null, new google.maps.Point(2, 3)),
            zIndex: 200
        });
    });

    this.scope.showstreetview = function() {

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

    this.scope.showpoi = function() {

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

    this.scope.showaerial = function() {

        if(that.streetViewPanorama)that.streetViewPanorama.setVisible(false);

        that.map.setMapTypeId(google.maps.MapTypeId.HYBRID);

        that.map.setZoom(20);

        if(that.poiMarkers.length>0) {

            for(var n=0;n<that.poiMarkers.length;n++) {

                that.poiMarkers[n].show(false);
            }
        }
    }

    this.scope.property.photourls = [{
            id: 0,
            image: '//www.232.vancouverhom.es/wp-content/uploads/2017/03/447-232-street-1-1.jpg',
        }, {
            id: 1,
            image: '//www.232.vancouverhom.es/wp-content/uploads/2017/03/447-232-street-1-7.jpg',
        }, {
            id: 2,
            image: '//www.232.vancouverhom.es/wp-content/uploads/2017/03/447-232-street-1-2.jpg',
        }, {
            id: 3,
            image: '//www.232.vancouverhom.es/wp-content/uploads/2016/04/DSC1033-HDR-1.jpg'
        }];
}

mod.directive('agentInfo', AgentInfoDir);

function AgentInfoDir() {

    return {
        restrict: "E",
        templateUrl: 'search/agentinfo.tpl.html',
        scope: {
            info: '='
        },
    }
}

//File Upload Dialog

mod.service("FileUploadCtrl", ['userDataCollection', '$uibModal', FileUploadControl]);

function FileUploadControl(userDataCollection, $uibModal) {

    this.uDataColl = userDataCollection;

    this.modal = $uibModal;
}

FileUploadControl.prototype.Show = function (uploader) {

    var data = {uploader: uploader};

    var dialogInst = this.modal.open({
        templateUrl: 'messages/fileupload.dlg.html',
        controller: 'FileUploadDlg',
        size: 'lg',
        windowClass: 'file-upload',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    dialogInst.result.then(function (result) {

    }, function () {

    });
}

mod.controller('FileUploadDlg',['$scope', '$uibModalInstance', 'data', FileUploadDlg]);

function FileUploadDlg($scope, $uibModalInstance, data) {

    $scope.title = data.file.name;

    $scope.ok = function () {

        data.description = $scope.comment;

        data.title = $scope.title;

        $uibModalInstance.close('ok');

        $('#fileupload').val("");
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');

        $('#fileupload').val("");
    };
}

//Image Viewer

mod.directive('photoViewer', photoViewerDir);

function photoViewerDir() {

    return {
        restrict: "E",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        controller: 'PhotoViewerCtrl'
    }
}

//Display Images (Images: [{id:,url:}...])

mod.controller('PhotoViewerCtrl', PhotoViewerCtrl);

function PhotoViewerCtrl($scope) {

    var photoViewerInstance = null;

    $scope.title = '';

    PubSub.subscribe("photoviewer.display", function (msg, data) {

        $('.rea-photo-viewer').hide();

        $('#rea_unitegallery').empty();

        $scope.title = data.title;

        for (var i = 0; i < data.images.length; i++) {

            var image = data.images[i];

            var html = "<img src=\"" + image.url + "\" alt=\"" + image.id + "\" data-image=\"" + image.url + "\" data-description=\"" + image.id + "\">";

            $('#rea_unitegallery').append(html);
        }

        $scope.$apply();

        $('.rea-photo-viewer').show();

        var width = .8 * window.innerWidth;

        photoViewerInstance = $('#rea_unitegallery').unitegallery({thumb_overlay_opacity: 0, theme_panel_position: "bottom", gallery_control_keyboard: true, gallery_min_width: 900, gallery_theme: "grid", strip_scroll_to_thumb_duration: 3000});

        rea_util.CenterDiv($('.rea-photo-viewer'));
    });

    PubSub.subscribe("photoviewer.close", function (msg, data) {

        $('.rea-photo-viewer').hide();

        photoViewerInstance = null;
    });
}

//Filters

mod.filter('trusted', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);

mod.filter( 'nanumber', function() {

        return function( input ) {

            if(!input)return "N/A";

            if(input==''||input==0)return "N/A";

            return rea_util.ThousandsDelimit(input);
        }

    });

mod.filter( 'nacurrency', function() {

    return function( input ) {

        if(!input)return "N/A";

        if(input==''||input==0)return "N/A";

        return '$'+rea_util.ThousandsDelimit(input.toFixed(0));
    }

});

mod.filter( 'nanumberacres', function() {

    return function( input ) {

        if(!input)return "N/A";

        if(input==''||input==0)return "N/A";

        return input+' acres';
    }

});

mod.filter( 'nana', function() {

    return function( input ) {

        if(!input)return "N/A";

        return input;
    }
});

//Resize

mod.directive('resizer', function($document) {

    return function($scope, $element, $attrs) {

        $element.on('mousedown', function(event) {

            event.preventDefault();

            $document.on('mousemove', mousemove);

            $document.on('mouseup', mouseup);
        });

        function mousemove(event) {

            if ($attrs.resizer == 'vertical') {

                // Handle vertical resizer

                var x = event.pageX;

                if ($attrs.resizerMax && x > $attrs.resizerMax) {
                    x = parseInt($attrs.resizerMax);
                }

                $element.css({
                    left: x + 'px'
                });

                $($attrs.resizerLeft).css({
                    width: x + 'px'
                });

                $($attrs.resizerRight).css({
                    left: (x + parseInt($attrs.resizerWidth)) + 'px'
                });

            } else {

                // Handle horizontal resizer

                //var y = window.innerHeight - event.pageY;

                y = event.pageY-$($attrs.resizerTop).offset().top;

                //console.log(y);

                // $element.css({
                //     bottom: y + 'px'
                // });

                $($attrs.resizerTop).css({
                    height: y + 'px'
                });

                var bottomHeight = window.innerHeight-$($attrs.resizerBottom).offset().top;

                $($attrs.resizerBottom).css({
                    height: bottomHeight + 'px'
                });
            }
        }

        function mouseup() {

            $document.unbind('mousemove', mousemove);

            $document.unbind('mouseup', mouseup);

            PubSub.publish("map.reset",{});
        }
    };
});

//Login Control

mod.service("AuthenticationCtrl", ['userManager', '$uibModal', AuthenticationCtrl]);

function AuthenticationCtrl(userManager, $uibModal) {

    this.userMgr = userManager;

    this.modal = $uibModal;
}

AuthenticationCtrl.prototype.Login = function (callback, context) {

    if (this.userMgr.isAuthenticated) {

        if (callback)callback.call(context, 'success');

        return;
    }

    var data = {email: this.userMgr.email, password: '', name: ''};

    var dialogInst = this.modal.open({
        templateUrl: 'usermgr/login.dlg.html',
        controller: 'LoginDlg',
        //templateUrl: 'propertylists/addtotour.dlg.html',
        //controller:'AddToTourDlg',
        windowClass: 'popup-user',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    var that = this;

    dialogInst.result.then(function (result) {

        if (result == 'register') {

            that.Register(callback, context);
        }
        else if (result == 'forgot') {

            that.ForgotPassword(callback, context);
        }
        else {

            that.userMgr.Login(data.email, data.password, function (result) {

                if (result.status == 'error') {

                    rea_util.Alert('Either UserName or Password is Incorrect');

                    PubSub.publish("banner.loginjoin", {loggedin: false});

                    if (callback)
                        callback.call(context, 'fail');

                    return;
                }

                PubSub.publish("banner.loginjoin", {loggedin: true});

                if (callback)callback.call(context, 'success');

            }, this)
        }

    }, function () {

    });
}

AuthenticationCtrl.prototype.Register = function (callback, context) {

    var data = {
        firstname: '',
        lastname: '',
        email: '',
        mobilephone: '',
        password: '',
        confirmpassword: '',
        listingagreement:false,
        newsagreement:false,
        working:'no',
        market: {
            buy:false,
            sell:false,
            investment:false,
            evaluate:false,
            relocate:false,
            other:false
        },
        errors: {
            firstname: '',
            lastname: '',
            email: '',
            mobilephone: '',
            homephone: '',
            password: '',
            agreement:''
        }
    };

    var dialogInst = this.modal.open({

        templateUrl: 'usermgr/register.dlg.html',
        controller: 'RegisterDlg',
        windowClass: 'popup-user',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    var that = this;

    dialogInst.result.then(function (result) {

        if (result == 'login') {

            that.Login(callback, context);
        }
        else {

            that.userMgr.Register(data.firstname, data.lastname, data.email, data.mobilephone,data.password,data.working,data.market, function (response) {

                if (response.status == 'error' && response.reason == 'EMail In Use') {

                    rea_util.Alert('An account with the specified E-Mail Address is Already in Use');

                    if (callback) callback.call(context, 'error');

                    return;
                }

                PubSub.publish("banner.loginjoin",{loggedin:true,name:this.userMgr.name})

                if (callback) callback.call(context, 'success');

            }, that);
        }

    }, function () {

    });
}

AuthenticationCtrl.prototype.ForgotPassword = function (callback, context) {

    var data = {email: ''};

    var dialogInst = this.modal.open({
        templateUrl: 'usermgr/forgotpassword.dlg.html',
        controller: 'LoginDlg',
        windowClass: 'property-details popup-user',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    dialogInst.result.then(function (result) {

        that.userMgr.ForgotPassword(data.email, function (response) {

            rea_util.FlashMessage("E-Mail Sent");

            if (callback)
                callback.call(context, 'success');

        }, that);

    }, function () {

    });
}

mod.controller('LoginDlg', function ($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.ok = function () {

        if (data.email == '') {

            rea_util.Alert('Please Enter Valid EMail Address');

            return;
        }

        if (!rea_util.IsValidEMail(data.email)) {

            rea_util.Alert('Please Enter Valid EMail Address');

            return;
        }

        if (data.password == '') {

            rea_util.Alert('Please Enter A Password');

            return;
        }

        $uibModalInstance.close('ok');
    }

    $scope.register = function () {

        $uibModalInstance.close('register');
    };

    $scope.forgot = function () {

        $uibModalInstance.close('forgot');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.controller('RegisterDlg', RegisterDlg);

function RegisterDlg($scope, $uibModalInstance, $uibModal,data) {

    $scope.data = data;

    $scope.register = function () {

        if(!$scope.isValid()){

            return;
        }

        $uibModalInstance.close('register');
    };

    $scope.login = function () {

        $uibModalInstance.close('login');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };

    $scope.privacy = function() {

        var dialogInst = $uibModal.open({

            templateUrl: 'usermgr/privacy.dlg.html',
            controller: 'PrivacyDlg',
            windowClass: 'popup-user',
        });

        dialogInst.result.then(function (result) {

        }, function () {

        });
    }

    $scope.isValid = function() {

        var valid = true;

        if(data.firstname)data.errors.firstname='';
        else {valid=false;data.errors.firstname='Missing Field';}

        if(data.lastname)data.errors.lastname='';
        else {valid=false;data.errors.lastname='Missing Field';}

        if(data.email) {

            if(!rea_util.IsValidEMail(data.email)) {
                valid = false;
                data.errors.email = 'E-Mail Address Not Valid';
            }
            else data.errors.email='';
        }
        else {valid=false;data.errors.email='Missing Field';}

        if(data.mobilephone) {

            if(!rea_util.IsValidPhone(data.mobilephone)) {
                valid = false;
                data.errors.mobilephone = 'Phone Number Not Valid';
            }
            else data.errors.mobilephone='';
        }

        if(data.password) {

            if(data.password!=data.confirmpassword) {
                valid = false;
                data.errors.password = 'Passwords Do Not Match';
            }
            else if(data.password.length<8) {
                valid = false;
                data.errors.password = 'Password Must Be at lead 8 characters';
            }
            else data.errors.password='';
        }
        else {valid=false;data.errors.password='Missing Field';}

        if(!data.listingagreement||!data.newsagreement) {
            valid = false;
            data.errors.agreement = 'Please Check Boxes To Proceed';
        }
        else data.errors.agreement='';

        return valid;
    }
}

mod.controller('PrivacyDlg', function ($scope, $uibModalInstance) {

    $scope.ok = function () {

        $uibModalInstance.close('ok');
    }
});

mod.directive('loginHoverImageEffect', function ($timeout) {

    return {
        restrict: 'A',
        link: function (scope, element, attr) {
                $timeout(function () {
                    console.log("in disort function");
					 $('#demo1').logosDistort({
						effectWeight: 1,
						outerBuffer: 1.08,
						elementDepth: 200,
						perspectiveMulti: 1.5,
						enableSmoothing: true,
						onInit: function() {
						  $('#particle-target').particleground({
							dotColor: '#1ec5ee',
							lineColor: '#0a4e90',
							density: 20000,
							parallax: false
						  });
						}
					 });
                },100);
            }
        }
    }
);

function loginHoverImageEffect() {
    return {
        restrict: 'A',
        link: loginHoverImageEffectCtrl,
        scope: {
            loginHoverImageEffect: '<'
        }
    };
}

function loginHoverImageEffectCtrl(scope, element, attrs) {
     console.log("in disort function");
	 $('#demo1').logosDistort({
		effectWeight: 1,
		outerBuffer: 1.08,
		elementDepth: 200,
		perspectiveMulti: 1.5,
		enableSmoothing: true,
		onInit: function() {
		  $('#particle-target').particleground({
			dotColor: '#1ec5ee',
			lineColor: '#0a4e90',
			density: 20000,
			parallax: false
		  });
		}
	 });
	 
	 mod.directive("modalPropertyRepeater", function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    if(!scope.init)
						loadPropertyCarousel(scope);
                });
            }
        }
    }
});

function loadPropertyCarousel(scope){
	scope.init=true;
	console.log($("section .gallery")[0]);
	$("#modalPropertyCarousel").flexisel(
	{
		visibleItems: 3,
		itemsToScroll: 1,
		infinite:false,    
		navigationTargetSelector: $(".relevant-listing .gallery")[0], 
		autoPlay: {
			enable: false,
			interval: 5000,
			pauseOnHover: true
		},
		responsiveBreakpoints: { 
			portrait: { 
				changePoint:481,
				visibleItems: 1,
				itemsToScroll: 1
			}, 
			landscape: { 
				changePoint:641,
				visibleItems: 1,
				itemsToScroll: 1
			},
			tablet: { 
				changePoint:769,
				visibleItems: 1,
				itemsToScroll: 1
			}
		},				
	});
}
}
