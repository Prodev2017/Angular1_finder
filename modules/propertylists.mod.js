var mod = angular.module("propertyListsMod",['globalServicesMod','ngTouch','ui.router','angular-sortable-view','ngSanitize','ngAnimate','ui.bootstrap']);

mod.directive("propertyListPane",propertyListDir);

function propertyListDir() {

    return {
        restrict: "E",
        transclude:true,
        template:'<ng-transclude></ng-transclude>',
        controller: propertyListCtrl,
        controllerAs:'plc'
    }
}

mod.controller("propertyListCtrl",['$scope','$state','$uibmodal','messageCollection', 'AuthenticationCtrl','$stateParams','userDataCollection','propertyDetailsCtrl','propertyDataCollection']);

function propertyListCtrl($scope,$state,$uibModal, $stateParams,userDataCollection,propertyDetailsCtrl,propertyDataCollection,messageCollection,AuthenticationCtrl) {

    var plc = this;

    this.scope = $scope;

    this.uDataColl = userDataCollection;

	this.pDataColl = propertyDataCollection;
	
    this.propertyDetailsCtrl = propertyDetailsCtrl;

    if (this.uDataColl.currentListView=='') {

        this.uDataColl.currentListView = 'list';
    }

    plc.currentView = this.uDataColl.currentListView;

    if($stateParams.name) {

        this.uDataColl.currentList = $stateParams.name.replace(/-/g,' ');
    }

    if(this.uDataColl.currentList=='All Properties')this.uDataColl.currentListSortOrder='adddate';
    else this.uDataColl.currentListSortOrder='ranking';

    plc.currentList = this.uDataColl.currentList;

    plc.propertyLists = null;

    plc.propertyListCount = 0;

    this.GetLists();

    this.uDataColl.GetTours();

    this.state = $state;

    plc.showExtended = false;

    $state.go('propertylist.'+plc.currentView);

    plc.state = $state;

    plc.modal = $uibModal;

    plc.uDataColl = userDataCollection;

    plc.msgColl = messageCollection;

    plc.authCtrl = AuthenticationCtrl;

    plc.propertyListName = this.uDataColl.currentList;

    plc.sortOrderOptions = this.uDataColl.GetPropertyListSortOrderOptions();

    plc.currentSortOrder = this.uDataColl.currentListSortOrder;

    plc.properties = [];
	
	plc.ExpandDropdown = function(index) {

		console.log(index);

		index++;
		
		if($("propertylist-card:nth-child("+index+") .menu").hasClass("active-dropdown")) {

			$('.menu').removeClass("active-dropdown");
		}
		else{
			$('.menu').removeClass("active-dropdown");

			$("propertylist-card:nth-child("+index+") .menu").addClass("active-dropdown");
		}
	}

    this.scope.showList = false;

	this.GetProperties();

    var that = this;

    PubSub.subscribe("propertylist.setlist",function(msg,data) {

        that.propertyListName = data;

        that.GetProperties();
    });
	
	PubSub.subscribe("propertylist.viewphotos", function (msg, data) {
        that.ViewPhotos({
            tablename: data.idxtable,
            listingid: data.listingid
        });
    });
	
	PubSub.subscribe("propertylist.showdetails", function (msg, data) {

        that.propertyDetailsCtrl.DisplayDetails(data.idxtable, data.listingid, this.properties);
    });

    $(window).off('resize').on('resize', function(){
        if(rea_util.IsNarrow() && !that.scope.isNarrow){
            if(that.state.current.name !== "propertylist.list" && that.state.current.name !== "propertylist.thumbs"){
                that.state.go("propertylist.list");
            }
            that.scope.isNarrow = true;

            if(!$scope.$$phase) {
              //$digest or $apply
                $scope.$apply();
            }
        }else if(!rea_util.IsNarrow() && that.scope.isNarrow){
            that.scope.isNarrow = false;
            if(!$scope.$$phase) {
              //$digest or $apply
                $scope.$apply();
            }
        }
    }).trigger('resize');
}

propertyListCtrl.prototype.GetLists = function() {

    this.uDataColl.GetSavedPropertyLists(function(lists){

        this.propertyLists = lists;

        this.propertyListCount = lists.mylists.length+lists.agentlists.length;

        this.scope.$apply();

    },this);
}

