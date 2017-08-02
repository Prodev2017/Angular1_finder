var mod = angular.module("myHomefinderMod",['globalServicesMod','ui.router','ngSanitize','ngAnimate','ui.bootstrap']);


mod.directive("myhomefinderPane",myhomefinderPaneDir);

function myhomefinderPaneDir() {

    return {
        restrict: "E",
        transclude:true,
        template:'<ng-transclude></ng-transclude>',
        controller: myhomefinderCtrl,
        controllerAs:'mhf'
    }
}

mod.controller("myhomefinderCtrl",['$scope','$uibModal','userDataCollection','userManager','AuthenticationCtrl',myhomefinderCtrl]);

function myhomefinderCtrl($scope,$uibModal,userDataCollection,userManager,AuthenticationCtrl) {

    var mhf = this;

    this.scope = $scope;

    this.modal = $uibModal;

    this.uDataColl = userDataCollection;

    this.uMgr = userManager;

    mhf.propertyLists = [];

    mhf.tours = [];

    mhf.savedSearches = [];

    mhf.updateOptions = ["Never", "Daily", "Weekly", "Monthly"];

    this.contactInfo = {};

    this.GetSavedPropertyLists();

    this.GetTours();

    this.GetSavedSearches();

    this.GetContactInfo();
}

myhomefinderCtrl.prototype.GetContactInfo = function() {

    this.uMgr.GetContactInfo(function(info){this.contactInfo = info;this.scope.$apply()},this);
}

myhomefinderCtrl.prototype.GetSavedPropertyLists = function() {

    var that = this;

    this.uDataColl.GetSavedPropertyLists(function(lists){

        this.propertyLists = lists;

        this.scope.$apply()

    },this);
}

myhomefinderCtrl.prototype.GetTours = function() {

    this.uDataColl.GetTours(function(tours){this.tours=tours;this.scope.$apply()},this);
}

myhomefinderCtrl.prototype.GetSavedSearches = function() {

    this.uDataColl.GetSavedSearches(function(searches) {

        this.savedSearches = searches;

        this.scope.$apply();

    },this);
}

