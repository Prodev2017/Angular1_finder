var mod = angular.module("searchMod", ['globalServicesMod', 'ui.router', 'ngSanitize', 'ngAnimate', 'ui.bootstrap']);

//Search Pane

mod.directive("searchPane", searchPaneDir);

function searchPaneDir() {

    return {
        restrict: "E",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        controller: searchPaneCtrl,
        controllerAs: 'spc'
    }
}

//to capitalize the name of the city as it's almost always there, but label isn't.

mod.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

mod.controller("searchPaneCtrl", ['$scope', '$stateParams', '$uibModal', 'propertyDataCollection', 'userDataCollection', 'messageCollection','userManager', 'propertyDetailsCtrl', searchPaneCtrl]);

function searchPaneCtrl($scope, $timeout, $state, $stateParams, $uibModal, propertyDataCollection, userDataCollection, messageCollection,userManager,propertyDetailsCtrl) {

    this.state = $state;

    this.timeout = $timeout;

    this.scope = $scope;

    this.modal = $uibModal;

    this.pDataColl = propertyDataCollection;

    this.uDataColl = userDataCollection;

    this.usrMgr = userManager;

    this.msgColl = messageCollection;

    this.propertyDetailsCtrl = propertyDetailsCtrl;

    this.scope.showMap = true;

    if($stateParams.name!=null&&$stateParams!='') {

        if($stateParams.name.includes('=')) {

            this.uDataColl.currentSavedSearchName = '';

            this.pDataColl.SetSearch($stateParams.name);
        }
        else {

            this.uDataColl.currentSavedSearchName = $stateParams.name.replace(/-/g,' ');
        }
    }

    if (this.pDataColl.currentView == '') {

        this.pDataColl.currentView = $stateParams.currentView ? $stateParams.currentView : 'maplist';
    }

    var that = this;

   /* PubSub.subscribe("search.requestinfodialog", function (msg, data) {

        that.RequestInfo({
            tablename: data.idxtable,
            listingid: data.listingid
        });
    });*/

    PubSub.subscribe("search.requestinfo", function (msg, data) {

        that.RequestInfo({
            tablename: data.idxtable,
            listingid: data.listingid
        });
    });

    PubSub.subscribe("search.saveproperty", function (msg, data) {

        console.log("in pubsub save property")
        that.SaveProperty({
            tablename: data.idxtable,
            listingid: data.listingid
        }, data.event);
    });

    PubSub.subscribe("search.viewphotos", function (msg, data) {
        that.ViewPhotos({
            tablename: data.idxtable,
            listingid: data.listingid
        });
    });

    PubSub.subscribe("search.showdetails", function (msg, data) {

        that.propertyDetailsCtrl.DisplayDetails(data.idxtable, data.listingid, this.properties);
    });

    $state.go('search.' + this.pDataColl.currentView);
}

searchPaneCtrl.prototype.RequestInfo = function (property) {

    var data = {
        message: 'Please Send Me More Info On This Property'
    };

    if(!this.usrMgr.email){data.requestCInfo = true;data.showcinfo=true;}

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

        if(data.requestCInfo) {

            that.usrMgr.Register(data.fname,data.lname,data.email,data.phone,'',data.password,function(response) {

                this.SendToAgent(property, data.message);

            },that);
        }
        else that.SendToAgent(property, data.message);

    }, function () {

    });
}

searchPaneCtrl.prototype.SendToAgent = function (property, msg) {

    this.uDataColl.SaveProperty(property.tablename, property.listingid, false, this.uDataColl.currentList, function (property) {

        if (!msg || msg == '') msg = 'Please Provide More Information on This Property';

        this.msgColl.AddPropertyAttachments(null, property.id, msg, function (msg) {

            rea_util.FlashMessage('Your Request Has Been Sent and We will be contacting you soon. <br> You May also Check Your <a ui-sref="messages">Messages</a>',2000);

        }, this);

    }, this);
}

searchPaneCtrl.prototype.SaveProperty = function (property, event) {

    var that = this,
        saveMap = $(event.target).next();
    saveMap.addClass('open');

    that.timeout(function () {
        saveMap.removeClass("open");
    }, 5000);

    this.uDataColl.SaveProperty(property.tablename, property.listingid, false, this.uDataColl.currentList, function (savedproperty) {

        property.savedpropertyid=savedproperty.savedpropertyid;

        that.scope.$apply();

    }, this);
}

searchPaneCtrl.prototype.GetTargetLists = function () {

    var listitems = [];

    var propertyLists = this.uDataColl.GetPropertyLists();

    for (var i = 0; i < propertyLists.length; i++) {

        if (propertyLists[i].propertyListId == this.uDataColl.currentListId) continue;

        var listitem = {};

        listitem.id = propertyLists[i].propertyListId;

        listitem.name = propertyLists[i].name;

        listitems.push(listitem)
    }

    return listitems;
}

searchPaneCtrl.prototype.ViewPhotos = function (property) {

    this.pDataColl.GetPhotos(property.tablename, property.listingid, function (data) {

        PubSub.publish("photoviewer.display", {
            images: data.photourls,
            title: data.fulladdress
        });

    }, this);
}

searchPaneCtrl.prototype.ShowDetailsPanel = function(panel_id) {
    // $(panel_id).collapse();
    $(panel_id).collapse('toggle');
}

//Search Bar

mod.directive("searchBar", searchBarDir);

function searchBarDir() {

    return {
        restrict: "E",
        templateUrl: 'search/searchbar.tpl.html',
        controller: searchBarCtrl,
        controllerAs: 'sbc'
    }
}

mod.controller("searchBarCtrl", ['$scope','$state', '$stateParams', '$uibModal', '$element', '$location', 'propertyDataCollection', 'userDataCollection', 'AuthenticationCtrl', searchBarCtrl]);

function searchBarCtrl($scope,$state, $stateParams, $uibModal, $element, propertyDataCollection, userDataCollection, AuthenticationCtrl) {

    var sbc = this;

    this.scope = $scope;

    this.state = $state;

    this.stateParams = $stateParams;

    

    this.modal = $uibModal;

    this.pDataColl = propertyDataCollection;

    this.uDataColl = userDataCollection;

    this.authCtrl = AuthenticationCtrl;

    this.currentSortOrder = this.pDataColl.currentSortOrder;

    sbc.currentView = this.pDataColl.currentView;

    sbc.currentSavedSearchName = this.uDataColl.currentSavedSearchName;

    sbc.controls = {};

    sbc.controlValues = {};

    sbc.savedSearches = [];

    sbc.lookaheadResults = [];

    sbc.showCriteria = false;

    sbc.showLookup = false;

    sbc.showExtended = false;

    sbc.scope.showMap = true;

    this.lookupText = '';

    this.preEditAreaParams = {};

    this.currentLookahead = {};

    this.displayingSavedSearch = false;

    this.searchBox = $element.find('.search-lookup-box input');

    this.timer = null;

    this.openHouse = false;

    this.scope.price = 'Price';

    this.scope.bedNum = 'Beds';

    this.scope.bathNum = 'Baths';

    this.scope.sqft = 'Sqft';

    this.scope.listinglist = 'No Listing'

    var that = this;

    this.searchBox.on('click', function () {

        this.setSelectionRange(0, this.value.length);

    }).on('keydown', function (e) {

        //var evtobj = window.event? event : e;

        if (that.timer) {

            clearTimeout(that.timer);

            that.timer = null;
        }

        var key = String.fromCharCode(e.keyCode);

        if (e.keyCode == 13 && that.searchBox.val().length == 0) {

            that.showLookup = false;

            that.scope.$apply();

            that.UpdateArea({});

            return;
        }

        if (key == 8 || key == 46) return;

        that.lookupText = that.searchBox.val() + key.toLowerCase();

        if (that.lookupText.length > 2) {

            that.timer = setTimeout(function () {

                that.pDataColl.LookupArea(that.lookupText, null, that.AreaLookaheadCallback, that);

            }, 500);
        } else if (that.showLookup) {

            that.showLookup = false;

            that.scope.$apply();
        }
    });

    $(document).mouseup(function (e) {

        if (!sbc.showLookup) return;

        var container = $('#rea_search_areas');

        if (!container.is(e.target) && container.has(e.target).length === 0) {
            sbc.showLookup = false;

            $scope.$apply();
        }
    });

    PubSub.subscribe("search.triggersearch", function (msg, data) {

        if (that.currentSavedSearchName != null && that.currentSavedSearchName != '') {

            that.SetSavedSearch(that.currentSavedSearchName);

        } else {

            that.UpdateSearch('pubsub');
        }
    });

    PubSub.subscribe("search.setarea", function (msg, data) {

        that.SetArea(data);
    });

    PubSub.subscribe("search.switchMobile", function (msg, data) {
        that.scope.isNarrow = data.isNarrow;
        if(that.state.current.name !== "search.maplist"){
            that.state.go('search.maplist');
        }
    });

    PubSub.subscribe("update.listingToSearchBar", function(msg, data){
        if(data.listingIDList.length==0){
           that.scope.listinglist = 'No Listings'; 
       } else {
            that.scope.listinglist = data.listingIDList.length+' Listings' ;
       }
       that.scope.$apply();
    });

    this.pDataColl.GetSearchControls(function(controls,initialValues) {
        let that = this;

        this.controls = controls;
      
        this.controlValues = this.pDataColl.GetControlValues();

        Object.keys(this.controlValues).map(function(key, index){
            that.controlValues[key] = that.stateParams[key] ? that.stateParams[key].replace(/-/g, ' ') : that.controlValues[key]
        });
        console.log(this.stateParams.label)
       
        this.stateParams.label ? this.pDataColl.currentAreaParams.label = this.stateParams.label.replace(/-/g, ' ') : null;
        this.stateParams.category ? this.pDataColl.currentAreaParams[this.stateParams.category.replace(/-/g,'').toLowerCase()] = this.stateParams.label.replace(/-/g, ' ').toLowerCase() : null;
        this.stateParams.state ? this.pDataColl.currentAreaParams.community = this.stateParams.community.replace(/-/g, ' ').toLowerCase() : null;
        this.stateParams.streetname ? this.pDataColl.currentAreaParams.streetname =  this.stateParams.streetname.replace(/-/g, ' ').toLowerCase() : null;
        this.stateParams.streetdesignation ? this.pDataColl.currentAreaParams.streetdesignation = this.stateParams.streetdesignation.replace(/-/g, ' ').toLowerCase() : null;
        this.stateParams.city ?  this.pDataColl.currentAreaParams.city = this.stateParams.city.replace(/-/g, ' ').toLowerCase() : null;
        this.stateParams.state ? this.pDataColl.currentAreaParams.state = this.stateParams.state.replace(/-/g, ' ').toLowerCase() : null;


      
        this.uDataColl.GetSavedSearches(function (searches) {
          
            this.savedSearches = searches;

            this.scope.$apply();

        }, this)

    }, this)
}

searchBarCtrl.prototype.ModifyPropertyTypes = function(list, propertyType) {

    if(list[propertyType.value]===true) {

        list[propertyType.value] = false;
    }
    else  {

        list[propertyType.value] = true;
    }

    this.UpdateSearch();
}

searchBarCtrl.prototype.SetPropertyTypes = function (propertyTypes) {

    this.uDataColl.currentPropertyTypes = propertyTypes;

    this.SetCriterium('propertytypes', propertyTypes);
}

searchBarCtrl.prototype.ResetCriteria = function () {

    this.controlValues = this.pDataColl.ResetSearch();
    this.UpdateSearch();
}

searchBarCtrl.prototype.closeCriteria = function () {
    $(event.target).parents('[uib-popover-template-popup]').siblings('button').click()
}

searchBarCtrl.prototype.OpenhouseToggle = function () {

    this.openHouse = !this.openHouse;

    this.controlValues.nextopenhouse = this.openHouse ? "7" : "0";

    this.UpdateSearch();
}