propertyListCtrl.prototype.SwitchList = function() {

        this.uDataColl.currentList = this.currentList;

        PubSub.publish("propertylist.setlist",this.currentList);
}

propertyListCtrl.prototype.ShowDetails = function(property) {
	console.log("show details");
    this.propertyDetailsCtrl.DisplayDetails(property.tablename,property.listingid);
}

propertyListCtrl.prototype.GetProperties = function() {

    this.uDataColl.GetSavedPropertyList(this.propertyListName,this.currentSortOrder, function (properties) {

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

    }, this);
}

propertyListCtrl.prototype.GetTargetPropertyIds = function(property) {

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

propertyListCtrl.prototype.GetTargetLists = function() {

    var clist = [];

    for(var n=0;n<this.uDataColl.lists.mylists.length;n++) {

        if(this.uDataColl.lists.mylists[n].name==this.propertyListName)continue;

        clist.push(this.uDataColl.lists.mylists[n]);
    }

    for(var i=0;i<this.uDataColl.lists.agentlists.length;i++) {

        if(this.uDataColl.lists.agentlists[n].name==this.propertyListName)continue;

        clist.push(this.uDataColl.lists.agentlists[i]);
    }

    return clist;
}

propertyListCtrl.prototype.SelectAll = function() {

    $('property-list-pane .recheckbox input[type="checkbox"]').prop('checked',true);
}

propertyListCtrl.prototype.SelectNone = function() {

    $('property-list-pane .recheckbox input[type="checkbox"]').prop('checked',false);
}

propertyListCtrl.prototype.expand = function(elem) {
	console.log(elem);
	if($(".extended").eq(elem).hasClass("active")){
		$(".extended").eq(elem).removeClass("active");
	} else{
			$(".extended").eq(elem).addClass("active");
	}
	/* var myindex =  $(elem);
    console.log(myindex.parent(".property-photo").parent().find(".extended"));
	myindex.parent(".property-photo").parent().find(".extended").addClass("active"); */
}

propertyListCtrl.prototype.ViewPhotos = function (property) {
	console.log("in view photos function")
    this.pDataColl.GetPhotos(property.tablename, property.listingid, function (data) {

        PubSub.publish("photoviewer.display", {
            images: data.photourls,
            title: data.fulladdress
        });

    }, this);
}

propertyListCtrl.prototype.RequestInfo = function(property) {

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

propertyListCtrl.prototype.SendToAgent = function(propertyIDs,body) {

    this.msgColl.AddPropertyAttachments(null,propertyIDs,body,function(msg) {

        this.state.go('messages');

    },this);
}

propertyListCtrl.prototype.RemoveProperties = function(property) {

    var propertyIDs = this.GetTargetPropertyIds(property);

    if(propertyIDs.length==0)return;

    var that = this;

    var msg = "Are You Sure You Want to Remove This Property ?";

    if(propertyIDs.length>1)msg = "Are You Sure You Want to Remove These Properties ?";

    rea_util.ConfirmAction(msg,'Remove',function(isConfirmed) {

        if(isConfirmed) {

            var props = propertyIDs.join(',');

            that.uDataColl.RemovePropertiesFromList(that.propertyListName,props,function(){

              this.GetProperties();

            },that);
        }
    });
}

propertyListCtrl.prototype.AddToList = function(property) {

    var that = this;

    this.authCtrl.Login(function(result) {

        if(result!='success')return;

        var propertyIDs = that.GetTargetPropertyIds(property);

        if(propertyIDs.length==0)return;

        var targetLists = that.GetTargetLists();

        var title = 'Add To Another List';

        var data = {title:title,targetLists:targetLists,keepInThisList:true};

        var dialogInst = that.modal.open({
            templateUrl: 'propertylists/addtolist.dlg.html',
            controller: 'AddToListDlg',
            size:'md',
            windowClass:'add-to-list',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        dialogInst.result.then(function (result) {

            that.uDataColl.AddPropertyIDsToList(data.targetListName, propertyIDs, false, function () {

                if(!data.keepInThisList) {

                    this.uDataColl.RemovePropertiesFromList(that.propertyListName,propertyIDs,function() {

                        this.GetProperties();

                    },this)
                }

            }, that);

        }, function () {

        });

    },this);
}

propertyListCtrl.prototype.AddToTour = function(property) {

    var that = this;

    this.authCtrl.Login(function(result) {

        if(result!='success')return;

        var propertyIDs = that.GetTargetPropertyIds(property);

        if(propertyIDs.length==0)return;

        var date = new Date();

        var tourdate = (date.getMonth()+1).toString()+'-'+date.getDate();

        var data = {tours:that.uDataColl.tours,name:'',adding:false,newname:'My Tour '+tourdate};

        var dialogInst = that.modal.open({
            templateUrl: 'propertylists/addtotour.dlg.html',
            controller: 'AddToTourDlg',
            size:'md',
            windowClass:'add-to-tour',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        dialogInst.result.then(function (result) {

            var name = data.name;

            if(!name||name=='-1')name = data.newname;

            that.uDataColl.AddToTour(name,propertyIDs,function(tour){

            },that);

        }, function () {

        });

    },this);
}

propertyListCtrl.prototype.SortOrderChanged = function() {

    this.GetProperties();
}

propertyListCtrl.prototype.RankingChanged = function() {

    var ids = [];

    for(var i=0;i<this.properties.length;i++) {

        ids.push(this.properties[i].id);
    }

    var propids = ids.join(',');

    this.uDataColl.UpdateSavedPropertyRanking(this.propertyListName,propids);
}

propertyListCtrl.prototype.UpdateClientComments = function(property) {

    this.uDataColl.UpdateClientComments(property.id,property.clientcomments);
}

propertyListCtrl.prototype.switchListThumb = function() {

     if(this.state.current.name === "propertylist.thumbs"){
        this.scope.showList = false;
     }else if(this.state.current.name === "propertylist.list"){
        this.scope.showList = true;
     }
 }

 //List Pane

 mod.directive("propertylistListPane",propertylistListDir);

 function propertylistListDir() {

     return {
         restrict: "E",
         transclude:true,
         template: '<ng-transclude></ng-transclude>',
         controller: propertylistListCtrl,
         controllerAs:'pllc'
     }
 }

 mod.controller("propertylistListCtrl",['$state','$uibmodal','userDataCollection','messageCollection','AuthenticationCtrl',propertylistListCtrl]);

 function propertylistListCtrl($scope,$state,$uibModal,userDataCollection,messageCollection,AuthenticationCtrl) {

     var pllc = this;

     this.scope = $scope;

     pllc.state = $state;

     pllc.modal = $uibModal;

     pllc.uDataColl = userDataCollection;

     pllc.msgColl = messageCollection;

     pllc.authCtrl = AuthenticationCtrl;

     pllc.propertyListName = this.uDataColl.currentList;

     pllc.sortOrderOptions = this.uDataColl.GetPropertyListSortOrderOptions();

     pllc.currentSortOrder = this.uDataColl.currentListSortOrder;

     pllc.properties = [];

     this.GetProperties();

     var that = this;

     PubSub.subscribe("propertylist.setlist",function(msg,data) {

         that.propertyListName = data;

         that.GetProperties();
     });
 }

 propertylistListCtrl.prototype.GetProperties = function() {

     this.uDataColl.GetSavedPropertyList(this.propertyListName,this.currentSortOrder, function (properties) {

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

     }, this);
 }

 propertylistListCtrl.prototype.GetTargetPropertyIds = function(property) {

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

 propertylistListCtrl.prototype.GetTargetLists = function() {

     var clist = [];

     for(var n=0;n<this.uDataColl.lists.mylists.length;n++) {

         if(this.uDataColl.lists.mylists[n].name==this.propertyListName)continue;

         clist.push(this.uDataColl.lists.mylists[n]);
     }

     for(var i=0;i<this.uDataColl.lists.agentlists.length;i++) {

         if(this.uDataColl.lists.agentlists[n].name==this.propertyListName)continue;

         clist.push(this.uDataColl.lists.agentlists[i]);
     }

     return clist;
 }

 propertylistListCtrl.prototype.SelectAll = function() {

     $('property-list-pane .recheckbox input[type="checkbox"]').prop('checked',true);
 }

 propertylistListCtrl.prototype.SelectNone = function() {

     $('property-list-pane .recheckbox input[type="checkbox"]').prop('checked',false);
 }

 propertylistListCtrl.prototype.RequestInfo = function(property) {

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

 propertylistListCtrl.prototype.SendToAgent = function(propertyIDs,body) {

     this.msgColl.AddPropertyAttachments(null,propertyIDs,body,function(msg) {

         this.state.go('messages');

     },this);
 }

 propertylistListCtrl.prototype.RemoveProperties = function(property) {

     var propertyIDs = this.GetTargetPropertyIds(property);

     if(propertyIDs.length==0)return;

     var that = this;

     var msg = "Are You Sure You Want to Remove This Property ?";

     if(propertyIDs.length>1)msg = "Are You Sure You Want to Remove These Properties ?";

     rea_util.ConfirmAction(msg,'Remove',function(isConfirmed) {

         if(isConfirmed) {

             var props = propertyIDs.join(',');

             that.uDataColl.RemovePropertiesFromList(that.propertyListName,props,function(){

               this.GetProperties();

             },that);
         }
     });
 }

 propertylistListCtrl.prototype.AddToList = function(property) {

     var that = this;

     this.authCtrl.Login(function(result) {

         if(result!='success')return;

         var propertyIDs = that.GetTargetPropertyIds(property);

         if(propertyIDs.length==0)return;

         var targetLists = that.GetTargetLists();

         var title = 'Add To Another List';

         var data = {title:title,targetLists:targetLists,keepInThisList:true};

         var dialogInst = that.modal.open({
             templateUrl: 'propertylists/addtolist.dlg.html',
             controller: 'AddToListDlg',
             size:'md',
             windowClass:'add-to-list',
             resolve: {
                 data: function () {
                     return data;
                 }
             }
         });

         dialogInst.result.then(function (result) {

             that.uDataColl.AddPropertyIDsToList(data.targetListName, propertyIDs, false, function () {

                 if(!data.keepInThisList) {

                     this.uDataColl.RemovePropertiesFromList(that.propertyListName,propertyIDs,function() {

                         this.GetProperties();

                     },this)
                 }

             }, that);

         }, function () {

         });

     },this);
 }

 propertylistListCtrl.prototype.AddToTour = function(property) {

     var that = this;

     this.authCtrl.Login(function(result) {

         if(result!='success')return;

         var propertyIDs = that.GetTargetPropertyIds(property);

         if(propertyIDs.length==0)return;

         var date = new Date();

         var tourdate = (date.getMonth()+1).toString()+'-'+date.getDate();

         var data = {tours:that.uDataColl.tours,name:'',adding:false,newname:'My Tour '+tourdate};

         var dialogInst = that.modal.open({
             templateUrl: 'propertylists/addtotour.dlg.html',
             controller: 'AddToTourDlg',
             size:'md',
             windowClass:'add-to-tour',
             resolve: {
                 data: function () {
                     return data;
                 }
             }
         });

         dialogInst.result.then(function (result) {

             var name = data.name;

             if(!name||name=='-1')name = data.newname;

             that.uDataColl.AddToTour(name,propertyIDs,function(tour){

             },that);

         }, function () {

         });

     },this);
 }

 propertylistListCtrl.prototype.SortOrderChanged = function() {

     this.GetProperties();
 }

 propertylistListCtrl.prototype.RankingChanged = function() {

     var ids = [];

     for(var i=0;i<this.properties.length;i++) {

         ids.push(this.properties[i].id);
     }

     var propids = ids.join(',');

     this.uDataColl.UpdateSavedPropertyRanking(this.propertyListName,propids);
 }

 propertylistListCtrl.prototype.UpdateClientComments = function(property) {

     this.uDataColl.UpdateClientComments(property.id,property.clientcomments);
 }

//Map Pane

mod.directive("propertylistMapPane",propertylistMapDir);

function propertylistMapDir() {

    return {
        restrict: "E",
        scope: {id: "@"},
        controller: propertylistMapCtrl
    }
}

mod.controller("propertylistMapCtrl",['$scope','userDataCollection',propertylistMapCtrl]);

function propertylistMapCtrl($scope,userDataCollection) {

    this.scope = $scope;

    this.uDataColl = userDataCollection;

    this.propertyListName = this.uDataColl.currentList;

    this.propertyMarkers = [];

    this.map = null;

    this.updateMap = true;

    var that = this;

    this.uDataColl.InitializeMap('rea_propertylist_mainmap',function(map){

        that.map = map;

        that.map.addListener('idle', function() {

            if(that.updateMap) {

                that.updateMap = false;

                that.DisplayProperties();
            }
        });

        PubSub.subscribe('propertylistmap.reset', function(){

            that.ResizeMap();
        } );

        PubSub.subscribe('propertylistmap.setlist',function(msg,data) {

            this.propertyListName = this.uDataColl.currentList;

            that.DisplayProperties();
        });

        PubSub.subscribe('propertylistmap.hiliteproperty',function(msg,data) {


        });
    });
}

propertylistMapCtrl.prototype.ResizeMap = function() {

    google.maps.event.trigger(this.map, 'resize');
}

propertylistMapCtrl.prototype.DisplayProperties = function() {

    var houseimage = {
        url: rea_domain+'/app/images/house.svg',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };

    var condoimage = {
        url: rea_domain+'/app/images/condo.svg',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };

    var townhouseimage = {
        url: rea_domain+'/app/images/townhoue.svg',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };

    var landimage = {
        url: rea_domain+'/app/images/land.svg',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };

    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };

    this.ClearPropertyMarkers();

    this.uDataColl.GetSavedPropertyList(this.propertyListName,'ranking', function (properties) {

        this.propertyMarkers = [];

        var bounds = new google.maps.LatLngBounds();

        for(var i=0;i<properties.length;i++) {

            var property = properties[i];

            var image = houseimage;

            if(property.propertytype==20)image=condoimage;
            else if(property.propertytype==30)image=townhouseimage;
            else if(property.propertytype==200)image=landimage;

            var marker = new google.maps.Marker({
                position: {lat: property.lat, lng: property.lng},
                map: this.map,
                icon: image,
                shape:shape,
                title: property.streetaddress,
                zIndex: 100
            });

            property.marker = marker;

            this.propertyMarkers.push(marker);

            bounds.extend(marker.getPosition());
        }

        this.map.fitBounds(bounds);

        this.scope.$apply();

    }, this);
}

propertylistMapCtrl.prototype.ClearPropertyMarkers = function() {

    for (var n = 0; n < this.propertyMarkers.length; n++) {

        this.propertyMarkers[n].marker.setMap(null);
    }

    this.propertyMarkers = [];

}

mod.controller('AddToListDlg', function($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.ok = function () {

        if(!data.targetListName) {

            rea_util.Alert("Please Select A List");

            return;
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.controller('AddToTourDlg', function($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.ok = function () {

        if(!data.adding) {

            if(!data.name||data.name=='') {

                rea_util.Alert("Please Select A Tour");

                return;
            }
        }
        else {

            if(data.newname=='') {

                rea_util.Alert("Please Enter A Name For Tour");

                return;
            }
        }



        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.controller('CreateTourDlg', function($scope, $uibModalInstance, data) {

    $scope.tour = data;

    $scope.ok = function () {

        if(data.name.length==0) {

            rea_util.Alert("Please Enter A Name for Your Tour");

            return;
        }

        for(var n=0;n<data.tours.mytours.length;n++) {

            if(data.name==data.tours.mytours[n]) {

                rea_util.Alert("You Already Have A Tour with That Name");

                return;
            }
        }

        for(var n=0;n<data.tours.agenttours.length;n++) {

            if(data.name==data.tours.agenttours[n]) {

                rea_util.Alert("You Already Have A Tour with That Name");

                return;
            }
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.directive("propertylistCard",propertylistCardDir);

function propertylistCardDir() {

    return {
        restrict: "E",
        templateUrl: 'propertylists/propertycard.tpl.html'
    }
}

mod.directive("propertylistThumbCard",propertyistThumbCardDir);

function propertyistThumbCardDir() {

    return {
        restrict: "E",
        templateUrl: 'propertylists/propertythumbcard.tpl.html'
    }
}

mod.directive('actionDropdown', ['$document', function($document) {
    return {
        restrict: 'E',
        transclude:true,
        template: "<ng-transclude></ng-transclude>",
        link: function(scope, element, attr) {

            scope.isActionDropdownVisible = false;

            scope.toggleActionDropdown = function(){

                scope.isActionDropdownVisible = !scope.isActionDropdownVisible;
            }

            scope.closeActionDropdown = function() {

                scope.isActionDropdownVisible;
            }

            $document.bind('click', function(event){

                var isClickedElementChildOfPopup = element
                        .find(event.target)
                        .length > 0;

                if (isClickedElementChildOfPopup)
                    return;

                scope.isActionDropdownVisible = false;

                scope.$apply();
            });
        }
    };
}])