myhomefinderCtrl.prototype.AddList = function() {

    var that = this;

    var date = new Date();

    var data = {name:'My List '+(date.getMonth()+1).toString()+'-'+date.getDate(),lists:this.propertyLists};

    var dialogInst = this.modal.open({
        templateUrl: 'myhomefinder/createlist.dlg.html',
        controller: 'CreateListDlg',
        size:'md',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    dialogInst.result.then(function (result) {

        that.uDataColl.AddSavedPropertyList(data.name,function(list){this.GetSavedPropertyLists()},that);

    }, function () {

    });
}

myhomefinderCtrl.prototype.RenameList = function(list) {

    var that = this;

    var data = {currentName:list.name,newName:list.name};

    var dialogInst = this.modal.open({
        templateUrl: 'myhomefinder/renamelist.dlg.html',
        size:'md',
        controller: 'RenameListDlg',
        windowClass: 'renamelist-modal-wrapper',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    dialogInst.result.then(function (result) {

        that.uDataColl.RenameSavedPropertyList(list.id,data.newName,function(list){this.GetSavedPropertyLists()},that);

    }, function () {

    });
}

myhomefinderCtrl.prototype.DeleteList = function(list) {

    var that = this;

    rea_util.ConfirmAction("Are You Sure You Want to Delete This List ?",'Delete',function(isConfirmed) {

        if(isConfirmed) {

            that.uDataColl.RemoveSavedPropertyList(list.id,function(){this.GetSavedPropertyLists()},that);
        }
    });
}

myhomefinderCtrl.prototype.AddTour = function() {

    var that = this;

    var date = new Date();

    var data = {name:'My Tour '+date.getMonth()+'-'+date.getDate(),startingLocation:'',tours:this.tours};

    var dialogInst = this.modal.open({
        templateUrl: 'myhomefinder/createtour.dlg.html',
        controller: 'CreateTourDlg',
        size:'md',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    dialogInst.result.then(function (result) {

        var latlng = {lat:0,lng:0}

        that.uDataColl.AddTour(data.name,data.startingLocation,function(tour){this.GetTours()},that);

    }, function () {

    });
}

myhomefinderCtrl.prototype.EditTour = function(tour) {

    var that = this;

    var data = {newName:tour.name};

    var dialogInst = this.modal.open({
        templateUrl: 'myhomefinder/edittour.dlg.html',
        controller: 'EditTourDlg',
        size:'md',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    dialogInst.result.then(function (result) {

        that.uDataColl.UpdateTour(tour.id,data.newName,function(tour){this.GetTours()},that);

    }, function () {

    });
}

myhomefinderCtrl.prototype.DeleteTour = function(tour) {

    var that = this;

    rea_util.ConfirmAction("Are You Sure You Want to Delete This Tour ?",'Delete',function(isConfirmed) {

        if(isConfirmed) {

            that.uDataColl.RemoveTour(tour.id,function(){this.GetTours()},that);
        }
    });
}

myhomefinderCtrl.prototype.RenameSearch = function(search) {

    var that = this;

    var data = {currentName:search.name,newName:search.name};

    var dialogInst = this.modal.open({
        templateUrl: 'myhomefinder/renamesearch.dlg.html',
        controller: 'RenameSearchDlg',
        size:'sm',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    dialogInst.result.then(function (result) {

        that.uDataColl.RenameSearch(search.id,data.newName,function(search){this.GetSavedSearches()},that);

    }, function () {

    });
}

myhomefinderCtrl.prototype.DeleteSearch = function(search) {

    var that = this;

    rea_util.ConfirmAction("Are You Sure You Want to Delete This Search ?",'Delete',function(isConfirmed) {

        if(isConfirmed) {

            that.uDataColl.RemoveSearch(search.id,function(){this.GetSavedSearches()},that);
        }
    });
}

myhomefinderCtrl.prototype.UpdateSearchFrequency = function(search) {

    this.uDataColl.UpdateSearchFrequency(search,search.updatefrequency,function() {

    },this);
}

myhomefinderCtrl.prototype.UpdateContactInfo = function() {

    if(!this.contactInfo.firstname||this.contactInfo.firstname=='') {

        rea_util.Alert("Please Enter a First Name");

        return;
    }

    if(!this.contactInfo.lastname||this.contactInfo.lastname=='') {

        rea_util.Alert("Please Enter a Last Name");

        return;
    }

    if(!rea_util.IsValidEMail(this.contactInfo.email)) {

        rea_util.Alert("Please Enter A Valid E-Mail Address");

        return;
    }

    if(this.contactInfo.mobilephone&&this.contactInfo.mobilephone!='') {

        if(!rea_util.IsValidPhone(this.contactInfo.mobilephone)) {

            rea_util.Alert("Please Enter A Valid Phone Number");

            return;
        }
    }

    if(this.contactInfo.homephone&&this.contactInfo.homephone!='') {

        if(!rea_util.IsValidPhone(this.contactInfo.homephone)) {

            rea_util.Alert("Please Enter A Valid Phone Number");

            return;
        }
    }

    this.uMgr.UpdateContactInfo(this.contactInfo,function(info){

        rea_util.FlashMessage("Your Contact Info has been Updated");

        this.GetContactInfo();

    },this);
}

myhomefinderCtrl.prototype.UpdatePassword = function() {

    var that = this;

    var data = {password:'',confirmPassword:'',currentPassword:''};

    var dialogInst = this.modal.open({
        templateUrl: 'myhomefinder/updatepassword.dlg.html',
        controller: 'UpdatePasswordDlg',
        resolve: {
            data: function () {
                return data;
            }
        }
    });

    dialogInst.result.then(function (result) {

        that.uMgr.UpdatePassword(data.currentPassword,data.password,function() {

            rea_util.FlashMessage("Password Updated");

        },that);

    }, function () {

    });
}

myhomefinderCtrl.prototype.FormatQS = function(area) {

    if(area.includes('bounds'))
    {
        area = area.replace(/bounds=.*&*/,"bounds=...");
    }

    return area.replace(/=/g,' : ').replace(/&/g,'<br>');
}

//Dialog Controllers

mod.controller('UpdatePasswordDlg', function($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.ok = function () {

        if(!data.currentPassword||data.currentPassword=='') {

            rea_util.Alert("Please Enter Current Password");

            return;
        }

        if(data.password.length<8) {

            rea_util.Alert("New Password Must Have A Minimum of 8 characters");

            return;
        }

        if(data.password!=data.confirmPassword) {

            rea_util.Alert("Passwords do not Match !");

            return;
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.controller('CreateListDlg', function($scope, $uibModalInstance, data) {

    $scope.list = data;

    $scope.ok = function () {

        if(data.name.length==0) {

            rea_util.Alert("Please Enter A Name for Your List");

            return;
        }

        for(var n=0;n<data.lists.length;n++) {

            if(data.name==data.lists[n]) {

                rea_util.Alert("You Already Have A List with That Name");

                return;
            }
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.controller('RenameListDlg', function($scope, $uibModalInstance, data) {

    $scope.list = data;

    $scope.ok = function () {

        if(data.newName.length==0) {

            rea_util.Alert("Please Enter A New Name for List");

            return;
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.controller('EditTourDlg', function($scope, $uibModalInstance, data) {

    $scope.tour = data;

    $scope.ok = function () {

        if(data.newName.length==0) {

            rea_util.Alert("Please Enter A Name for Tour");

            return;
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.controller('RenameSearchDlg', function($scope, $uibModalInstance, data) {

    $scope.search = data;

    $scope.ok = function () {

        if(data.newName.length==0) {

            rea_util.Alert("Please Enter A New Name for Search");

            return;
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