searchBarCtrl.prototype.SetArea = function (area) {

    if (area.local) {

        var that = this;

        navigator.geolocation.getCurrentPosition(function (position) {

            var bounds = (position.coords.latitude + 1.0).toString() + ',' + (position.coords.longitude + 1.0).toString();

            bounds += ',' + (position.coords.latitude - 1.0).toString() + ',' + (position.coords.longitude - 1.0).toString();

            that.pDataColl.currentAreaParams = {};

            that.pDataColl.currentAreaParams.bounds = bounds;

            that.pDataColl.currentAreaParams.label = 'Listings Near Me';

            that.searchBox.val('Listings Near Me');

            that.UpdateSearch();
        });
    }
    else {

        this.pDataColl.currentAreaParams = area;

        if (area.label) this.searchBox.val(area.label);
        else this.searchBox.val('');

        this.UpdateSearch();
    }
}

searchBarCtrl.prototype.UpdateArea = function (area) {

    if (area == null || rea_util.IsEmptyObject(area)) {

        this.uDataColl.currentSavedSearchName = '';

        this.pDataColl.currentAreaParams = {};

        this.searchBox.val('');
    } else {

        this.uDataColl.currentSavedSearchName = '';

        this.pDataColl.currentAreaParams = area.query;

        if (area.label) {

            this.searchBox.val(area.label);

            this.pDataColl.currentAreaParams.label = area.label;
        } else this.searchBox.val('');
    }

    if (this.showLookup) {

        this.showLookup = false;
    }
    
    
    this.UpdateSearch();
    this.state.go(this.state.current,{  category : area.category ? area.category.replace(/ /g, '-') : null,
                                        label : area.label ? area.label.replace(/ /g, '-') : null,
                                        streetname : area.query.streetname ? area.query.streetname.replace(/ /g, '-') : null, 
                                        streetdesignation : area.query.streetdesignation ? area.query.streetdesignation.replace(/ /g, '-') : null, 
                                        state : area.query.state ? area.query.state.replace(/ /g, '-') : null, 
                                        city:area.query.city ? area.query.city.replace(/ /g, '-') : null, 
                                        community : area.query.community ? area.query.community.replace(/ /g, '-') : null
                                        }, {notify : false})
    
}

searchBarCtrl.prototype.AreaLookaheadCallback = function (response) {

    this.lookaheadResults = response;

    this.showLookup = true;

    this.scope.$apply();
}

searchBarCtrl.prototype.SetSavedSearch = function (name) {

    var savedSearch = this.FindSavedSearch(name);
    
    if (savedSearch == null) return;

    this.pDataColl.SetSearch(savedSearch.query);

    this.controlValues = this.pDataColl.GetControlValues();

    if (this.pDataColl.currentAreaParams.label) this.searchBox.val(this.pDataColl.currentAreaParams.label);

    this.displayingSavedSearch = true;

 
    this.UpdateSearch();

 
}

searchBarCtrl.prototype.SetSearch = function (query) {

    this.SetPropertyTypes(query.propertytypes);

    this.SetArea(query.area);

    this.SetCriteria(query.criteria);

    this.UpdateSearch('set');
    
}

searchBarCtrl.prototype.switchMapListView = function () {
    this.scope.showMap = !this.scope.showMap;
    PubSub.publish('search.switchMapList',{showMap: this.scope.showMap});
}

searchBarCtrl.prototype.prettifyPrice = function(price) {
    if(!isNaN(price)) {
        price = parseInt(price)/1000;
        return price >= 1000 ? price/1000+"m" : price+"k";
    }
}

searchBarCtrl.prototype.searchPrice = function(){

    if(parseInt(this.controlValues.minlistprice)  > parseInt(this.controlValues.maxlistprice)) {
            var temp = this.controlValues.minlistprice;
            this.controlValues.minlistprice = this.controlValues.maxlistprice;
            this.controlValues.maxlistprice = temp;         
    }
    this.UpdateSearch();
}

searchBarCtrl.prototype.searchBed = function(){

    if(parseInt(this.controlValues.minbeds)  > parseInt(this.controlValues.maxbeds)){
            var temp = this.controlValues.minbeds;
            this.controlValues.minbeds = this.controlValues.maxbeds;
            this.controlValues.maxbeds = temp;           
    }
   
    this.UpdateSearch();
}

searchBarCtrl.prototype.searchBath = function(){

    if(parseInt(this.controlValues.minbeds)  > parseInt(this.controlValues.maxbeds)){
            var temp = this.controlValues.minbaths;
            this.controlValues.minbaths = this.controlValues.maxbaths;
            this.controlValues.maxbaths = temp;   
    }

    this.UpdateSearch();
}

searchBarCtrl.prototype.searchSqft = function(){

    if(parseInt(this.controlValues.minsqft)  > parseInt(this.controlValues.maxsqft)){
            var temp = this.controlValues.minsqft;
            this.controlValues.minsqft = this.controlValues.maxsqft;
            this.controlValues.maxsqft = temp;
    }
    
    this.UpdateSearch();
}

searchBarCtrl.prototype.UpdateSearch = function (loc) {
 
    let that = this; 

    if (this.displayingSavedSearch) {

        this.displayingSavedSearch = false;
    }
    else {

        this.currentSavedSearchName = '';

        this.uDataColl.currentSavedSearchName = '';
    }

    this.pDataColl.UpdateSearchQuery(this.controlValues);

    if(this.pDataColl.currentAreaParams.label) {

        this.searchBox.val(this.pDataColl.currentAreaParams.label);
    }

    if (this.pDataColl.currentView.includes('map')) {

        if (rea_util.IsEmptyObject(this.pDataColl.currentAreaParams)) {

            this.searchBox.val('Current Map Area');
        }

        PubSub.publish('map.updatelistingquery', {
            area: this.pDataColl.currentAreaParams,
            filter: this.pDataColl.currentFilterParams,
            propertyTypes: this.pDataColl.currentPropertyTypes
        });
    }
    else {

        if (rea_util.IsEmptyObject(this.pDataColl.currentAreaParams)) {

            this.searchBox.val('All Areas');
        }

        PubSub.publish('list.updatelistingquery', {
            area: this.pDataColl.currentAreaParams,
            filter: this.pDataColl.currentFilterParams,
            propertyTypes: this.pDataColl.currentPropertyTypes
        });
    }

    if (this.pDataColl.HasQuery()) this.uDataColl.RegisterActivity('SearchedProperties', this.pDataColl.SearchQuery());

   

    var currentParams = this.pDataColl.currentAreaParams;
    //damn you shallow copy, we need newParams and to Params to avoid leak
    newParams = {}
    Object.keys(currentParams).map(function(key, index){
     
        newParams[key] = currentParams ? currentParams[key].replace(/ /g, '-') : null;
    })
    console.log("this.controlvalues")
    console.log(this.controlValues)
    console.log(currentParams)
    console.log(newParams)
    
    toParams = Object.assign({},newParams, this.controlValues);
    console.log(toParams)
    
    
    this.state.go(this.state.current, toParams ,{notify : false, inherit : false})
    console.log(this.stateParams)
    
   
    
}

