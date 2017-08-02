var mod = angular.module("propertyToursMod",['globalServicesMod','ui.router','angular-sortable-view','ngSanitize','ngAnimate','ui.bootstrap']);

mod.directive("propertyTourPane",propertyTourDir);

function propertyTourDir() {

    return {
        restrict: "E",
        transclude:true,
        template:'<ng-transclude></ng-transclude>',
        controller: propertyTourCtrl,
        controllerAs:'ptc'
    }
}

mod.controller("propertyTourCtrl",['$scope','$state','$timeout','$stateParams','$uibModal','userDataCollection','propertyDetailsCtrl','propertyDataCollection']);

function propertyTourCtrl($scope,$state,$stateParams,$timeout,$uibModal,userDataCollection,propertyDetailsCtrl,propertyDataCollection) {

    var ptc = this;

    this.scope = $scope;

    this.modal = $uibModal;

    this.uDataColl = userDataCollection;
	
	this.pDataColl = propertyDataCollection;

    this.propertyDetailsCtrl = propertyDetailsCtrl;

    if($stateParams.name) {

        this.uDataColl.currentTour = $stateParams.name.replace(/-/g,' ');
    }

    ptc.currentTour = this.uDataColl.currentTour;

    ptc.propertyTours = [];

    ptc.properties = [];

    this.startingLocation = '';

    ptc.showExtended = false;

    this.locationInput = null;

    this.locationBox = null;

    this.uDataColl.GetTours(function(tours){

        this.propertyTours = tours;

        this.GetStartingLocation();

        this.GetProperties(this.startingLocation);

    },this);

    var that = this;

    $timeout(function () {

        that.locationInput = document.getElementById('rea_tour_startinglocation');

        that.locationBox = new google.maps.places.SearchBox(that.locationInput);

        that.locationBox.addListener('places_changed', function() {

            var startingLoc = that.locationInput.value.replace("'","\'");

            that.GetProperties(startingLoc);
        });
    });
	
	PubSub.subscribe("propertytour.showdetails", function (msg, data) {

        that.propertyDetailsCtrl.DisplayDetails(data.idxtable, data.listingid, this.properties);
    });
	
	PubSub.subscribe("propertytour.viewphotos", function (msg, data) {
        that.ViewPhotos({
            tablename: data.idxtable,
            listingid: data.listingid
        });
    });
	
    console.log(ptc);
    $state.go('propertytour');
}

propertyTourCtrl.prototype.MapUrl = function(property) {

    var style = '&style=feature:all|element:labels|visibility:on&style=feature:all|element:labels.text.fill|saturation:36|color:0x000000|lightness:40&style=feature:all|element:labels.text.stroke|visibility:on|color:0x000000|lightness:16&style=feature:all|element:labels.icon|visibility:off&style=feature:administrative|element:geometry.fill|color:0x000000|lightness:20&style=feature:administrative|element:geometry.stroke|color:0x000000|lightness:17|weight:1.2&style=feature:administrative.locality|element:labels.text.fill|color:0xc4c4c4&style=feature:administrative.neighborhood|element:labels.text.fill|color:0x707070&style=feature:landscape|element:geometry|color:0x000000|lightness:20&style=feature:poi|element:geometry|color:0x000000|lightness:21|visibility:on&style=feature:poi.business|element:geometry|visibility:on&style=feature:road.highway|element:geometry.fill|color:0xbe2026|lightness:0|visibility:on&style=feature:road.highway|element:geometry.stroke|visibility:off&style=feature:road.highway|element:labels.text.fill|visibility:off&style=feature:road.highway|element:labels.text.stroke|visibility:off|hue:0xff000a&style=feature:road.arterial|element:geometry|color:0x000000|lightness:18&style=feature:road.arterial|element:geometry.fill|color:0x575757&style=feature:road.arterial|element:labels.text.fill|color:0xffffff&style=feature:road.arterial|element:labels.text.stroke|color:0x2c2c2c&style=feature:road.local|element:geometry|color:0x000000|lightness:16&style=feature:road.local|element:labels.text.fill|color:0x999999&style=feature:road.local|element:labels.text.stroke|saturation:-52&style=feature:transit|element:geometry|color:0x000000|lightness:19&style=feature:water|element:geometry|color:0x000000|lightness:17';
    var url = "http://maps.googleapis.com/maps/api/staticmap?center="+property.lat+","+property.lng+"&zoom=16&size=283x239&key=AIzaSyDEGrhHf_tIMo-mdc1zCToGN81Zg2UbByI&markers=color:green%7Clabel:A%7C"+property.lat+","+property.lng+style;

    return url;
}

propertyTourCtrl.prototype.SwitchTour = function() {

    this.uDataColl.currentTour = this.currentTour;

    this.GetStartingLocation();

    this.GetProperties(this.startingLocation);
}

