var mod = angular.module("homeMod", ['globalServicesMod', 'ui.router', 'ngSanitize', 'ngAnimate', 'ui.bootstrap', 'slickCarousel']);

//Home Pane

mod.filter('spaceless',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '-');
        }
    }
});

mod.directive('homePane', homePaneDir);

function homePaneDir() {

    return {
        restrict: "E",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        controller: homePaneCtrl,
        controllerAs: 'hpc'
    }
}

mod.controller("homePaneCtrl", ['$scope', '$uibModal', 'propertyDetailsCtrl', 'propertyDataCollection', 'userDataCollection', 'featuredCommunitiesCollection', 'featuredPropertiesCollection', '$timeout', homePaneCtrl]);

function homePaneCtrl($scope, $uibModal, propertyDetailsCtrl, propertyDataCollection, userDataCollection, featuredCommunitiesCollection, featuredPropertiesCollection, $timeout) {

    var hpc = this;
    
    $scope.communitiesLoaded = false;
    
    hpc.featuredCommunities = [ ];

    this.modal = $uibModal;

    this.pDataColl = propertyDataCollection;

    this.uDataColl = userDataCollection;

    this.propertyDetailsCtrl = propertyDetailsCtrl;

    hpc.domain = rea_domain;

    var initSliderConfig = {
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1919,
                settings: {
                    slidesToShow: 4
                }
            }, {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2
                }
            }, {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    featuredCommunitiesCollection.GetAllCommunities(function (polys) {
        $timeout( function () {
            if(!$scope.communitiesLoaded){
				hpc.featuredCommunities = polys;
				
				var firstelem=polys[0];
				
				console.log("first Element"+firstelem['name']);
				
				/* hpc.featuredCommunities.unshift(firstelem); */
				hpc.communitiesSlider = initSliderConfig;
				$scope.communitiesLoaded = true;
			}
        });  
    }, this);

    hpc.featuredProperties = featuredPropertiesCollection.GetProperties();

    hpc.propertiesSlider = {
        infinite: true,
        speed: 500,
        lazyLoad: 'progressive',
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
	
	
	
	

    // Fix slick slider lagging
    //setTimeout("initializeSlick()", 1000);
    // setTimeout("initializeSlick()", 200);
    // setTimeout("propertiesSlider()", 200);
}

homePaneCtrl.prototype.ShowDetails = function (property) {
    this.propertyDetailsCtrl.DisplayDetails(property.mlstable, property.listingId, this.featuredProperties);
}

homePaneCtrl.prototype.SaveProperty = function (property) {
    alert('=rajaram="');
    this.uDataColl.AddProperty(property);
}

homePaneCtrl.prototype.MapUrl = function (community) {

    if(!community) {

        console.log('community is null');

        return;
    }

    var polyArray = [];

    community.coords.forEach(function(coor) {
        polyArray.push(coor.lat + ',' + coor.lng);
    });

    var polyUrl = polyArray.join('|');

    var style = '&style=feature:all|element:labels|visibility:on&style=feature:all|element:labels.text.fill|saturation:36|color:0x000000|lightness:40&style=feature:all|element:labels.text.stroke|visibility:on|color:0x000000|lightness:16&style=feature:all|element:labels.icon|visibility:off&style=feature:administrative|element:geometry.fill|color:0x000000|lightness:20&style=feature:administrative|element:geometry.stroke|color:0x000000|lightness:17|weight:1.2&style=feature:administrative.locality|element:labels.text.fill|color:0xc4c4c4&style=feature:administrative.neighborhood|element:labels.text.fill|color:0x707070&style=feature:landscape|element:geometry|color:0x000000|lightness:20&style=feature:poi|element:geometry|color:0x000000|lightness:21|visibility:on&style=feature:poi.business|element:geometry|visibility:on&style=feature:road.highway|element:geometry.fill|color:0xbe2026|lightness:0|visibility:on&style=feature:road.highway|element:geometry.stroke|visibility:off&style=feature:road.highway|element:labels.text.fill|visibility:off&style=feature:road.highway|element:labels.text.stroke|visibility:off|hue:0xff000a&style=feature:road.arterial|element:geometry|color:0x000000|lightness:18&style=feature:road.arterial|element:geometry.fill|color:0x575757&style=feature:road.arterial|element:labels.text.fill|color:0xffffff&style=feature:road.arterial|element:labels.text.stroke|color:0x2c2c2c&style=feature:road.local|element:geometry|color:0x000000|lightness:16&style=feature:road.local|element:labels.text.fill|color:0x999999&style=feature:road.local|element:labels.text.stroke|saturation:-52&style=feature:transit|element:geometry|color:0x000000|lightness:19&style=feature:water|element:geometry|color:0x000000|lightness:17';

    var url = "http://maps.googleapis.com/maps/api/staticmap?center=" +
                community.ctrlat +
                "," +
                community.ctrlng +
                "&zoom=12&size=300x300&key=AIzaSyDEGrhHf_tIMo-mdc1zCToGN81Zg2UbByI&path=color%3a0x07AEFFFF|weight:2|fillcolor%3a0x006EB68F|" +
                polyUrl +
				style;
    return url;
}

homePaneCtrl.prototype.AreaLookaheadCallback = function(response) {

    this.lookaheadResults = response;

    this.showLookup = true;

    this.scope.$apply();
}

//Search Bar

mod.directive("homeSearchBar", homeSearchBarDir);

function homeSearchBarDir() {

    return {
        restrict: "E",
        scope: {},
        templateUrl: 'home/searchbar.tpl.html',
        controller: homeSearchBarCtrl,
        controllerAs: 'hsbc'
    }
}



mod.controller("homeSearchBarCtrl",['$scope','$element','$state','propertyDataCollection',homeSearchBarCtrl]);

function homeSearchBarCtrl($scope,$state,$element,propertyDataCollection) {

    var hsbc = this;

    this.scope = $scope;

    this.pDataColl = propertyDataCollection;

    this.scope = $scope;

    this.state = $state;

    this.timer = null;

    hsbc.lookupText = '';

    hsbc.lookaheadResults = [];

    hsbc.showLookup = false;

    this.lookupText = '';

    this.preEditAreaParams = {};

    this.searchBox = $element.find('#rea_home_search_lookup');

    //this.setSelectionRange(0, this.value.length);

    this.displayingSavedSearch = false;

    this.currentLookahead = {};

    this.searchBox.on('click', function () {

        this.setSelectionRange(0, this.value.length);
    }).on('keydown', function (e) {

        //var evtobj = window.event? event : e;
        if(hsbc.timer) {

            clearTimeout(hsbc.timer);

            hsbc.timer = null;
        }

        var key = String.fromCharCode(e.keyCode);

        if( key == 8 || key == 46 )return;

        hsbc.lookupText = hsbc.searchBox.val()+key.toLowerCase();

        if(hsbc.lookupText.length>2) {

            hsbc.timer = setTimeout(function() {

                hsbc.pDataColl.LookupArea(hsbc.lookupText,null,hsbc.AreaLookaheadCallback,hsbc);

            },500);
        }
        else if(this.showLookup) {

            this.showLookup=false;

            this.scope.$apply();
        }
    });

}

homeSearchBarCtrl.prototype.TextChanged = function() {
    if(this.bodyText.length==0) {

        this.showControls = false;
    }
    else {

        this.showControls = true;
    }
}

homeSearchBarCtrl.prototype.UpdateArea = function(area) {

    var hasArea = false;

    if(area==null||rea_util.IsEmptyObject(area)) {

        if(this.lookaheadResults.length==0)this.currentLookahead = {};
        else {

            this.currentLookahead = this.lookaheadResults[0];

            hasArea = true;
        }
    }
    else {

        this.currentLookahead = area;

        hasArea = true;
    }

    if(hasArea) {

        if(area.label)this.searchBox.val(area.label);
        else this.searchBox.val('');

        this.pDataColl.currentAreaParams = area.query;
    }

    if(this.showLookup) {

        this.showLookup = false;
    }

    this.UpdateSearch();
}

homeSearchBarCtrl.prototype.AreaLookaheadCallback = function(response) {
    this.lookaheadResults = response;

    this.showLookup = true;

    this.scope.$apply();
}

homeSearchBarCtrl.prototype.UpdateSearch = function(loc) {
    if(this.displayingSavedSearch) {

        this.displayingSavedSearch = false;
    }
    else {

        this.currentSavedSearchName = '';

        this.uDataColl.currentSavedSearchName = '';
    }

    this.pDataColl.UpdateSearch(this.controlValues);

    if(this.pDataColl.currentView.includes('map')) {

        PubSub.publish('map.updatelistingquery',{area:this.pDataColl.currentAreaParams,filter:this.pDataColl.currentFilterParams,propertyTypes:this.pDataColl.currentPropertyTypes});
    }
    else {

        PubSub.publish('list.updatelistingquery',{area:this.pDataColl.currentAreaParams,filter:this.pDataColl.currentFilterParams,propertyTypes:this.pDataColl.currentPropertyTypes});
    }
}

homeSearchBarCtrl.prototype.AreaLookaheadCallback = function(response) {

    this.lookaheadResults = response;

    this.showLookup = true;

    this.scope.$apply();
}

homeSearchBarCtrl.prototype.UpdateArea = function(area) {

    if(area==null||rea_util.IsEmptyObject(area))return;

    var query = rea_util.ObjectToQuery(area.query);

    this.state.go('search',{name: query});
}

//Featured Property Card Pane

mod.directive("featuredPropertyCard", featuredPropertyCardDir);

function featuredPropertyCardDir() {

    return {	
        restrict: "E",
        templateUrl: 'home/propertycard.tpl.html'
    }
}

mod.directive("propertyRepeater", function ($timeout) {
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
	$("#propertyCarousel").flexisel(
	{
		visibleItems: 4,
		itemsToScroll: 1,
		infinite:false,    
		navigationTargetSelector:$(".gallery")[1], 
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
				changePoint:780,
				visibleItems: 2,
				itemsToScroll: 1
			},
			tablet: {
				changePoint:1200,
				visibleItems: 3,
				itemsToScroll: 1
			}
		},
	});
}