searchBarCtrl.prototype.SaveSearch = function (name) {

    var that = this;

    this.authCtrl.Login(function (result) {

        if (result != 'success') return;

        if (name == null || name == '') {

            if (that.searchBox.val() != '') name = that.searchBox.val();
            else name = 'My Search';
        }

        var data = {
            name: name
        };

        var dialogInst = that.modal.open({
            templateUrl: 'search/savesearch.dlg.html',
            controller: 'SaveSearchDlg',
            size: 'md',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        dialogInst.result.then(function (result) {

            var savedSearch = that.FindSavedSearch(data.name);

            if (savedSearch != null) {

                rea_util.ConfirmAction("A Search With That Name Already Exists. Overwrite ?", 'OverWrite', function (isConfirmed) {

                    if (!isConfirmed) {

                        return;
                    }

                    that.DoSaveSearch(data.name);
                });
            } else {

                that.DoSaveSearch(data.name);
            }

        }, function () {

        });

    }, this);
}

searchBarCtrl.prototype.DoSaveSearch = function (name) {

    var that = this;

    var query = {};

    for (var attrname in that.pDataColl.currentAreaParams) {
        query[attrname] = that.pDataColl.currentAreaParams[attrname];
    }

    for (var attrname in that.pDataColl.currentFilterParams) {
        query[attrname] = that.pDataColl.currentFilterParams[attrname];
    }

    that.uDataColl.SaveSearch(name, that.pDataColl.currentPropertyTypes, query, function (search) {

        for (var i = 0; i < this.savedSearches.mysearches.length; i++) {

            if (this.savedSearches.mysearches[i].name == name) {

                that.savedSearches.mysearches[i] = search;

                return;
            }
        }

        that.savedSearches.mysearches.push(search);

    }, that);
}

searchBarCtrl.prototype.FindSavedSearch = function (name) {

    name = name.toLowerCase();

    for (var i = 0; i < this.savedSearches.mysearches.length; i++) {

        if (this.savedSearches.mysearches[i].name.toLowerCase() == name) {

            return this.savedSearches.mysearches[i];
        }
    }

    for (var i = 0; i < this.savedSearches.agentsearches.length; i++) {

        if (this.savedSearches.agentsearches[i].name.toLowerCase() == name) {

            return this.savedSearches.agentsearches[i];
        }
    }

    return null;
}

//Search Results List Pane

mod.directive("searchListPane", searchListDir);

function searchListDir() {

    return {
        restrict: "E",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        controller: searchListCtrl,
        controllerAs: 'slc'
    }
}

mod.controller("searchListCtrl", ['$uibModal', '$state', '$scope', '$anchorScroll', 'propertyDetailsCtrl', 'propertyDataCollection', 'userDataCollection', 'PropertyDetailsCtrl', searchListCtrl]);

function searchListCtrl($uibModal, $state, $scope, $anchorScroll, propertyDetailsCtrl, propertyDataCollection, userDataCollection) {

    var slc = this;

    this.state = $state;

    this.modal = $uibModal;

    this.scope = $scope;

    this.anchorScroll = $anchorScroll;

    this.pDataColl = propertyDataCollection;

    this.uDataColl = userDataCollection;

    this.propertyDetailsCtrl = propertyDetailsCtrl;

    this.includesMap = this.pDataColl.currentView.includes('map');

    this.currentPropertyTypes = {};

    this.currentAreaParams = {};

    this.currentFilterParams = {};

    this.pageSize = 50;

    this.totalListings = 0;

    this.scrollListingID = null;

    this.hiliteListingID = null;

    this.listingCountString  ='';

    this.currentPage = 1;

    this.currentAreaLabel = '';

    slc.currentSortOrder = 'listprice desc';

    slc.sortOrderOptions = [

        {
            name: 'Price Hi-Lo',
            id: 'listprice desc'
        },
        {
            name: 'Price Lo-Hi',
            id: 'listprice'
        },
        {
            name: 'Beds Hi-Lo',
            id: 'beds desc'
        },
        {
            name: 'Beds Lo-Hi',
            id: 'beds'
        },
        {
            name: 'Baths Hi-Lo',
            id: 'baths desc'
        },
        {
            name: 'Baths Lo-Hi',
            id: 'baths'
        },
        {
            name: 'SqFt Hi-Lo',
            id: 'sqft desc'
        },
        {
            name: 'Sqft Lo-Hi',
            id: 'sqft'
        },
        {
            name: 'DOM Hi-Lo',
            id: 'dom desc'
        },
        {
            name: 'DOM Lo-Hi',
            id: 'dom'
        },
        {
            name: 'PPSqFt Hi-Lo',
            id: 'ppsqft desc'
        },
        {
            name: 'PPSqFT Lo-Hi',
            id: 'ppsqft'
        }
    ];

    slc.lists = [];

    slc.listingIDs = [];

    slc.properties = [];

    slc.currentSaveLocation = this.uDataColl.currentList;

    slc.domain = rea_domain;

    this.prevSaveLocation = slc.currentSaveLocation;

    var that = this;

    this.uDataColl.GetSavedPropertyLists(this.UpdatePropertyLists, this);

    PubSub.subscribe('list.updatelistingquery', function (msg, data) {

        if(!that.ShowingList())return;

        that.UpdateListingsQuery(data);
    });

    PubSub.subscribe('list.scrolltolisting', function (msg, data) {

        if(!that.ShowingList())return;

        that.ScrollToListing(data.idxtable, data.listingid);
    });

    if (this.ShowingList()&&!this.pDataColl.currentView.includes('map'))  {

        PubSub.publish("search.triggersearch", {});
    }
}

searchListCtrl.prototype.SetListingCount = function () {

    var count =  this.totalListings;

    PubSub.publish("update.listingToSearchBar", {listingIDList: this.listingIDs});

    if(count==0)return 'No Listings';

    if (count == 1) return '1 Listing';

    if(count<this.pageSize)return count + ' Listings';

    this.listingCountString = this.pageSize +' of ' + count +  ' Listings';

    //this.scope.$apply();
}

searchListCtrl.prototype.UpdateListingsQuery = function (data) {

    this.currentPropertyTypes = data.propertyTypes;

    this.currentAreaParams = data.area;

    this.currentFilterParams = data.filter;

    if(!this.pDataColl.currentView.includes('map')) {

        this.pDataColl.GetListingCount(this.SearchQuery(), this.currentPropertyTypes,this.UpdateListingsCallback,this);
    }
    else this.pDataColl.GetListingIDs(this.SearchQuery(), this.currentPropertyTypes, this.currentSortOrder, this.UpdateListingIDsCallback, this);
}

searchListCtrl.prototype.SearchQuery = function () {

    var query = {};

    for (var attrname in this.currentAreaParams) {
        query[attrname] = this.currentAreaParams[attrname];
    }

    for (var attrname in this.currentFilterParams) {
        query[attrname] = this.currentFilterParams[attrname];
    }

    return query;
}

searchListCtrl.prototype.NumPages = function () {

    var numPages = Math.floor(this.totalListings / this.pageSize);

    if (numPages * this.pageSize < this.totalListings) numPages++;

    return numPages;
}

searchListCtrl.prototype.UpdateListingIDsCallback = function (data) {

    this.listingIDs = data;

    this.totalListings = data.length;

    this.SetListingCount();

    this.DisplayListingsPage(1);
}

searchListCtrl.prototype.UpdateListingsCallback = function (data) {

    this.totalListings = data.count;

    this.SetListingCount();

    this.DisplayListingsPage(1);
}

searchListCtrl.prototype.DisplayListingsPage = function (page) {

    if (this.totalListings == 0) {

        this.properties = [];

        this.scope.$apply();

        return;
    }

    page = Math.floor(page);

    var numPages = this.NumPages();

    if (page < 1 || page > numPages) return;

    if(!this.pDataColl.currentView.includes('map')) {

        var query = this.SearchQuery();

        query.propertytypes = this.currentPropertyTypes;

        query.sort = this.currentSortOrder;

        query.pagenum = page;
        
        query.pagesize = this.pageSize;

        this.pDataColl.GetListings(query,this.UpdatePropertiesCallback,this);

        this.currentPage = page;
    }
    else {

        this.startIndex = (page - 1) * this.pageSize;

        this.endIndex = page * this.pageSize;

        if (this.endIndex > this.listingIDs.length) this.endIndex = this.listingIDs.length;

        var ids = '';

        for (var k = this.startIndex; k < this.endIndex; k++) {

            if (ids != '') {

                ids += ',';
            }

            ids += this.listingIDs[k].listingid;
        }

        var query = 'listingids=' + ids + '&propertytypes=' + this.currentPropertyTypes + '&sort=' + this.currentSortOrder;

        this.pDataColl.GetListings(query, this.UpdatePropertiesCallback, this);

        this.currentPage = page;
    }
}

searchListCtrl.prototype.UpdatePropertyLists = function (data) {

    this.lists = [];

    for (var i = 0; i < data.mylists.length; i++) {

        this.lists.push(data.mylists[i].name);
    }

    this.currentSaveLocation = this.uDataColl.currentList;

    this.prevSaveLocation = this.currentSaveLocation;

    this.scope.$apply();
}

searchListCtrl.prototype.UpdatePropertiesCallback = function (data) {

    this.properties = data;

    this.scope.$apply();

    if (this.scrollListingID) {

        this.anchorScroll('rea_search_property_id_' + this.scrollListingID);

        this.scrollListingID = null;
    }
}

searchListCtrl.prototype.ShowDetails = function (property) {

	
    var url = this.state.href('listingdetailspage', {
        property: property
    });

    this.propertyDetailsCtrl.DisplayDetails(property.tablename, property.listingid, this.properties);
}

searchListCtrl.prototype.ZoomToListing = function (property) {

    PubSub.publish("map.zoomtolisting", property);
}

searchListCtrl.prototype.ScrollToListing = function (idxtable, listingid) {

    if (this.listingIDs == null || this.listingIDs.length == 0) {

        this.properties = [];

        return;
    }

    for (var i = 0; i < this.listingIDs.length; i++) {

        if (this.listingIDs[i].listingid == listingid) {

            this.scrollListingID = listingid;

            this.hiliteListingID = listingid;

            var page = i / this.pageSize + 1;

            this.DisplayListingsPage(page);

            return;
        }
    }
}

searchListCtrl.prototype.ShowOnMap = function (property) {

    PubSub.publish("map.showonmap", property);

    this.hiliteListingID = property.listingid;
}

searchListCtrl.prototype.ChangeSortOrder = function (newSortOrder) {

    this.currentSortOrder = newSortOrder;

    this.pDataColl.currentSortOrder = this.currentSortOrder;

    this.pDataColl.GetListingIDs(this.SearchQuery(), this.currentPropertyTypes, this.currentSortOrder, this.UpdateListingIDsCallback, this);
}

searchListCtrl.prototype.SaveLocationChanged = function () {

    if (this.currentSaveLocation == -1) this.NewList();
    else {
        this.prevSaveLocation = this.currentSaveLocation;

        this.uDataColl.currentList = this.currentSaveLocation;
    }
}

searchListCtrl.prototype.NewList = function () {

    var data = {
        name: '',
        lists: this.lists
    };

    var dialogInst = this.modal.open({
        templateUrl: 'myhomefinder/createlist.dlg.html',
        controller: 'CreateListDlg',
        size: 'md',
        resolve: {
            data: function () {
                return data;
            }
        }
    })

    var that = this;

    dialogInst.result.then(function (result) {

        that.uDataColl.AddSavedPropertyList(data.name, function () {

            this.currentSaveLocation = data.name;

            this.prevSaveLocation = data.name;

            this.uDataColl.GetSavedPropertyLists(this.UpdatePropertyLists, this);

        }, that);

    }, function () {

        that.currentSaveLocation = that.prevSaveLocation;
    });
}

searchListCtrl.prototype.ShowingList = function() {

    return this.pDataColl.currentView.includes('list')||this.pDataColl.currentView.includes('thumb');
}

//Search Results Table Pane

mod.directive("tablePane", searchTableDir);

function searchTableDir() {

    return {
        restrict: "E",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        controller: searchTableCtrl,
        controllerAs: 'stc'
    }
}

mod.controller("searchTableCtrl", ['$uibModal', '$scope', 'propertyDetailsCtrl', 'propertyDataCollection', 'userDataCollection', 'PropertyDetailsCtrl', searchTableCtrl]);

function searchTableCtrl($uibModal, $state,$scope, propertyDetailsCtrl, propertyDataCollection, userDataCollection) {

    var stc = this;

    this.state = $state;

    this.modal = $uibModal;

    this.scope = $scope;

    this.pDataColl = propertyDataCollection;

    this.uDataColl = userDataCollection;

    this.propertyDetailsCtrl = propertyDetailsCtrl;

    this.includesMap = this.pDataColl.currentView.includes('map');

    this.currentPropertyTypes = {};

    this.currentAreaParams = {};

    this.currentFilterParams = {};

    this.pageSize = 50;

    this.totalListings = 0;

    this.hiliteListingID = null;

    this.currentPage = 1;

    this.currentAreaLabel = '';

    stc.currentSortOrder = 'listprice desc';

    stc.currentSortOrderColumn = 'price';

    stc.currentSortOrderDir = 1;

    stc.lists = [];

    stc.columnNames = [

        'Address',
        'City',
        'Price',
        'Beds',
        'Baths',
        'SqFt',
        'Year Built',
        '$/SqFt',
        'DOM',
        'Lot Size',
        'Fees'
    ];

    stc.listingIDs = [];

    stc.rows = [];

    stc.currentSaveLocation = this.uDataColl.currentList;

    this.properties = [];

    this.prevSaveLocation = stc.currentSaveLocation;

    var that = this;

    this.uDataColl.GetSavedPropertyLists(this.UpdatePropertyLists, this);

    PubSub.subscribe('list.updatelistingquery', function (msg, data) {

        if(!that.ShowingTable())return;

        that.UpdateListingsQuery(data);
    });

    PubSub.subscribe('list.scrolltolisting', function (msg, data) {

        if(!that.ShowingTable())return;

        that.ScrollToListing(data.idxtable, data.listingid);
    });

    if (this.ShowingTable()&&!this.pDataColl.currentView.includes('map')) {

        PubSub.publish("search.triggersearch", {});
    }
}

searchTableCtrl.prototype.SetListingCount = function () {

    var count =  this.totalListings;

    PubSub.publish("update.listingToSearchBar", {listingIDList: this.listingIDs});

    if(count==0)return 'No Listings';

    if (count == 1) return '1 Listing';

    if(count<this.pageSize)return count + ' Listings';

    this.listingCountString = this.pageSize +' of ' + count +  ' Listings';

    //this.scope.$apply();
}

searchTableCtrl.prototype.UpdateListingsQuery = function (data) {

    this.currentPropertyTypes = data.propertyTypes;

    this.currentAreaParams = data.area;

    this.currentFilterParams = data.filter;

    if(!this.pDataColl.currentView.includes('map')) {

        this.pDataColl.GetListingCount(this.SearchQuery(), this.currentPropertyTypes,this.UpdateListingsCallback,this);
    }
    else this.pDataColl.GetListingIDs(this.SearchQuery(), this.currentPropertyTypes, this.currentSortOrder, this.UpdateListingIDsCallback, this);

    if (this.currentAreaParams.local && !this.currentAreaParams.bounds && navigator.geolocation) {

        var that = this;

        navigator.geolocation.getCurrentPosition(function (position) {

            that.currentAreaLabel = "Properties Near Me";

            var bounds = (position.coords.latitude - 1.0).toString() + ',' + (position.coords.longitude - 1.0).toString();

            bounds += (position.coords.latitude + 1.0).toString() + ',' + (position.coords.longitude + 1.0).toString();

            that.currentAreaParams.bounds = bounds;

            that.pDataColl.GetListingIDs(that.SearchQuery(), that.currentPropertyTypes, that.currentSortOrder, that.UpdateListingIDsCallback, that);
        });

    } else {

        this.pDataColl.GetListingIDs(this.SearchQuery(), this.currentPropertyTypes, this.currentSortOrder, this.UpdateListingIDsCallback, this);
    }
}

searchTableCtrl.prototype.SearchQuery = function () {

    var query = {};

    for (var attrname in this.currentAreaParams) {
        query[attrname] = this.currentAreaParams[attrname];
    }

    for (var attrname in this.currentFilterParams) {
        query[attrname] = this.currentFilterParams[attrname];
    }

    return query;
}

searchTableCtrl.prototype.NumPages = function () {

    var numPages = Math.floor(this.totalListings / this.pageSize);

    if (numPages * this.pageSize < this.totalListings) numPages++;

    return numPages;
}

searchTableCtrl.prototype.UpdateListingIDsCallback = function (data) {

    this.listingIDs = data;

    this.totalListings = data.length;

    this.SetListingCount();

    this.DisplayListingsPage(1);
}

searchTableCtrl.prototype.UpdateListingsCallback = function (data) {

    this.totalListings = data.count;

    this.SetListingCount();

    this.DisplayListingsPage(1);
}

searchTableCtrl.prototype.DisplayListingsPage = function (page) {

    if (this.totalListings == 0) {

        this.properties = [];

        this.rows = [];

        this.scope.$apply();

        return;
    }

    page = Math.floor(page);

    var numPages = this.NumPages();

    if (page < 1 || page > numPages) return;

    if(!this.pDataColl.currentView.includes('map')) {

        var query = this.SearchQuery();

        query.propertytypes = this.currentPropertyTypes;

        query.sort = this.currentSortOrder;

        query.pagenum = page;

        query.pagesize = this.pageSize;

        this.pDataColl.GetListings(query,this.UpdatePropertiesCallback,this);

        this.currentPage = page;
    }
    else {

        this.startIndex = (page - 1) * this.pageSize;

        this.endIndex = page * this.pageSize;

        if (this.endIndex > this.listingIDs.length) this.endIndex = this.listingIDs.length;

        var ids = '';

        for (var k = this.startIndex; k < this.endIndex; k++) {

            if (ids != '') {

                ids += ',';
            }

            ids += this.listingIDs[k].listingid;
        }

        var query = 'listingids=' + ids + '&propertytypes=' + this.currentPropertyTypes + '&sort=' + this.currentSortOrder;

        this.pDataColl.GetListings(query, this.UpdatePropertiesCallback, this);

        this.currentPage = page;
    }
}

searchTableCtrl.prototype.UpdatePropertiesCallback = function (data) {

    this.properties = data;

    this.rows = [];

    for (var i = 0; i < data.length; i++) {

        var property = data[i];

        var columns = [];

        columns.push(property.address);
        columns.push(property.city);
        columns.push('$' + rea_util.ThousandsDelimit(property.listprice));
        columns.push(property.beds);
        columns.push(property.baths);
        columns.push(property.sqft);
        columns.push(property.yearbuilt);
        columns.push('$' + Math.round(property.ppsqft));
        columns.push(property.dom);
        columns.push(property.lotsize);
        columns.push(property.hoafees);

        this.rows.push(columns);
    }

    this.scope.$apply();
}

searchTableCtrl.prototype.UpdatePropertyLists = function (data) {

    this.lists = [];

    for (var i = 0; i < data.mylists.length; i++) {

        this.lists.push(data.mylists[i].name);
    }

    this.currentSaveLocation = this.uDataColl.currentList;

    this.prevSaveLocation = this.currentSaveLocation;

    this.scope.$apply();
}

searchTableCtrl.prototype.ViewDetails = function (index) {

    var property = this.FindProperty(index);

    if (property) {

        this.propertyDetailsCtrl.DisplayDetails(property.tablename, property.listingid);
    }
}

searchTableCtrl.prototype.RequestInfo = function (index) {

    var property = this.FindProperty(index);

    if (property) {

        PubSub.publish("search.requestinfo", {
            idxtable: property.tablename,
            listingid: property.listingid
        })
    }
}

searchTableCtrl.prototype.ZoomToListing = function (index) {

    var property = this.FindProperty(index);

    if (property) {

        PubSub.publish("map.zoomtolisting", property);
    }
}

searchTableCtrl.prototype.ShowOnMap = function (index) {

    if(!this.includesMap)return;

    var property = this.FindProperty(index);

    if (property) {

        PubSub.publish("map.showonmap", property);

        this.hiliteListingID = property.listingid;
    }
}

searchTableCtrl.prototype.SaveProperty = function (index) {

    var property = this.FindProperty(index);

    if (property) {

        PubSub.publish("search.saveproperty", {
            idxtable: property.tablename,
            listingid: property.listingid,
            listname: this.uDataColl.currentSaveLocation
        })
    }
}

searchTableCtrl.prototype.ScrollToListing = function (idxtable, listingid) {

    if (this.listingIDs == null || this.listingIDs.length == 0) {

        this.properties = [];

        return;
    }

    for (var i = 0; i < this.listingIDs.length; i++) {

        if (this.listingIDs[i].listingid == listingid) {

            this.scrollListingID = listingid;

            this.hiliteListingID = listingid;

            var page = i / this.pageSize + 1;

            this.DisplayListingsPage(page);

            return;
        }
    }
}

searchTableCtrl.prototype.SortOrderChanged = function (columnName) {

    var sortorder = 'listprice';

    switch (columnName.toLowerCase()) {

        case 'address':
            sortorder = 'streetaddress';
            break;
        case 'city':
            sortorder = 'city';
            break;
        case 'price':
            sortorder = 'listprice';
            break;
        case 'beds':
            sortorder = 'beds';
            break;
        case 'baths':
            sortorder = 'baths';
            break;
        case 'sqft':
            sortorder = 'sqft'
            break;
        case '$/sqft':
            sortorder = 'ppsqft';
            break;
        case 'hoa fees':
            sortorder = 'hoafees';
            break;
        case 'lot size':
            sortorder = 'lotsize';
            break;
    }

    var dir = this.currentSortOrderDir;

    if (sortorder != this.currentSortOrderColumn) {

        dir = 0;
    } else {

        if (dir == 0) dir = 1;
        else dir = 0;
    }

    this.currentSortOrderColumn = sortorder;

    this.currentSortOrderDir = dir;

    this.currentSortOrder = sortorder;

    if (dir == 1) this.currentSortOrder += ' desc';

    this.pDataColl.currentSortOrder = this.currentSortOrder;

    this.pDataColl.GetListingIDs(this.SearchQuery(), this.currentPropertyTypes, this.currentSortOrder, this.UpdateListingIDsCallback, this);
}

searchTableCtrl.prototype.SaveLocationChanged = function () {

    if (this.currentSaveLocation == -1) this.NewList();
    else {
        this.prevSaveLocation = this.currentSaveLocation;

        this.uDataColl.currentList = this.currentSaveLocation;
    }
}

searchTableCtrl.prototype.NewList = function () {

    var data = {
        name: '',
        lists: this.lists
    };

    var dialogInst = this.modal.open({
        templateUrl: 'myhomefinder/createlist.dlg.html',
        controller: 'CreateListDlg',
        size: 'md',
        resolve: {
            data: function () {
                return data;
            }
        }
    })

    var that = this;

    dialogInst.result.then(function (result) {

        that.uDataColl.AddSavedPropertyList(data.name, function () {

            this.currentSaveLocation = data.name;

            this.prevSaveLocation = data.name;

            this.uDataColl.GetSavedPropertyLists(this.UpdatePropertyLists, this);

        }, that);

    }, function () {

        that.currentSaveLocation = that.prevSaveLocation;
    });
}

searchTableCtrl.prototype.IsSaved = function (index) {

    return this.properties[index].savedpropertyid != 0;
}

searchTableCtrl.prototype.FindProperty = function (index) {

    if (index > this.properties.length) return null;

    return this.properties[index];
}

searchTableCtrl.prototype.ShowingTable = function() {

    return this.pDataColl.currentView.includes('table');
}

//Property Card

mod.directive("searchPropertyCard", searchPropertyCardDir);

function searchPropertyCardDir() {

    return {
        restrict: "E",
        templateUrl: 'search/propertycard.tpl.html'
    }
}

//Thumbs Property Card

mod.directive("searchThumbCard", searchThumbCardDir);

function searchThumbCardDir() {

    return {
        restrict: "E",
        templateUrl: 'search/propertythumbcard.tpl.html',
    }
}

//Search Results Map Pane

mod.directive("mapPane", searchMapDir);

function searchMapDir() {

    return {
        restrict: "E",
        scope: {
            id: "@"
        },
        controller: searchMapCtrl,
        controllerAs: 'smc'
    }
}

mod.controller("searchMapCtrl", ['$scope', 'propertyDataCollection', searchMapCtrl]);

function searchMapCtrl($scope, propertyDataCollection) {

    this.scope = $scope;

    this.pDataColl = propertyDataCollection;

    this.showAllListings = true;

    this.currentPropertyTypes = {};

    this.currentAreaParams = {};

    this.currentFilterParams = {};

    this.showLabels = true;

    this.clusterData = [];

    this.clusterProperties = null;

    this.polygon = null;

    this.circle = null;

    this.backgroundPolys = [];

    this.editor = null;

    this.updateMap = false;

    this.clusterDetails = null;

    this.initialized = false;

    this.selListingID = null;

    this.selIDXTable = null;

    this.preEditAreaParams = null;

    this.preEditShowAllListings = null;

    this.viewportBox = null;

    this.ShowAllListingsButton(false);

    this.scope.isMobile = false;

    this.scope.showMap = true;

    this.dragged = false;

    this.map = null;

    var that = this;

    this.pDataColl.InitializeMap('rea_search_mainmap', function (map) {

        that.map = map;

        that.layerIndex=0;

        that.map.addListener('mousemove', function (event) {

            if(!that.IsVisible())return;

            var zoom = that.map.getZoom();

            $('#rea_latlng').html(event.latLng.lat().toFixed(6) + ' , ' + event.latLng.lng().toFixed(6) + '  ' + zoom);
        });

        that.map.addListener('bounds_changed', function () {

            if(!that.IsVisible())return;

            var bounds = that.map.getBounds();

            if(bounds.getNorthEast().lat()==bounds.getSouthWest().lat()) {

                return;
            }

            that.updateMap = true;
        });

        that.map.addListener('zoom_changed', function () {

            if(!that.IsVisible())return;

            that.dragged = false;
        });

        that.map.addListener('dragend', function() {

            if(!that.IsVisible())return;

             that.dragged = true;
        } );

        that.map.addListener('idle', function () {

            if(!that.IsVisible())return;

            if (!that.initialized) {

                that.initialized = true;

                that.updateMap = false;

                PubSub.publish("search.triggersearch", {});
            }
            else if (that.updateMap) {

                that.updateMap = false;

                that.UpdateListings(false);
            }
        });

        $('#rea_search_mainmap').on('mouseenter', function () {

            that.CloseDetailsPopup();
        });

        $('.btn-map-layer').on('click', function (e) {
			console.log('requests');
			$('.popover ul li').removeClass('active');
			$('.popover ul li').eq(that.layerIndex).addClass('active');
			if($('.btn-map-layer img').hasClass('layer-caret')){
				$('.btn-map-layer img').removeClass('layer-caret');
			}
			else{
				$('.btn-map-layer img').addClass('layer-caret');
			}
		});

        that.map.addListener('click', function (e) {

            if(!that.IsVisible())return;

            if ($(e.target).closest('#re_search_map_details').length === 0) {

                that.CloseDetailsPopup();
            }

            that.DeSelectCluster();
        });

        PubSub.subscribe('map.reset', function () {

            that.ResizeMap();
        });

        PubSub.subscribe('map.updatelistingquery', function (msg, data) {

            if(!that.IsVisible())return;

            that.UpdateListingsQuery(data);
        });

        PubSub.subscribe('map.showproperty', function (msg, data) {

            if(!that.IsVisible())return;

            that.DisplayProperty(data);
        });
    });

    PubSub.subscribe('map.createpolygon', function (msg, data) {

        if (that.pDataColl.currentAreaParams.pcoords || that.pDataColl.currentAreaParams.custom) {

            that.EditPolygon(that.pDataColl.currentAreaParams.label, that.polygon.getPath().getArray());
        } else that.CreatePolygon();
    });

    PubSub.subscribe('map.createradius', function (msg, data) {

        if (that.pDataColl.currentAreaParams.radius) {

            var center = that.circle.getCenter();

            that.EditRadius(that.pDataColl.currentAreaParams.label, that.circle.getRadius() * 0.000621371, center);
        } else that.CreateRadius();
    });

    PubSub.subscribe('map.saveeditarea', function (msg, data) {

        that.SaveEditArea();
    });

    PubSub.subscribe('map.canceleditarea', function (msg, data) {

        that.CancelEditArea();
    });

    PubSub.subscribe('map.removeeditarea', function (msg, data) {

        that.RemoveEditArea();
    });

    PubSub.subscribe('map.redoeditarea', function (msg, data) {

        that.RedoEditArea();
    });

    PubSub.subscribe('map.showonmap', function (msg, property) {

        if(!that.IsVisible())return;

        that.DisplayProperty(property);
    });

    PubSub.subscribe('map.zoomtolisting', function (msg, property) {

        that.ZoomToListing(property);
    });

    PubSub.subscribe('map.zoomout', function (msg) {

        var zoom = that.map.getZoom();

        zoom = zoom-3;

        if(zoom<0)zoom = 0;

        that.map.setZoom(zoom);
    });

    PubSub.subscribe('map.zoomin', function (msg) {

        var zoom = that.map.getZoom();

        zoom = zoom+3;

        if(zoom>22)zoom=22;

        that.map.setZoom(zoom);
    });

    PubSub.subscribe('map.zoomout1',function(msg) {

        var zoom = that.map.getZoom();

        if(zoom>1)that.map.setZoom(zoom-1);
    });

    PubSub.subscribe('map.zoomin1',function(msg) {

        var zoom = that.map.getZoom();

        if(zoom<22)that.map.setZoom(zoom+1);
    });

    PubSub.subscribe('map.changeMapType', function (msg,data) {
		that.layerIndex=data['index'];
		that.map.setMapTypeId(data['type']);
		console.log(data['index']);
		
		
		$( ".btn-map-layer" ).trigger('click');
		
		
        
    });

    PubSub.subscribe('map.togglealllistings',function(msg,property) {

        that.SetAllListings(!that.showAllListings);

        that.UpdateListings(false);
    });

    PubSub.subscribe('map.toggleareas', function (msg) {

        that.ToggleAreas()
    });

    PubSub.subscribe('map.clearareas', function (msg) {

        that.CancelEditArea();

        PubSub.publish("search.setarea", {});

    });

    var timeoutID;

    $(window).off('resize').on('resize', function(){
        if(rea_util.IsNarrow() && !that.scope.isNarrow){
            that.scope.isNarrow = true;
            PubSub.publish('search.switchMobile',{isNarrow: true});
        }else if(!rea_util.IsNarrow() && that.scope.isNarrow){
            that.scope.isNarrow = false;
            PubSub.publish('search.switchMobile',{isNarrow: false});
        }
    }).trigger('resize');
}

searchMapCtrl.prototype.IsVisible = function() {

    return this.pDataColl.currentView.includes('map');
}

searchMapCtrl.prototype.UpdateListingsQuery = function (data) {

    this.currentPropertyTypes = data.propertyTypes;

    var local = false;

    if (data.area == null || rea_util.IsEmptyObject(data.area) || (data.area.local && !navigator.geolocation)) {

        this.ShowAllListingsButton(false);

        this.SetAllListings(true);

        this.currentAreaParams = {};
    } else {

        this.SetAllListings(false);

        this.ShowAllListingsButton(true);

        this.currentAreaParams = data.area;
    }

    if (!local) {

        this.currentFilterParams = data.filter;

        this.areaBoundsRect = null;

        this.UpdateListings(true);
    }

    this.DisplayToggleAreas(false);
}

searchMapCtrl.prototype.UpdateListings = function (newArea) {

    this.updateMap = false;

    var searchQuery = this.SearchQuery();

    this.pDataColl.GetMapClusters(searchQuery, this.currentPropertyTypes, this.map.getZoom(), newArea, this.UpdateListingsCallback, this);

    if (this.pDataColl.currentView != 'map') {

        var area = this.AreaQuery();

        PubSub.publish('list.updatelistingquery', {
            area: area,
            filter: this.FilterQuery(),
            propertyTypes: this.currentPropertyTypes
        });
    }
}

searchMapCtrl.prototype.UpdateListingsCallback = function (results, newArea) {

    this.ClearClusters(this.dragged);

    var selectedPoint = false;

    var clusters = results.clusters;

    for (var n = 0; n < clusters.length; n++) {

        var tcluster = clusters[n];

        if(tcluster.count==1&&this.dragged&&this.clusterProperties[tcluster.listinginfo.listingid]) {

            continue;
        }

        var cluster = new MapCluster(this, this.map, tcluster, this.showLabels);

        this.clusterData.push(cluster);

        if (cluster.count == 1 && this.selIDXTable && this.selListingID) {

            if (this.listinginfo.idxtable == this.selIDXTable && this.listinginfo.listingid == this.selListingID) {

                cluster.select(true);

                this.SetCenter(cluster.lat, cluster.lng);

                selectedPoint = true;
            }
        }
    }

    this.dragged = false;

    this.clusterProperties = null;

    this.selIDXTable = null;

    this.selListingID = null;

    if (!newArea) return;

    this.ClearAreas();

    if (this.showAllListings) return;

    if (results.poly != null) {

        this.DisplayPolygon(results.poly);
    } else if (results.polys != null) {

        var polyOptions = {
            strokeColor: "#f33536",
            strokeWeight: 3,
            strokeOpacity: 0.9,
            strokePosition: google.maps.StrokePosition.OUTSIDE,
            fillColor: "#f33536",
            fillOpacity: 0.1,
            zIndex: 10,
            clickable: false
        };

        for (var n = 0; n < results.polys.length; n++) {

            var polygon = new google.maps.Polygon(polyOptions);

            var poly = results.polys[n];

            polygon.setPaths(poly);

            polygon.setMap(this.map);

            this.polyData.push(polygon);
        }
    } else if (this.pDataColl.currentAreaParams.radius) {

        this.DisplayCircle(this.pDataColl.currentAreaParams.radius);
    }

    if (results.bounds && !selectedPoint && !this.showAllListings) {

        if (results.bounds[0].lat == results.bounds[1].lat || results.bounds[0].lng == results.bounds[1].lng) {

            this.SetCenter(results.bounds[0].lat, results.bounds[0].lng);
        } else {

            var bounds = new google.maps.LatLngBounds(

                new google.maps.LatLng(results.bounds[0].lat, results.bounds[0].lng),
                new google.maps.LatLng(results.bounds[1].lat, results.bounds[1].lng)
            );

            this.FitToBoundary(bounds);
        }
    }
}

searchMapCtrl.prototype.DisplayProperty = function (property) {

    if(!this.pDataColl.currentView.includes('map'))return;

    this.ClearDetails();

    for (var n = 0; n < this.clusterData.length; n++) {

        var cluster = this.clusterData[n];

        if (cluster.count == 1 && cluster.listinginfo.listingid == property.listingid) {

            this.DisplayDetails(cluster, true);

            return;
        }
    }

    this.DisplayMiniPropertyDetails(property);
}

searchMapCtrl.prototype.SetCenter = function (lat, lng) {

    this.map.setCenter(new google.maps.LatLng(lat, lng));
}

searchMapCtrl.prototype.ClearClusters = function (keepProperties) {

    this.clusterProperties = {};

    var retainedClusterData = [];

    for (var i = 0; i < this.clusterData.length; i++) {

        var cluster = this.clusterData[i];

        if(keepProperties&&cluster.data.count==1) {

            this.clusterProperties[cluster.data.listinginfo.listingid] = 1;

            retainedClusterData.push(cluster);
        }
        else cluster.hide();
    }

    if(keepProperties)this.clusterData = retainedClusterData;
    else this.clusterData = [];
}

searchMapCtrl.prototype.DisplayPolygon = function (poly) {

    var polyOptions = {
        strokeColor: "#f33536",
        strokeWeight: 3,
        strokeOpacity: 0.9,
        strokePosition: google.maps.StrokePosition.OUTSIDE,
        fillColor: "#f33536",
        fillOpacity: 0.1,
        zIndex: 10,
        clickable: false
    };

    this.polygon = new google.maps.Polygon(polyOptions);

    this.polygon.setPaths(poly.coords);

    this.polygon.setMap(this.map);

    this.DisplayToggleAreas(true);
}

searchMapCtrl.prototype.DisplayCircle = function (radius) {

    var circleOpts = {

        strokeColor: "#6bcfe5",
        strokeWeight: 3,
        strokeOpacity: 0.9,
        strokePosition: google.maps.StrokePosition.OUTSIDE,
        fillOpacity: 0.1,
        zIndex: 30,
        clickable: false
    };

    var metersPerMile = 1609.344;

    this.ClearAreas();

    this.circle = new google.maps.Circle(circleOpts);

    var parts = radius.split(',');

    this.circle.setCenter(new google.maps.LatLng(parts[1], parts[2]));

    this.circle.setRadius(metersPerMile * parts[0]);

    this.circle.setMap(this.map);

    this.DisplayToggleAreas(true);
}

searchMapCtrl.prototype.ClearAreas = function () {

    if (this.circle) {

        this.circle.setMap(null);

        this.circle = null;
    }

    if (this.polygon) {

        this.polygon.setMap(null);

        this.polygon = null;
    }
}

searchMapCtrl.prototype.ShowAreas = function (show) {

    if (show) {
        if (this.circle) {

            this.circle.setMap(this.map);
        }

        if (this.polygon) {

            this.polygon.setMap(this.map);
        }

        $('#rea_search_map_toggleareas_button').html('Hide Areas');
    } else {

        if (this.circle) {

            this.circle.setMap(null);
        }

        if (this.polygon) {

            this.polygon.setMap(null);
        }

        $('#rea_search_map_toggleareas_button').html('Show Areas');
    }
}

searchMapCtrl.prototype.ToggleAreas = function (show) {

    if (this.circle) {

        if (this.circle.getMap()) this.ShowAreas(false);
        else this.ShowAreas(true);
    }

    if (this.polygon) {

        if (this.polygon.getMap()) this.ShowAreas(false);
        else this.ShowAreas(true);
    }
}

searchMapCtrl.prototype.DisplayToggleAreas = function (show) {

    if (show) $('#rea_search_map_toggleareas_button').show();
    else $('#rea_search_map_toggleareas_button').hide();

    $('#rea_search_map_toggleareas_button').html('Hide Areas');
}

searchMapCtrl.prototype.ClearBackgroundPolygons = function () {

    for (var i = 0; i < this.backgroundPolys.length; i++) {

        this.backgroundPolys[i].setMap(null);
    }

    this.backgroundPolys = [];
}

searchMapCtrl.prototype.SearchQuery = function () {

    var query = {};

    if (!this.showAllListings) {

        var areaparams;

        if (this.editor) {

            areaparams = this.GetEditorAreaParams();
        } else {

            areaparams = this.currentAreaParams;
        }

        for (var attrname in areaparams) {
            query[attrname] = areaparams[attrname];
        }
    } else {

        query.bounds = this.BoundsRectString();
    }

    for (var attrname in this.currentFilterParams) {
        query[attrname] = this.currentFilterParams[attrname];
    }

    return query;
}

searchMapCtrl.prototype.AreaQuery = function () {

    var query = {};

    if (!this.showAllListings) {

        var areaparams;

        if (this.editor) {

            areaparams = this.GetEditorAreaParams();
        }
        else {

            areaparams = this.currentAreaParams;
        }

        for (var attrname in areaparams) {

            query[attrname] = areaparams[attrname];
        }
    }
    else {

        query.bounds = this.BoundsRectString();

        query.label = 'Current Map Area';
    }

    return query;
}

searchMapCtrl.prototype.FilterQuery = function () {

    var filterParams = this.currentFilterParams;

    //if(this.showAllListings)filterParams.bounds = this.BoundsRectString();

    return filterParams;
}

searchMapCtrl.prototype.BoundsRectString = function () {

    var bounds = this.map.getBounds();

    if (!bounds) {

        return "";
    }

    var n = bounds.getNorthEast().lat();

    var e = bounds.getNorthEast().lng();

    var s = bounds.getSouthWest().lat();

    var w = bounds.getSouthWest().lng();

    //this.DrawBoundsRect();

    if(n==s)console.log('getBounds returning n=s');
    if(e==w)console.log('getBounds returning e=w');

    return n + ',' + e + ',' + s + ',' + w;
}

searchMapCtrl.prototype.DrawBoundsRect = function (rect) {

    var bounds = null;

    if (rect) {

        bounds = rect;
    } else {

        bounds = this.map.getBounds();
    }

    var ne = bounds.getNorthEast();

    var sw = bounds.getSouthWest();

    var viewportPoints = [
        ne, new google.maps.LatLng(ne.lat(), sw.lng()),
        sw, new google.maps.LatLng(sw.lat(), ne.lng()), ne
    ];

    /*strokeOpacity = 0 , if don't want to show the border moving. */

    if (this.viewportBox) this.viewportBox.setMap(null);

    this.viewportBox = new google.maps.Polyline({
        path: viewportPoints,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });

    this.viewportBox.setMap(this.map);

}

searchMapCtrl.prototype.IsInBoundary = function (lat, lng) {

    var bounds = this.map.getBounds();

    if (!bounds) return false;

    var latlng = new google.maps.LatLng(lat, lng);

    return bounds.contains(latlng);
}

searchMapCtrl.prototype.FitToBoundary = function (boundsRect) {

    var ne = boundsRect.getNorthEast();

    var sw = boundsRect.getSouthWest();

    if (ne.lat() == sw.lat() || ne.lng() == sw.lng()) {

        this.map.setCenter(boundsRect.getCenter());

        this.map.setZoom(16);
    } else {

        this.map.fitBounds(boundsRect);
    }
}

searchMapCtrl.prototype.Contains = function (rect) {

    if (rect == null) return true;

    var boundsRect = this.map.getBounds();

    if (boundsRect.contains(rect.getNorthEast()) && boundsRect.contains(rect.getSouthWest())) return true;

    return false;
}

searchMapCtrl.prototype.ResizeMap = function () {

    google.maps.event.trigger(this.map, 'resize');
}

searchMapCtrl.prototype.CloseDetailsPopup = function () {

    if (this.clusterDetails && this.clusterDetails.type != 2) {

        this.clusterDetails.hide();

        this.clusterDetails = null;
    }
}

searchMapCtrl.prototype.DeSelectCluster = function () {

}

searchMapCtrl.prototype.ShowClusterLabels = function (show) {

    if (show) {

        for (var i = 0; i < this.clusterData.length; i++) {

            this.clusterData[i].show();
        }
    } else {

        for (var i = 0; i < this.clusterData.length; i++) {

            this.clusterData[i].hide();
        }
    }

}

searchMapCtrl.prototype.ToggleAllListings = function () {

    this.showAllListings = !this.showAllListings;

    this.UpdateListings();
}

searchMapCtrl.prototype.ZoomToListing = function (property) {

    if(!this.pDataColl.currentView.includes('map'))return;

    if (!property.lat || !property.lng) return;

    this.selIDXTable = property.tablename;

    this.selListingID = property.listingid;

    this.map.setCenter({
        lat: property.lat,
        lng: property.lng
    });

    this.map.setZoom(17);
}

searchMapCtrl.prototype.ShowAllListingsButton = function (show) {

    if (show) $('#rea_search_map_alllistings_button').show();
    else $('#rea_search_map_alllistings_button').hide();
}

searchMapCtrl.prototype.SetAllListings = function (all) {

    if (all) {

        this.showAllListings = true;

        $('#rea_search_map_alllistings_button').html('<span><img src="images/map-icons/polygonarea.svg"></span>Show Area');
    } else {

        this.showAllListings = false;

        $('#rea_search_map_alllistings_button').html('<span><img src="images/map-icons/mapicons.svg"></span>Show All');
    }
}

searchMapCtrl.prototype.ShowEditorPopup = function (title, name, showReplace, showDelete) {

    $('#rea_search_map_editarea_popup .title').html(title);

    if (!name) name = 'My Area';

    $('#rea_search_map_editarea_popup input').val(name);

    if (showReplace) {

        $('#rea_search_map_editarea_popup .replace').show();
    } else {
        $('#rea_search_map_editarea_popup .replace').hide();
    }

    if (showDelete) {

        $('#rea_search_map_editarea_popup .delete').show();
    } else {
        $('#rea_search_map_editarea_popup .delete').hide();
    }

    $('#rea_search_map_editarea_popup').show();
}

searchMapCtrl.prototype.OnChangeEditArea = function () {

    this.UpdateListings();
};

searchMapCtrl.prototype.GetEditorAreaParams = function () {

    var params = {};

    if (this.editor != null) {

        if (this.editor.coords) {

            var pcoords = '';

            for (var i = 0; i < this.editor.coords.length; i++) {

                var latlng = this.editor.coords[i];

                pcoords += "|" + latlng.lat() + "," + latlng.lng();
            }

            if (pcoords.length > 2) pcoords = pcoords.substring(1);

            params.pcoords = pcoords;
        }

        if (this.editor.getRadius) {

            var rad = this.editor.getRadius();

            var latlng = this.editor.getCenter();

            params.radius = rad + "," + latlng.lat() + "," + latlng.lng();
        }

        if (this.editor.label != null) {

            params.label = this.editor.label;
        }
    }

    return params;
}

searchMapCtrl.prototype.CreatePolygon = function (name) {

    if (this.editor != null) {

        rea_util.Alert('Please Save or Delete Current Area Before Creating a New One');

        return;
    }

    if (this.currentAreaParams.pcoords || this.currentAreaParams.custom) {

        this.EditPolygon();

        return;
    }

    var polygonOpts = {

        strokeOpacity: 0.9,
        strokeWeight: 4,
        fillOpacity: 0.1,
        zIndex: 20,
        clickable: false,
        strokeColor: "#6bcfe5"
    };

    if (!this.editor) this.ShowEditorPopup('Click and Drag Corner Markers to Change Area<br>Click and Drag Center Marker to Move Center', name, true, false);

    var latDiff = this.map.getBounds().getNorthEast().lat() - this.map.getBounds().getSouthWest().lat();

    var lngDiff = this.map.getBounds().getNorthEast().lng() - this.map.getBounds().getSouthWest().lng();

    var bounds = new google.maps.LatLngBounds(

        new google.maps.LatLng(this.map.getBounds().getSouthWest().lat() + (latDiff / 3), this.map.getBounds().getSouthWest().lng() + (lngDiff / 3)),
        new google.maps.LatLng(this.map.getBounds().getSouthWest().lat() + (latDiff * 2 / 3), this.map.getBounds().getSouthWest().lng() + (lngDiff * 2 / 3))
    );

    if (!this.editor) {

        this.preEditAreaParams = this.pDataColl.currentAreaParams;

        this.preEditShowAllListings = this.showAllListings;
    }

    var that = this;

    var onChangeEditArea = function () {
        that.OnChangeEditArea();
    };

    this.SetAllListings(false);

    this.editor = new PolygonEditor(this.map, polygonOpts, 10000, "images", onChangeEditArea);
}

searchMapCtrl.prototype.EditPolygon = function (name, coords) {

    if (this.editor != null) {

        rea_util.Alert('Please Save or Delete Current Area Before Creating a New One');

        return;
    }

    var polygonOpts = {

        strokeOpacity: 0.9,
        strokeWeight: 4,
        fillOpacity: 0.1,
        zIndex: 20,
        clickable: false,
        strokeColor: "#6bcfe5"
    };

    if (!this.editor) this.ShowEditorPopup('Click and Drag Corner Markers to Change Area<br>Click and Drag Center Marker to Move Center', name, true, true);

    var latDiff = this.map.getBounds().getNorthEast().lat() - this.map.getBounds().getSouthWest().lat();

    var lngDiff = this.map.getBounds().getNorthEast().lng() - this.map.getBounds().getSouthWest().lng();

    var bounds = new google.maps.LatLngBounds(

        new google.maps.LatLng(this.map.getBounds().getSouthWest().lat() + (latDiff / 3), this.map.getBounds().getSouthWest().lng() + (lngDiff / 3)),
        new google.maps.LatLng(this.map.getBounds().getSouthWest().lat() + (latDiff * 2 / 3), this.map.getBounds().getSouthWest().lng() + (lngDiff * 2 / 3))
    );

    if (!this.editor) {

        this.preEditAreaParams = this.pDataColl.currentAreaParams;

        this.preEditShowAllListings = this.showAllListings;
    }

    var that = this;

    var onChangeEditArea = function () {
        that.OnChangeEditArea();
    };

    this.SetAllListings(false);

    this.editor = new PolygonEditor(this.map, polygonOpts, 10000, "images", onChangeEditArea, coords);
}

searchMapCtrl.prototype.CreateRadius = function (name, center) {

    if (this.editor != null) {

        rea_util.Alert('Please Save or Delete Current Area Before Creating a New One');

        return;
    }

    var circleOpts = {

        strokeOpacity: 0.9,
        strokeWeight: 4,
        fillOpacity: 0.1,
        zIndex: 20,
        clickable: false,
        strokeColor: "#6bcfe5"
    };


    if (!this.editor) this.ShowEditorPopup('Click and Drag Marker on Circle to Change Radius<br>Click and Drag Center Marker to Move Center', name, false, false);

    var d = googleMapUtil.distanceBetweenPoints(this.map.getBounds().getSouthWest(), this.map.getBounds().getNorthEast()) / 7;

    var radius = d > 2 ? Math.round(d) : d;

    if (center == null) {
        center = this.map.getCenter();
    }

    var that = this;

    var onChangeEditArea = function () {
        that.OnChangeEditArea();
    };

    if (!this.editor) this.preEditAreaParams = this.pDataColl.currentAreaParams;

    this.SetAllListings(false);

    this.editor = new RadiusEditor(this.map, center, radius, circleOpts, "images", onChangeEditArea);
}

searchMapCtrl.prototype.EditRadius = function (name, radius, center) {

    if (this.editor != null) {

        rea_util.Alert('Please Save or Delete Current Area Before Creating a New One');

        return;
    }

    var circleOpts = {

        strokeOpacity: 0.9,
        strokeWeight: 4,
        fillOpacity: 0.1,
        zIndex: 20,
        clickable: false,
        strokeColor: "#6bcfe5"
    };


    if (!this.editor) this.ShowEditorPopup('Click and Drag Marker on Circle to Change Radius<br>Click and Drag Center Marker to Move Center', name, true, true);

    if (center == null) {
        center = this.map.getCenter();
    }

    var that = this;

    var onChangeEditArea = function () {
        that.OnChangeEditArea();
    };

    if (!this.editor) this.preEditAreaParams = this.pDataColl.currentAreaParams;

    this.SetAllListings(false);

    this.editor = new RadiusEditor(this.map, center, radius, circleOpts, "images", onChangeEditArea);
}

searchMapCtrl.prototype.SaveEditArea = function () {

    if (this.editor == null) return;

    var name = $('#rea_search_map_editarea_popup input').val();

    if (!name || name == '') {

        rea_util.alert('Please Enter A Name For Your Area');

        return;
    }

    var areaParams = this.GetEditorAreaParams();

    areaParams.label = name;

    this.editor.remove();

    this.editor = null;

    $('#rea_search_map_editarea_popup').hide();

    PubSub.publish("search.setarea", areaParams);
}

searchMapCtrl.prototype.CancelEditArea = function () {

    if (this.editor) {

        this.editor.remove();

        this.editor = null;
    }

    $('#rea_search_map_editarea_popup').hide();

    this.pDataColl.currentAreaParams = this.preEditAreaParams;

    this.SetAllListings(this.preEditShowAllListings);

    this.UpdateListings(true);
}

searchMapCtrl.prototype.RedoEditArea = function () {

    var type = 'radius';

    if (this.editor) {

        if (this.editor.coords) type = 'poly';

        this.editor.remove();

        this.editor = null;
    }

    this.pDataColl.currentAreaParams = this.preEditAreaParams;

    this.UpdateListings(false);

    if (type == 'poly') this.CreatePolygon('', true);
    else this.CreateRadius('', null, true);
}

searchMapCtrl.prototype.RemoveEditArea = function (restart) {

    if (this.editor) {

        this.editor.remove();

        this.editor = null;
    }

    this.ClearAreas();

    $('#rea_search_map_editarea_popup').hide();

    this.pDataColl.currentAreaParams = {};

    PubSub.publish("search.setarea", {
        label: 'Current Map Area'
    });

    this.SetAllListings(true);

    this.UpdateListings(true);
}

searchMapCtrl.prototype.DisplayDetails = function (cluster, scrolllist) {

    if(this.clusterDetails)this.ClearDetails();

    if (cluster.count > 1) return;

    if (scrolllist) PubSub.publish('list.scrolltolisting', {
        listingid: cluster.listinginfo.listingid,
        idxtable: cluster.listinginfo.idxtable
    });

    var listing = cluster.listinginfo;

    this.pDataColl.GetListingGeneralDetails(listing.idxtable,listing.listingid, function (data) {

        this.clusterDetails = new ClusterDetails(this.map, cluster, 2);

        this.clusterDetails.html = $('#rea_search_map_details_popup').html();

        if(data.savedpropertyid)this.clusterDetails.html = this.clusterDetails.html.replace('#savedpropertyid', data.savedpropertyid);

        this.clusterDetails.html = this.clusterDetails.html.replace('#listingid', data.listingid);

        this.clusterDetails.html = this.clusterDetails.html.replace('#address', data.address);

        this.clusterDetails.html = this.clusterDetails.html.replace('#city', data.city);

        this.clusterDetails.html = this.clusterDetails.html.replace('#state', data.state);

        this.clusterDetails.html = this.clusterDetails.html.replace('#postalcode', data.postalcode);

        this.clusterDetails.html = this.clusterDetails.html.replace('#listprice', '$' + rea_util.ThousandsDelimit(data.listprice));

        this.clusterDetails.html = this.clusterDetails.html.replace('#beds', data.beds);

        this.clusterDetails.html = this.clusterDetails.html.replace('#baths', data.baths);

        this.clusterDetails.html = this.clusterDetails.html.replace('#sqft', data.sqft);

        this.clusterDetails.html = this.clusterDetails.html.replace('#lotsize', data.lotsize);

        this.clusterDetails.html = this.clusterDetails.html.replace('#yearbuilt', data.yearbuilt);

        this.clusterDetails.html = this.clusterDetails.html.replace('#ppsqft', '$' + Math.round(data.ppsqft));

        this.clusterDetails.html = this.clusterDetails.html.replace('#dom', data.dom);

        this.clusterDetails.html = this.clusterDetails.html.replace('#imagelink', rea_domain + data.firstphotourl);

        this.clusterDetails.html = this.clusterDetails.html.replace('#propertytype', data.propertytype);

        this.clusterDetails.data = data;

        this.clusterDetails.html = this.clusterDetails.html.replace('#viewphotos', "PubSub.publish('search.viewphotos',{idxtable:'" + listing.idxtable + "',listingid:'" + listing.listingid + "'});");

        this.clusterDetails.html = this.clusterDetails.html.replace('#requestinfo', "PubSub.publish('search.requestinfo',{idxtable:'" + listing.idxtable + "',listingid:'" + listing.listingid + "'});");

        if(!data.savedpropertyid)this.clusterDetails.html = this.clusterDetails.html.replace('#saveproperty', "PubSub.publish('search.saveproperty',{idxtable:'" + listing.idxtable + "',listingid:'" + listing.listingid + "',event");

        this.clusterDetails.html = this.clusterDetails.html.replace('#showdetails', "PubSub.publish('search.showdetails',{idxtable:'" + listing.idxtable + "',listingid:'" + listing.listingid + "'});");

        var title = '$' + data.listprice + ' &nbsp;&nbsp;&nbsp;' + data.address + ' ' + data.city + ',' + data.state;

        this.clusterDetails.html = this.clusterDetails.html.replace('#showphotos', "PubSub(map.showphotos,{listingid:'" + listing.listingid + "',idxtable:'" + listing.idxtable + "'});");

        this.clusterDetails.html = this.clusterDetails.html.replace('#showphotos', "PubSub(map.showphotos,{listingid:'" + listing.listingid + "',idxtable:'" + listing.idxtable + "'});");

        this.clusterDetails.show();

        }, this);
}

searchMapCtrl.prototype.DisplayMiniDetails = function (cluster, scrolllist) {

    if(this.clusterDetails)this.ClearDetails();

    if (cluster.count > 1) return;

    if (scrolllist) PubSub.publish('list.scrolltolisting', {
        listingid: cluster.listinginfo.listingid,
        idxtable: cluster.listinginfo.idxtable
    });

    var listing = cluster.listinginfo;

    this.clusterDetails = new ClusterDetails(this.map, cluster, 1);

    this.clusterDetails.html = $('#rea_search_map_minidetails_popup').html();

    this.clusterDetails.html = this.clusterDetails.html.replace('#photo', rea_domain + listing.firstphotourl);

    this.clusterDetails.html = this.clusterDetails.html.replace('#address', listing.address);

    this.clusterDetails.html = this.clusterDetails.html.replace('#city', listing.city);

    this.clusterDetails.html = this.clusterDetails.html.replace('#state', listing.state);

    this.clusterDetails.html = this.clusterDetails.html.replace('#postalcode', listing.postalcode);

    this.clusterDetails.html = this.clusterDetails.html.replace('#listprice', '$' + listing.listprice);

    this.clusterDetails.html = this.clusterDetails.html.replace('#beds', listing.beds);

    this.clusterDetails.html = this.clusterDetails.html.replace('#baths', listing.baths);

    this.clusterDetails.html = this.clusterDetails.html.replace('#sqft', listing.sqft);

    this.clusterDetails.show();
}

searchMapCtrl.prototype.DisplayMiniPropertyDetails = function (property) {

    if(this.clusterDetails)this.ClearDetails();

    if (!this.IsInBoundary(property.lat, property.lng)) {

        this.SetCenter(property.lat, property.lng);
    }

    var cluster = {
        count: 1,
        lat: property.lat,
        lng: property.lng
    };

    this.clusterDetails = new ClusterDetails(this.map, cluster, 1);

    this.clusterDetails.html = $('#rea_search_map_minidetails_popup').html();

    this.clusterDetails.html = this.clusterDetails.html.replace('#photo', rea_domain+property.firstphotourl);

    this.clusterDetails.html = this.clusterDetails.html.replace('#address', property.address);

    this.clusterDetails.html = this.clusterDetails.html.replace('#city', property.city);

    this.clusterDetails.html = this.clusterDetails.html.replace('#state', property.state);

    this.clusterDetails.html = this.clusterDetails.html.replace('#postalcode', property.postalcode);

    this.clusterDetails.html = this.clusterDetails.html.replace('#listprice', '$' + rea_util.ThousandsDelimit(property.listprice));

    this.clusterDetails.html = this.clusterDetails.html.replace('#beds', property.beds);

    this.clusterDetails.html = this.clusterDetails.html.replace('#baths', property.baths);

    this.clusterDetails.html = this.clusterDetails.html.replace('#sqft', property.sqft);

    this.clusterDetails.show();
}

searchMapCtrl.prototype.ClearDetails = function () {

    if(this.clusterDetails) {

        this.clusterDetails.hide();

        this.clusterDetails = null;
    }
}

//Map Cluster Object (google OverlayView)

//https://developers.google.com/maps/documentation/javascript/examples/overlay-simple

function MapCluster(parent, map, data, showLabel) {

    this.clusterMarkerSize = 40;

    this.markerSize = 35;

    this.div = null;

    this.parent = parent;

    this.map = map;

    this.data = data;

    this.className = '';

    this.zoomedClassName = '';

    this.wideZoom = 14;

    this.showLabel = showLabel;

    this.label = '';

    this.center = new google.maps.LatLng(data.lat, data.lng);

    this.selected = false;

    this.selectTimer = null;

    this.doubleClickTimer = null;

    this.showingMini = false;

    // Explicitly call setMap on this overlay.

    this.setMap(map);
}

MapCluster.prototype = new google.maps.OverlayView();

MapCluster.prototype.onAdd = function () {

    this.div = document.createElement('div');

    this.div.style.position = "absolute";

    if (this.data.count > 1) { //Cluster

        this.className = 'cluster-marker';

    } else {

        switch (this.data.listinginfo.propertytype) {

            case 'house':
                this.className = 'house-marker';
                this.zoomedClassName = 'house-zoomed-marker';
                break;
            case 'condo':
            case 'townhouse':
                this.className = 'condo-marker';
                this.zoomedClassName = 'condo-zoomed-marker';
                break;
            case 'multifamily':
                this.className = 'multifamily-marker';
                this.zoomedClassName = 'multifamily-zoomed-marker';
                break;
            case 'land':
                this.className = 'land-marker';
                this.zoomedClassName = 'land-zoomed-marker';
                break;
        }
    }

    var that = this;

    google.maps.event.addDomListener(this.div, 'mouseenter', function (event) {

        event.cancelBubble = true;

        if (event.stopPropagation) event.stopPropagation();

        if (that.selectTimer) {

            clearTimeout(that.selectTimer);

            that.selectTimer = null;
        }

        that.parent.ClearDetails();

        that.selectTimer = setTimeout(function () {

            that.parent.DisplayMiniDetails(that.data, true);

            that.showingMini = true;

        }, 300);

    });

    google.maps.event.addDomListener(this.div, 'mouseleave', function (event) {

        event.cancelBubble = true;

        if (event.stopPropagation) event.stopPropagation();

        if (that.selectTimer) {

            clearTimeout(that.selectTimer);

            that.selectTimer = null;
        }

        if (that.showingMini) {

            that.parent.ClearDetails();

            that.showingMini = false;
        }
    });

    google.maps.event.addDomListener(this.div, 'click', function (event) {

        event.cancelBubble = true;

        if (event.stopPropagation) event.stopPropagation();

        if (that.selectTimer) {

            clearTimeout(that.selectTimer);

            that.selectTimer = null;
        }

        that.parent.ClearDetails();

        that.showingMini = false;

        if (that.doubleClickTimer) {

            clearTimeout(that.doubleClickTimer);

            that.doubleClickTimer = null;
        }
        else {

            if (that.data.count == 1) {     //Property

                that.parent.DisplayDetails(that.data, true);
            }
            else {  //Cluster

                that.centerOnMap();

                var zoom = that.map.getZoom();

                if (zoom <= 20) that.map.setZoom(zoom + 2);
            }
        }
    });

    google.maps.event.addDomListener(this.div, 'mousedown', function (event) {

        event.cancelBubble = true;

        if (event.stopPropagation) event.stopPropagation();
    });

    var panes = this.getPanes();

    panes.overlayMouseTarget.appendChild(this.div);
};

MapCluster.prototype.onRemove = function () {

    $(this.div).off();

    this.div.parentNode.removeChild(this.div);

    this.div = null;
};

MapCluster.prototype.draw = function () {

    var overlayProjection = this.getProjection();

    var centerPoint = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(this.data.lat, this.data.lng));

    this.div.style.zIndex = 100;

    if (this.data.count > 1) { //Cluster

        //this.div.style.left = (centerPoint.x - Math.round(this.clusterMarkerSize / 2)) + 'px';

        //this.div.style.top = (centerPoint.y - Math.round(this.clusterMarkerSize / 2)) + 'px';

        //this.div.style.width = this.clusterMarkerSize + 'px';

        //this.div.style.height = this.clusterMarkerSize + 'px';

        this.div.className = 'cluster-marker';

        this.div.innerHTML = "<div class='pulse'></div><img><div class='count'>" + this.data.count + "</div>";
    }
    else {

        var label1 = this.data.listinginfo.label1;

        var label2 = this.data.listinginfo.label2;

        if (label1 != null && label1 != '' && this.showLabel) {

            var zoom = this.map.getZoom();

            if (zoom < this.wideZoom) {

                this.div.className = this.className;

                this.div.innerHTML = "<img>";
            }
            else {

                this.div.className = this.zoomedClassName;

                this.div.style.left = (centerPoint.x - Math.round(this.markerSize / 2)) + 'px';

                this.div.style.top = (centerPoint.y - Math.round(this.markerSize / 2)) + 'px';

                this.div.innerHTML = "<img><div class='label1'>" + label1 + "</div><div class='label2'>" + label2 + "</div>";
            }

            if (this.selected) {

                this.div.className += ' selected';
            }
        }
        else {

            this.div.innerHTML = "<img>";
        }
    }

    var left = centerPoint.x - Math.round($(this.div).width() / 2);

    var top = centerPoint.y - Math.round($(this.div).height() / 2);

    $(this.div).css('left', left);

    $(this.div).css('top', top);
};

MapCluster.prototype.select = function (select) {

    this.selected = select;

    if (this.div == null) return;

    if (select) {

        this.div.className += ' selected';
    } else {

        if (this.div.className.includes('selected')) this.div.className = this.div.className.substring(0, s.lastIndexOf(' '));
    }

    if (this.data.count == 1) {

        if (select) {

            $(this.div).css("z-index", "1000");

            $(this.div).children('.map_listing_label').css({
                "border": "2px solid black",
                "z-index": "1000"
            });
        } else {

            $(this.div).css("z-index", "100");

            $(this.div).children('.map_listing_label').css({
                "border": "1px solid black",
                "z-index": "100"
            });
        }
    }
}

MapCluster.prototype.show = function (map) {

    this.setMap(map);

    this.map = map;
}

MapCluster.prototype.hide = function () {

    this.setMap(null);

    this.map = null;
}

MapCluster.prototype.containerCenter = function () {

    if (this.data.listinginfo === null) {

        return;
    }

    if (this.data.lat == null || this.data.lng == null) {

        return;
    }

    var mapProjection = this.getProjection();

    return mapProjection.fromLatLngToContainerPixel(new google.maps.LatLng(this.data.lat, this.data.lng));
}

MapCluster.prototype.center = function () {

    if (this.data.listinginfo === null) {

        return;
    }

    if (this.data.lat == null || this.data.lng == null) {

        return;
    }

    var mapProjection = this.getProjection();

    return mapProjection.fromLatLngToDivPixel(new google.maps.LatLng(this.data.lat, this.data.lng));
}

MapCluster.prototype.centerOnMap = function () {

    this.map.setCenter(new google.maps.LatLng(this.data.lat, this.data.lng));
}

function ClusterDetails(map, cluster, type) {

    this.map = map;

    this.cluster = cluster;

    this.type = type;

    this.div = null;

    this.html = '';
}

ClusterDetails.prototype = new google.maps.OverlayView();

ClusterDetails.prototype.show = function () {

    this.setMap(this.map);
};

ClusterDetails.prototype.hide = function () {

    this.setMap(null);
};

ClusterDetails.prototype.onAdd = function () {

    if (!this.div) {

        this.div = document.createElement('div');

        this.div.style.position = "absolute";

        this.div.style.cursor = "auto";

        this.div.style.zIndex = "4000";

        this.div.className = this.className;

        var panes = this.getPanes();

        panes.floatPane.appendChild(this.div);

        //google.maps.event.addDomListener(this.div, 'mousedown', this.cancelEvent);

        //google.maps.event.addDomListener(this.div, 'click', this.cancelEvent);

        google.maps.event.addDomListener(this.div, 'wheel', this.cancelEvent);
    }
};

ClusterDetails.prototype.draw = function () {

    var that = this;

    this.div.innerHTML = this.html;

    var overlayProjection = this.getProjection();

    var relCenterPoint = overlayProjection.fromLatLngToContainerPixel(new google.maps.LatLng(this.cluster.lat, this.cluster.lng));

    var centerPoint = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(this.cluster.lat, this.cluster.lng));

    if (this.type == 1) {

        this.div.className = 'rea_details';

        //Adjust Horizontal

        var width = $('.rea_details').width();

        if (relCenterPoint.x < width / 2) {

            this.div.style.left = Math.round(centerPoint.x) + 'px';

            this.div.className += ' left';
        }
        else if (relCenterPoint.x > $('#rea_search_mainmap').width() - width/2) {

            this.div.style.left = Math.round(centerPoint.x - width) + 'px';

            this.div.className += ' right';
        }
        else {

            this.div.style.left = Math.round(centerPoint.x - width / 2) + 'px';

            this.div.className += ' center';
        }

        //Adjust Vertical

        var height = $('.rea_details').height();

        if (relCenterPoint.y <= height) {

            this.div.style.top = Math.round(centerPoint.y + 17) + 'px';

            this.div.className += ' bottom';
        }
        else {

            this.div.style.top = Math.round(centerPoint.y - height - 22) + 'px';

            this.div.className += ' top';
        }
    }
    else  {

        this.div.className = 'rea_details full-details';

        if (this.data) {

            var specialconditions = $(this.div).find('.sc');

            if (this.data.specialconditions && this.data.specialconditions.length>0) {
                var unique = this.data.specialconditions.filter(function (elem, index, self) {
                    return index == self.indexOf(elem);
                });
                unique.forEach(function (item) {
                    specialconditions.append('<span>' + item + '</span>');
                })
            }

            if (this.data.photocount <= 1) {

                $(this.div).find('.viewphoto-btn').remove();
            }

            if (this.data.savedpropertyid == 0) {

                $(this.div).find('.savedproperty-btn').remove();

            } else {
                $(this.div).find('.saveproperty-btn').remove();
            }
        }

        var height = $('.rea_details').height();

        this.div.style.left = Math.round(centerPoint.x - 3 - this.div.offsetWidth / 2) + 'px';

        this.div.className += ' center';

        this.div.style.top = Math.round(centerPoint.y - height - 22) + 'px';

        if(relCenterPoint.y<=height) {	//Too Close to Top

             var yofs = 18;

             this.div.style.top = Math.round(centerPoint.y+yofs) + 'px';

             this.div.className  += ' bottom';
         }

        /* else {	//Too Close to Bottom

         this.div.style.top = Math.round(centerPoint.y-height-50) + 'px';

         this.div.className  += ' top';
         }*/

        /*if(centerPoint.x<this.div.offsetWidth) {	//Too Close To Left

            this.div.style.left = Math.round(centerPoint.x)-this.div.offsetWidth/2 + 'px';

            this.div.className += ' left';
        }
        else if(centerPoint.x>$('#rea_search_mainmap').width()-this.div.offsetWidth) {	//Too Close to Right

            this.div.style.left = Math.round(centerPoint.x-this.div.offsetWidth+14) + 'px';

            this.div.className += ' right';
        }
        else {


        }*/
    }

    $(this.div).find('.close-btn').off('click').on('click', function () {

        that.hide();

        that.isClick = false;
    })
}

