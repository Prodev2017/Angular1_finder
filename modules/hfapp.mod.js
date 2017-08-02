
var hfApp = angular.module('hfApp', ['ui.router','LocalStorageModule', 'ui.bootstrap', 'bw.paging', 'globalServicesMod', 'listingDetailsMod', 'myHomefinderMod', 'messagesMod', 'searchMod', 'homeMod', 'propertyListsMod', 'propertyToursMod', 'themeMod', 'FBAngular']);

hfApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider,localStorageServiceProvider) {

    localStorageServiceProvider.setPrefix("harcourts");
    
    $urlRouterProvider.otherwise('/home');

    $locationProvider.hashPrefix('');

    //$locationProvider.html5Mode(true);

    $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'home/home.pane.html'
            })
            .state('agentroster', {
                url: '/home/agentroster',
                templateUrl: 'myhomefinder/agentroster.pane.html'
            })
            .state('community', {
                url: '/community/:pageName',
                templateUrl: 'home/allCommunity.pane.html'
            })
            .state('allcommunities', {
                url: '/allcommunities',
                templateUrl: 'home/allcommunities.tpl.html'
            })

            .state('allfeaturedproperties', {
                url: '/allfeaturedproperties',
                templateUrl: 'home/allfeaturedproperties.pane.html'
            })

            .state('search', {
                url: '/search/:name',
                templateUrl: 'search/search.pane.html',
                params : {
                    
                    label : {value : null, squash : true}
                }
            })

            .state('search.list', {
                templateUrl: 'search/list.pane.html'
            })

            .state('search.thumbs', {
                templateUrl: 'search/thumbs.pane.html'
			})

            .state('search.map', {
                templateUrl: 'search/maponly.html'
            })

            .state('search.maplist', {
                templateUrl: 'search/maplist.pane.html'
            })

            .state('search.table', {
                templateUrl: 'search/table.pane.html'
            })

            .state('search.maptable', {
                templateUrl: 'search/maptable.pane.html'
            })

            .state('propertylist', {
                url: '/properties/:name',
                templateUrl: 'propertylists/propertylist.pane.html'
            })

            .state('propertylist.list', {
                templateUrl: 'propertylists/list.pane.html'
            })

            .state('propertylist.thumbs', {
                templateUrl: 'propertylists/thumbs.pane.html'
            })

            .state('propertylist.map', {
                templateUrl: 'propertylists/map.pane.html'
            })

            .state('propertylist.maplist', {
                templateUrl: 'propertylists/maplist.pane.html'
            })
            .state('property', {
                url:"/property/:address/:listingId",
                onEnter: function() {
                    console.log("doing something");
                },
                
                controller: ['$state', '$stateParams','propertyDataCollection', function($state, $stateParams, propertyDataCollection){
                    propertyDataCollection.GetListingFullDetails(null, $stateParams.listingId, function(property){
                        console.log(property);
                        $state.go("listingdetailspage", {property : property})
                    },this)
                    console.log($stateParams.address)
                    console.log($stateParams.listingId)
                }]
            })
            .state('propertytour', {
                url: '/propertytour/:name',
                templateUrl: 'propertytours/propertytour.pane.html'
            })

            .state('listingdetailspage', {
                templateUrl: 'listingdetailspage/listingdetailspage.pane.html',
                params: {property: null}
            })

            .state('messages', {
                url: '/messages',
                templateUrl: 'messages/messages.pane.html'
            })

            .state('myhomefinder', {
                url: '/myhomefinder',
                templateUrl: 'myhomefinder/myhomefinder.pane.html'
            })

            .state('register', {
                url: '/register',
                templateUrl: 'usermgr/register.html'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'usermgr/login.html'
            })

            .state('forgotpassword', {
                url: '/forgotpassword',
                templateUrl: 'usermgr/forgotpassword.html'
            })

            .state('details', {
                url: '/propertydetails',
                templateUrl: 'propertydetails/propertydetails.pane.html'
            })

            .state('fullpopup', {
                url: '/fullpopup',
                templateUrl: 'propertydetails/fullpopup.tpl.html'
            })


});