mod.directive("modalPropertyRepeater", function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    if(!scope.init)
						loadModalPropertyCarousel(scope);
                });
            }
        }
    }
});

function loadModalPropertyCarousel(scope){
	scope.init=true;
	console.log("in load modal");
	$("#modalPropertyCarousel").flexisel(
	{
		visibleItems: 3,
		itemsToScroll: 1,
		infinite:false,    
		navigationTargetSelector:$(".gallery"), 
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
				changePoint:1025,
				visibleItems: 1,
				itemsToScroll: 1
			}
		},				
	});
}

//Featured Community Card Pane

mod.directive("featuredCommunityCard", featuredCommunityCardDir);

function featuredCommunityCardDir() {

    return {
        restrict: "E",
        templateUrl: 'home/communitycard.tpl.html'
    }
}





//Community Pane

mod.directive("communityPane", function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    if(!scope.init)
						loadFlexiCarousel(scope);
                });
            }
        }
    }
});

function loadFlexiCarousel(scope){
		$('#flexisel li').on("mouseover", function(event){
			var myindex =  $(this);
			var img=myindex.find(".carousel-hover-img");
			//console.log(scope.hpc.featuredCommunities[$(this).index()]);
			img.attr("src",scope.hpc.MapUrl(scope.hpc.featuredCommunities[$(this).index()]));
		})
	scope.init=true;
	$("#flexisel").flexisel(
	{
		visibleItems: 4,
		itemsToScroll: 1,
		infinite:false, 
		navigationTargetSelector:$(".gallery")[0], 
		autoPlay: {
			enable: true,
			interval: 3000,
			pauseOnHover: true
		},
		responsiveBreakpoints: { 
			portrait: { 
				changePoint:481,
				visibleItems: 1,
				itemsToScroll: 1
			}, 
			landscape: { 
				changePoint:780,
				visibleItems: 2,
				itemsToScroll: 1
			},
			tablet: { 
				changePoint:1200,
				visibleItems: 3,
				itemsToScroll: 1
			}
		},				
	});
}