ClusterDetails.prototype.onRemove = function () {

    if (this.div) {

        this.div.parentNode.removeChild(this.div);

        this.div = null;
    }
};

ClusterDetails.prototype.cancelEvent = function (e) {

    e.cancelBubble = true;

    if (e.stopPropagation) e.stopPropagation();
};

function POIMarker(parent, map, placeInfo, icon, showLabel, zIndex, iconSize) {

    this.div = '';

    this.parent = parent;

    this.map = map;

    this.placeInfo = placeInfo;

    this.center = this.placeInfo.geometry.location;

    this.icon = icon;

    this.selected = false;

    this.setMap(map);

    this.showLabel = showLabel;

    this.zIndex = 500;

    if (zIndex != null) {

        this.zIndex = zIndex;
    }

    this.iconSize = iconSize;

    this.selectTimer = null;

    this.doubleClickTimer = null;

    this.displayingInfoBox = false;
}

POIMarker.prototype = new google.maps.OverlayView();

POIMarker.prototype.onAdd = function () {

    this.div = document.createElement('DIV');

    this.div.style.border = "none";

    this.div.style.borderWidth = "0px";

    this.div.style.position = "absolute";

    this.div.style.color = "#FFFFFF";

    this.div.style.font = "bold 10px arial";

    this.div.style.cursor = "pointer";

    this.div.style.zIndex = "1600";

    this.div.class = "map_poi_marker";

    var that = this;

    google.maps.event.addDomListener(this.div, 'mouseenter', function (event) {

        event.cancelBubble = true;

        if (event.stopPropagation) event.stopPropagation();

        if (that.selectTimer) {

            clearTimeout(that.selectTimer);

            that.selectTimer = null;
        }

        //that.selectTimer=setTimeout(function() {that.displayingInfoBox=true;that.parent.getPlaceInfoBox(that,false);that.hoverTimer=null;},300);
    });

    google.maps.event.addDomListener(this.div, 'mouseleave', function (event) {

        event.cancelBubble = true;

        if (event.stopPropagation) event.stopPropagation();

        if (that.selectTimer) {
            clearTimeout(that.selectTimer);

            that.selectTimer = null;
        }

        if (that.displayingInfoBox) {

            that.displayingInfoBox = false;

            //that.parent.closePlaceInfoBox();
        }
    });

    google.maps.event.addDomListener(this.div, 'click', function (event) {

        event.cancelBubble = true;

        if (event.stopPropagation) event.stopPropagation();

        if (that.selectTimer) {

            clearTimeout(that.selectTimer);

            that.selectTimer = null;
        }

        if (that.doubleClickTimer) {
            clearTimeout(that.doubleClickTimer);

            that.doubleClickTimer = null;

            that.map.setCenter(that.center);
        } else {

            that.displayingInfoBox = false;

            //that.parent.getPlaceInfoBox(that,true);

            that.doubleClickTimer = setTimeout(function () {
                that.doubleClickTimer = null;
            }, 400);
        }
    });

    google.maps.event.addDomListener(this.div, 'mousedown', function (event) {

        event.cancelBubble = true;
    });

    var panes = this.getPanes();

    panes.overlayMouseTarget.appendChild(this.div);
}