hfApp.run(function ($rootScope,$state,$location,propertyDataCollection,userDataCollection,userManager,AuthenticationCtrl,localStorageService, theme, $timeout) {

    $rootScope.$on('$stateChangeStart',
            function (e, toState, toParams, fromState, fromParams) {
                // Layout trigger.
                // @TODO Need to refactor this part
                if (toState.name === 'home')
					theme.showBigBanner();
                else if (toState.name === 'login' || toState.name === 'register' || toState.name === 'forgotpassword') {
                    theme.hideBanner();
                } else if (toState.name === 'messages') {
                    theme.showMiniBanner();
                } else {
                    theme.showMiniBanner();
                }

                //add class for page
				if(toState.name === 'home' || toState.name === 'login' || toState.name === 'register' || toState.name === 'forgotpassword'){
					$rootScope.classPage = '';
                    $rootScope.classPageBody = '';
                    $rootScope.classMain = 'main-home-content';
                    theme.showFooter();
				} else if (toState.name === 'search') {
                    $rootScope.classPage = 'search-page';
					$rootScope.classMain='';
                    theme.hideFooter();
                } else if (toState.name.startsWith('search.')) {
                    $rootScope.classPage = 'search-page';
					$rootScope.classMain='';
                    theme.hideFooter();
                } else if (toState.name.startsWith('messages')) {
                    $rootScope.classPage = 'messages';
                    $rootScope.classPageBody = 'messages-page';
					$rootScope.classMain='main-other-content';
                    theme.hideFooter();
                } else if (toState.name.startsWith('propertylist')) {
                    $rootScope.classMain='main-other-content';
					$rootScope.classPageBody = '';
					theme.hideFooter();
				} else {
                    $rootScope.classPage = '';
					$rootScope.classPageBody = '';
					$rootScope.classMain='main-other-content';
                    theme.showFooter();
                }

                if(toState.name.startsWith('search')) {

                    if(toParams.name&&!toParams.name.includes('='))toParams.name = toParams.name.replace(/ /g,'-');

                    if(toState.name.includes('.'))propertyDataCollection.currentView = rea_util.StringAfter(toState.name,'.');
                }
                else if(toState.name.startsWith('propertylist')) {

                    if(toParams.name&&!toParams.name.includes('='))toParams.name = toParams.name.replace(/ /g,'-');
                }
                else if(toState.name.startsWith('propertytour')) {
                    if(toParams.name&&!toParams.name.includes('='))toParams.name = toParams.name.replace(/ /g,'-');
                }
                else if(toState.name=='myhomefinder') {

                    if(!userManager.isAuthenticated) {

                        e.preventDefault();

                        AuthenticationCtrl.Login(function(response){

                            if(userManager.isAuthenticated) {

                                $state.go('myhomefinder');
                            }
                        });

                    }
                }
            }
    );

    userManager.GetInfo(function(response) {

        PubSub.publish("banner.loginjoin",{loggedin:false,name:userManager.name})

        PubSub.publish("banner.newmessagecount",{count:response.newmessagecount})

    },this);

   
    var showDetails_property = localStorageService.get("showDetails");

    if(showDetails_property != null) { 
      
         $timeout(function() {
          $state.go("listingdetailspage", {property: showDetails_property});
          localStorageService.remove("showDetails");
    }, 500);
       
    }

});

hfApp.controller('bannerCtrl',['$scope','userManager','AuthenticationCtrl',bannerCtrl]);

function bannerCtrl($scope,userManager,AuthenticationCtrl) {

    this.userMgr = userManager;

    this.scope = $scope;

    let self = this;

    $scope.authenticated= userManager.isAuthenticated;

    $scope.name = userManager.name;

    $scope.login = LogIn;

    $scope.logout = LogOut;

    $scope.register = Register;


    var that = this;

    PubSub.subscribe("banner.loginjoin",function(msg,data){

        if(data.loggedin) {

            $scope.authenticated = true;

            $scope.name = userManager.name;
        }
        else {

            $scope.authenticated = false;

            $scope.name = '';
        }

        $scope.$apply();
    });

    PubSub.subscribe("banner.newmessagecount",function(msg,data){
        self.scope.newMessageCount = data.count;

        console.log("newmessagecount"+data.count);
    });

    function LogOut() {

        userManager.isAuthenticated = false;

        userManager.name = '';

        userManager.email = '';

        rea_util.RemoveCookie("reau_g2h");

        $scope.authenticated = false;

        $scope.name = '';

        //$scope.$apply();
    }

    function LogIn() {

        AuthenticationCtrl.Login(function(response){

            if(userManager.isAuthenticated) {

                $scope.authenticated = true;

                $scope.name = userManager.name;
            }
            else {

                $scope.authenticated = false;

                $scope.name = '';
            }

            $scope.$apply();

        },this);
    }

    function Register() {

        AuthenticationCtrl.Register(function(response){

            if(userManager.isAuthenticated) {

                $scope.authenticated = true;

                $scope.name = userManager.name;
            }
            else {

                $scope.authenticated = false;

                $scope.name = '';
            }

            $scope.$apply();

        },this);
    }

}