/*function communityPaneDir() {

    return {
        restrict: "E",
        templateUrl: 'home/communitypane.tpl.html',
        controller: 'communityPaneCtrl',
        controllerAs: 'commpc'
    }
}*/

mod.controller('communityPaneCtrl', ['$stateParams', communityPaneCtrl]);

function communityPaneCtrl($stateParams) {

    var commpc = this;

    commpc.communityId = $stateParams.id;
}

//All Communities Pane

mod.directive("allCommunitiesPane", allCommunitiesPaneDir);

function allCommunitiesPaneDir() {

    return {
        restrict: "E",
        controller: 'allCommunitiesPaneCtrl',
        controllerAs: 'acpc',
        template: '<ng-include src="getTemplateUrl()"/>',
    };
}

mod.controller('allCommunitiesPaneCtrl', allCommunitiesPaneCtrl);

function allCommunitiesPaneCtrl($location, $scope) {
    var acpc = this;
    $scope.pageName = $location.path().split('/')[2].replace("-", " ");
    $scope.getTemplateUrl = function () {
        var path = $location.path().split('/')[2]
        if ( path ) {
            return  'home/' +path.replace(/\s/g, "-") + '.tpl.html';
        } else {
            return '';
        }
    };
}

mod.directive("allFeaturedPropertiesPane", allFeaturedPropertiesPaneDir);

function allFeaturedPropertiesPaneDir() {
            return {
                restrict: "E",
                templateUrl: 'home/allfeaturedproperties.tpl.html',
                controller: 'allFeaturedPropertiesPaneCtrl',
                controllerAs: 'afpc'
            }
        }

mod.controller('allFeaturedPropertiesPaneCtrl', allFeaturedPropertiesPaneCtrl);

function allFeaturedPropertiesPaneCtrl() {
    var afpc = this;
}

mod.directive('hoverImageEffect', hoverImageEffect);

function hoverImageEffect() {
    return {
        restrict: 'A',
        link: hoverImageEffectCtrl,
        scope: {
            hoverImageEffect: '<'
        }
    };
}

function hoverImageEffectCtrl(scope, element, attrs) {
    var $element = $(element);
    var imageSelector = '.' + attrs.hoverImageEffect || 'img';
    var $image = $element.find(imageSelector);
    $element.mousemove(function (e) {
        var pOffset = $image.offset();
        var x = e.pageX - pOffset.left;
        var y = e.pageY - pOffset.top;
        var w = $image.width();
        var h = $image.height();
        var propX =(x/w);
		var propY=(y/h);
		
		
        
		
			$image.css('transform', (
                'perspective(500px) ' +
                'rotateX(' + (15 * (propY - 0.5)) + 'deg' + ')' +
                'rotateY(' + (15 * (propX - 0.5)) + 'deg' + ')' +
                'translate3d(' + (5 * (propY - 0.5)) + 'px,' + (5 * (propX - 0.5)) + 'px,' + '0px' + ') '
                )
                );
		
    });

    $element.mouseout(function (e) {
        $image.css('transform', '');
    });
}