POIMarker.prototype.draw = function () {

    var overlayProjection = this.getProjection();

    var centerPoint = overlayProjection.fromLatLngToDivPixel(this.placeInfo.geometry.location);

    this.div.style.left = (centerPoint.x - Math.round(this.iconSize / 2)) + 'px';

    this.div.style.top = (centerPoint.y - Math.round(this.iconSize / 2)) + 'px';

    this.div.style.width = this.iconSize + 'px';

    this.div.style.height = this.iconSize + 'px';

    this.div.style.zIndex = this.zIndex;

    this.div.style.backgroundSize = "cover";

    if (this.selected) {

        this.div.style.backgroundImage = "url(" + this.icon + ")";
    } else {

        this.div.style.backgroundImage = "url(" + this.getSelectedIcon() + ")";
    }

    var label = this.placeInfo.name;

    if (label != null && label != '' && this.showLabel && this.iconSize >= 18) {

        this.div.innerHTML = "<div class='map_poi_label' style='display:inline-block;text-align:center;margin-top:" + (this.iconSize) + "px;'>" + label + "</div>";

        $(this.div).children().css('margin-left', Math.round((this.iconSize - ($(this.div).children().width())) / 2 - 6));
    } else {

        this.div.innerHTML = '';
    }
}

POIMarker.prototype.select = function (select) {

    if (select) {

        this.selected = true;

        this.div.style.backgroundImage = "url(" + this.icon + ")";
    } else {

        this.selected = false;

        this.div.style.backgroundImage = "url(" + this.getSelectedIcon() + ")";
    }
}