propertyTourCtrl.prototype.GetStartingLocation = function() {

    this.startingLocation = 'Vancouver, BC, Canada';
	return;
	
    for(var i=0;i<this.propertyTours.mytours.length;i++) {

        if(this.propertyTours.mytours[i].name==this.currentTour) {

            this.startingLocation = this.propertyTours.mytours[i].startinglocation;

            return;
        }
    }

    if(this.startingLocation=='') {

        for(var i=0;i<this.propertyTours.agenttours.length;i++) {

            if(this.propertyTours.agenttours[i].name==this.currentTour) {

                this.startingLocation = this.propertyTours.agenttours[i].startinglocation;

                return;
            }
        }
    }
}

propertyTourCtrl.prototype.ViewPhotos = function (property) {
	console.log("in view photos function")
    this.pDataColl.GetPhotos(property.tablename, property.listingid, function (data) {

        PubSub.publish("photoviewer.display", {
            images: data.photourls,
            title: data.fulladdress
        });

    }, this);
}

propertyTourCtrl.prototype.GetTargetPropertyIds = function(property) {

    var targetPropertyIds = [];

    if(property)targetPropertyIds.push(property.id);
    else {

        var ids = $('property-list-pane .recheckbox input[type="checkbox"]:checked');

        if(ids.length==0) {

            rea_util.Alert('Please Select Properties');

            return targetPropertyIds;
        }

        ids.each(function() {

            var idstring = $(this).attr('id');

            var id = idstring.split('_').pop().trim();

            targetPropertyIds.push(id);
        })
    }

    return targetPropertyIds;
}


propertyTourCtrl.prototype.RequestInfo = function(property) {

    var propertyIDs = this.GetTargetPropertyIds(property);

    var data = {message:'Please Send Me More Info On These Properties'};

    if(propertyIDs.length<2)data.message =  'Please Send Me More Info On This Property';

    var dialogInst = this.modal.open({
        templateUrl: 'search/requestinfo.dlg.html',
        controller: 'RequestInfoDlg',
        size:'md',
        windowClass:'add-list',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    var that = this;

    dialogInst.result.then(function (result) {

        var props = propertyIDs.join(',');

        that.SendToAgent(props,data.message);

    }, function () {

    });
}

propertyTourCtrl.prototype.ShowDetails = function(property) {

    this.propertyDetailsCtrl.DisplayDetails(property.tablename,property.listingid);
}

propertyTourCtrl.prototype.GetProperties = function(startingLocation) {

    this.uDataColl.GetTourProperties(this.currentTour,startingLocation,function(properties) {

        for(var i=0;i<properties.length;i++) {

            var property = properties[i];

            if(property.firstphotourl) {

                if(!property.firstphotourl.startsWith("http")) {

                    property.firstphotourl = rea_domain+property.firstphotourl;
                }
            }
        }

        this.properties = properties;

        this.scope.$apply();

    },this);
}

propertyTourCtrl.prototype.RemoveProperty = function(property) {

    var that = this;

    var msg = "Are You Sure You Want to Remove This Property ?";

    rea_util.ConfirmAction(msg,'Remove',function(isConfirmed) {

        if(isConfirmed) {

            that.uDataColl.RemoveFromTour(that.currentTour,property.id,function(){

              this.GetProperties();

            },that);
        }
    });
}

propertyTourCtrl.prototype.GetDirections = function(index) {

    var toProperty = this.properties[index];

    var from = '';

    if(index>0) {

        var fromProperty = this.properties[index-1];

        from = fromProperty.streetaddress+','+fromProperty.city+','+fromProperty.stateprovince;
    }
    else {

        from = this.startingLocation;
    }

    var data = {fromloc:from,toloc:toProperty.streetaddress+','+toProperty.city+','+toProperty.stateprovince};

    var dialogInst = this.modal.open({
        templateUrl: 'propertytours/getdirections.dlg.html',
        controller: 'GetDirectionsDlg',
        size: 'md',
        windowClass: 'add-to-tour',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    var that = this;

    dialogInst.result.then(function (result) {

        var url  = 'http://maps.google.com?saddr='+encodeURIComponent(data.fromloc)+'&daddr='+encodeURIComponent(data.toloc)+'&directionsmode=transit';

        var win = window.open(url, '_blank');

        win.focus();

    }, that);

}

mod.controller('GetDirectionsDlg', function($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.ok = function () {

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };

    angular.element(function () {

        var input = document.getElementById('rea_getdirections');

        var locationBox = new google.maps.places.SearchBox(input);

        locationBox.addListener('places_changed', function() {


        });
    });
});

mod.directive("propertyTourCard",propertyTourCardDir);

function propertyTourCardDir() {

    return {
        restrict: "E",
        templateUrl: 'propertytours/propertycard.tpl.html'
    }
}