POIMarker.prototype.onRemove = function () {

    this.div.parentNode.removeChild(this.div);

    this.div = null;
}

POIMarker.prototype.show = function(show) {

    if(show)this.setMap(this.map);
    else this.setMap(null);
}

POIMarker.prototype.containerCenterPoint = function () {

    var mapProjection = this.getProjection();

    return mapProjection.fromLatLngToContainerPixel(this.placeInfo.geometry.location);
}

POIMarker.prototype.centerPoint = function () {

    var mapProjection = this.getProjection();

    return mapProjection.fromLatLngToDivPixel(this.placeInfo.geometry.location);
}

POIMarker.prototype.getSelectedIcon = function () {

    return this.icon;
}

POIMarker.prototype.setIconSize = function (size) {

    if (this.iconSize == size) return;

    this.iconSize = size;

    this.draw();
}

mod.controller('SaveSearchDlg', function ($scope, $uibModalInstance, data) {

    $scope.search = data;

    $scope.ok = function () {

        if (data.name.length == 0) {

            rea_util.Alert("Please Enter A Name for Your Search");

            return;
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.controller('RequestInfoDlg', function ($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.ok = function () {

        if(data.requestCInfo) {

            var err = false;

            data.fnameerror = false;

            data.lnameerror = false;

            data.emailerror = false;

            data.phoneerror = false;

            data.pwderror = false;

            if(!data.fname) { data.fnameerror=true;err=true;}

            if(!data.lname) { data.lnameerror=true;err=true;}

            if(!data.email) { data.emailerror=true;err=true;}

            if(!data.phone) { data.phoneerror=true;err=true;}

            if(!data.password) { data.pwderror=true;err=true;}
            else {

                if(data.confpassword!=data.password) {

                    rea_alert('Passwords do not Match!');

                    err = true;
                }
            }

            if(err)return;

            if (data.message.length == 0) {

                data.message = "Please Send Me More Info About This Property"
            }
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.directive("mapListPane", maplistrDir);

function maplistrDir() {

    return {
        restrict: "E",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        controller: mapListPaneCtrl,
        controllerAs: 'mlpc'
    }
}

mod.controller("mapListPaneCtrl",['$scope',mapListPaneCtrl]);

function mapListPaneCtrl ($scope){
    var that = this;
    this.scope = $scope;
    PubSub.subscribe("search.switchMapList", function (msg, data) {
        that.scope.showMap = data.showMap;
    });
}