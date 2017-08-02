var mod = angular.module("messagesMod",[
    'globalServicesMod',
    'ngSanitize',
    'ngAnimate',
    'ui.bootstrap',
    'angularFileUpload',
    '720kb.socialshare'
]);

//Messages Pane

mod.directive("messagesPane",messagePaneDir);

// mod.filter('replies', [function (replies) {
//     return function (replies) {
//         return replies.filter(function(reply, index) {
//             if(index >= replies.length - 2)
//                 return reply;
//         });
//     };
// }]);

function messagePaneDir() {

    return {
        restrict: "E",
        transclude: true,
        template:'<ng-transclude></ng-transclude>',
        controller: msgPaneCtrl,
        controllerAs: "mpc"
    };
}

mod.controller("msgPaneCtrl",['$scope', '$filter', '$state','Socialshare', 'messageCollection','userDataCollection','propertyDataCollection','$uibModal','propertyDetailsCtrl','AuthenticationCtrl','FileUploadCtrl', 'fileViewerPopupService',msgPaneCtrl]);

function msgPaneCtrl($scope, $filter, $state, Socialshare, messageCollection,userDataCollection,userManager,$uibModal,propertyDetailsCtrl,AuthenticationCtrl,FileUploadCtrl,fileViewerPopupService){

    var mpc = this;

    this.scope = $scope;

    this.state = $state;

    this.msgColl = messageCollection;

    this.uDataColl = userDataCollection;

    this.Socialshare = Socialshare;

    this.fileViewerPopupService = fileViewerPopupService;

    this.filteredThreads = [];

    this.authCtrl = AuthenticationCtrl;

    this.modal = $uibModal;

    this.filter = $filter; 

    mpc.domain = rea_domain;

    mpc.propertyLists = [];

    mpc.propertyTours = [];

    mpc.propertySearches = [];

    mpc.messages = [];

    mpc.tempMessage = this.msgColl.tempMessage;

    mpc.lastmessageaccesstime = userManager.lastMessageAccessTime;

    this.matchIndex = 0;

    mpc.messageGroups = {};

    this.propertyDetailsCtrl = propertyDetailsCtrl;

    this.searchDir = 0;

    this.GetPropertyLists();

    this.GetPropertyTours();

    this.GetPropertySearches();

    mpc.uploadTimer = null;

    mpc.isInUploadProgress = false;

    mpc.isUploadSuccess = false;

    mpc.isUpload = false;

    $scope.$watch(() => mpc.messages, function() {
        var today = new Date().toDateString();
        var messageGroups = {
            today: [],
            old: [],
            new: []
        };
        mpc.messages.forEach(function(messageObject) {
            
            
            var messageDate = moment(messageObject.message.adddate, 'MMM D YYYY HH:mm A').toDate().toDateString();
            if (today === messageDate) {
                if(mpc.IsNewMessage(messageObject.message.adddate)){
                  
                
                    messageObject.messageGroup = 'new';
                    
                    messageGroups.new.push(messageObject)
                }else{
                    messageObject.messageGroup = 'today';
                
                    messageGroups.today.push(messageObject);
                    
                }
            } else {
                messageObject.messageGroup = 'old';
                
                messageGroups.old.push(messageObject);
            }
        });
        mpc.messageGroups = messageGroups;
        that.files = that.FilterFiles(that.messages);
    }, true);

    this.GetMessages();

    var that = this;

    PubSub.subscribe('change.status',function(msg, data){

        setTimeout(function(){
            mpc.isUpload = data.value; 
            that.scope.$apply();    
        },5000);

    });

    PubSub.subscribe("messages.init",function(msg,data){

        // that.ScrollToNewMessage();
        
    })

    PubSub.subscribe("binding.paste", function(){

        $('#rea_message_new_input').siblings('.emoji-wysiwyg-editor').on("paste", function(e){

            for (var i = 0 ; i < e.originalEvent.clipboardData.items.length ; i++) {

                var item = e.originalEvent.clipboardData.items[i];

                console.log("Item: " + item.type);

                if (item.type.indexOf("image")>=0) {

                    var image = item.getAsFile();

                    that.UploadPastedFile(that.msgColl.tempMessage,image);
                }
            }
        });
    })

    var timer = null;
    document.getElementsByClassName("dvc_content-wrap")[0].addEventListener('scroll', function() {
        
        mpc._scrolling = true;
        console.log("scrolling")
        if(timer !== null) {
            clearTimeout(timer);        
        }
       
        timer = setTimeout(function() {
                mpc._scrolling = false;
                console.log($(".dvc_content-wrap").scrollTop())
                console.log($("section.messages").innerHeight())
        if($(".dvc_content-wrap").scrollTop() >= $("section.messages").height() - 1000) {
            mpc._atBottom = true;
        }
        else {
            mpc._atBottom = false;
        }    
        if($(".dvc_content-wrap").scrollTop() <= 5){
            mpc._atTop = true;
        }
        else {
            mpc._atTop = false;
        }
        console.log(mpc._atTop)
        console.log( mpc._atBottom)
        $scope.$apply()
            }, 150);
    }, false);
}

msgPaneCtrl.prototype.ClickSearch = function() {

    var length = $('#rea_message_search').val().length;

    $('#rea_message_search')[0].setSelectionRange(0, length);
}

msgPaneCtrl.prototype.TriggerSearch = function(e) {

    if(this.filterTimeout) {
        clearTimeout(this.filterTimeout)
    }

    let that = this;

    this.filterTimeout = setTimeout(function(){
        
    

    if($('#rea_message_search').val().length==0) {

        that.filteredThreads = [];
        that.messages.forEach(function(message) { 
            if(message._showThreads) that.toggleHideShowMessages(message)
        });
        that.scope.$apply();
        
    }
    else{
        that.filteredThreads.push(that.filter('filter')(that.messages,  {  $ : { data : { body : that.searchBottom }   }}))
        that.filteredThreads.push(that.filter('filter')(that.messages,  {  $ : { data : {  comment : that.searchBottom }   }}))
        that.filteredThreads = [].concat.apply([], that.filteredThreads); 
        that.filteredThreads.forEach(function(message) { 
            if(!message._showThreads) that.toggleHideShowMessages(message)});
            that.scope.$apply();
        }

    if(e.keyCode==8) {

        that.searchDir=0;
    }
    else if (e.keyCode === 10 || e.keyCode === 13) {

        e.preventDefault();

        that.Search(this.searchDir);

        that.searchDir = 1;
    }
    }, 500)
}

msgPaneCtrl.prototype.GetPropertyLists = function() {

    this.uDataColl.GetSavedPropertyLists(function(lists){

        this.propertyLists = [];

        for(var n=0;n<lists.length;n++) {

            this.propertyLists.push(lists[n].name);
        }

    },this,true);
}

msgPaneCtrl.prototype.GetPropertyTours = function() {

    this.uDataColl.GetTours(function(tours){

        this.propertyTours = [];

        for(var n=0;n<tours.length;n++) {

            this.propertyTours.push(tours[n].name);
        }

    },this,true);
}

msgPaneCtrl.prototype.GetPropertySearches = function() {

    this.uDataColl.GetSavedSearches(function(searches){

        this.propertySearches = [];

        for(var n=0;n<searches.length;n++) {

            this.propertySearches.push(searches[n].name);
        }

    },this,true);
}

msgPaneCtrl.prototype.Search = function(matchDir) {

    //Remove rea_message_scrollltarget id if present

    // $('messages-pane .content-child-message').addClass('content-child-hidden');

    $('messages-pane #rea_message_scrolltarget').removeAttr('id');

    var targets = $('messages-pane .searchtarget');

    // //Remove rea_message_hilite class from elements

    targets.removeClass('rea_message_hilite');

    //Get Typed in Text

    var phrase = $('#rea_message_search').val();

    //If Empty we're done

    if(!phrase||phrase=='') {

        if(matchDir>0) {

            this.ScrollToEnd();

        }
        else if(matchDir<0) {

            this.ScrollToStart();
        }

        return;
      }
      else if(phrase!=''){

        //Get matches (caseless)

        phrase = phrase.toLowerCase();

        var matches = targets.filter(function(idx) {
            return this.innerHTML.toLowerCase().indexOf(phrase) >= 0;
        });

        //If no matches, reset index

        if(matches.length==0) {

            this.matchIndex = 0;

            return;
        }

        //Add hilite class to all matches

        matches.addClass('rea_message_hilite');

        //Set Match Index

        if(!matchDir||matchDir==0)this.matchIndex = 0;
        else if(matchDir<0) {

            this.matchIndex--;

            if(this.matchIndex<0)this.matchIndex = matches.length-1;
        }
        else {

            this.matchIndex++;

            if(this.matchIndex>=matches.length)this.matchIndex=0;
        }

        // && this.matchIndex!=0 && matches.length!=this.matchIndex+1

        if(matches.length>=this.matchIndex+1) {
            // console.log(matches.eq(this.matchIndex));
            $(".highlighted-selected").removeClass("highlighted-selected").addClass("highlighted");
            matches.eq(this.matchIndex).find("span").removeClass("highlighted").addClass("highlighted-selected");
            matches.eq(this.matchIndex).closest("section").show();

            var offset = matches.eq(this.matchIndex).closest("section").offset();

            $('html,body').animate({scrollTop: offset.top - 40}, 500);
        }
    }
}

msgPaneCtrl.prototype.GetMessages = function() {

    var that = this;

    this.msgColl.GetMessages(function() {

        that.messages = that.msgColl.messages;

        that.messageGroups = that.msgColl.messageGroups;

        that.files = that.FilterFiles(that.messages);

        that.scope.$apply();

    },this);
}

msgPaneCtrl.prototype.FilterFiles = function(messages) {

    let files = [];

    messages.forEach(message => {
     
        if(message.threads) {
            message.threads.forEach(thread => {
                if (thread.type === 'attachment' && thread.data.type === 'file') {
                    files.push(thread.data);
                }
            }); 
        }
    });
    return files;
}

msgPaneCtrl.prototype.AddMessage = function(event) {

    $(event.target).closest('.cancel-save').siblings('.emoji-wysiwyg-editor').text('');

    this.msgColl.AddMessage(function(message) {

    
   
        this.scope.$apply();

      
    },this)
}

msgPaneCtrl.prototype.ScrollToStart = function() {
var scrollableParentParentJS = $(".dvc_content-wrap")
    scrollableParentParentJS.animate({
        scrollTop: 0
    }, 'slow');
}

msgPaneCtrl.prototype.ScrollToEnd = function() {

    var scrollableParentParentJS = $(".dvc_content-wrap")
    var scrollableParentJS = $("section.messages")
    scrollableParentParentJS.animate({
        
        scrollTop: scrollableParentJS.height()
    }, 'slow');

  
}



msgPaneCtrl.prototype.mouseOverToggle = function(msg) {

    let that = this;
  
    if(that.clearTime){

        clearTimeout(that.clearTime);
    }

    that.clearTime = setTimeout(function(){

        if(!that._scrolling) {
            that.toggleHideShowMessages(msg) 
            if(msg._showThreads) {
         
              
                that.FocusOnReply(msg); 
            }
        };

    }, 500);
}

msgPaneCtrl.prototype.openThreadsOnDelay = function(msg) {

    let that = this;

    if(that.clearTime){
     
        clearTimeout(that.clearTime);
    }

    that.clearTime = setTimeout(function(){
    
        that.toggleHideShowMessages(msg);
        if(msg._showThreads) that.ScrollToReply(msg);
        if(msg._showThreads) that.FocusOnReply(msg);
        that.scope.$apply();
        
    }, 500);
}

msgPaneCtrl.prototype.mouseLeaveToggle = function() {

    if(this.clearTime){

        clearTimeout(this.clearTime);
    }
}

msgPaneCtrl.prototype.toggleHideShowMessages = function(msg) {
    if(this.clearTime){

        clearTimeout(this.clearTime);
    }

    msg._showThreads = msg._showThreads ? false :  true;

    
    // if(msg._showThreads) this.ScrollToReply(msg);
    
 
}

msgPaneCtrl.prototype.ScrollToReply = function(msg) {
    let that = this;
    setTimeout(function() {
        if(msg.threads.length > 1) {
                    var elementScrollTo = $('#rea_msg_'+msg.message.id+'-reply');
                    var elementScrollToJS = document.getElementById('rea_msg_'+msg.message.id+'-reply');
                    console.log($(elementScrollToJS))
                   
                    // console.log(scrollableParentJS)
                    // console.log($(elementScrollTo).height())
                    // console.log(elementScrollToJS.scrollHeight)
                     var scrollableParentJS = $("section.messages")
                     var scrollableParentParentJS = $(".dvc_content-wrap")
                    //  console.log("parent parent: " + scrollableParentParentJS)
                    //  console.log("parent parent innerHeight " + scrollableParentParentJS.innerHeight())
                    //  console.log("parent parent outer height " + scrollableParentParentJS.outerHeight())
                    //  console.log("aprent parent height " + scrollableParentParentJS.height())
                    //   console.log("parent parent clientheight " + scrollableParentParentJS[0].clientHeight)
                    //   console.log("elemnt offset top: " + elementScrollTo.offset().top);
                    //    console.log("elemnt position top: " + elementScrollTo.position().top);
                    //    console.log("supposed to be exact offset top: " + (scrollableParentParentJS.scrollTop() - elementScrollTo.offset().top))
                    //   console.log("parent parent scroll top: " +scrollableParentParentJS.scrollTop());
                    //   console.log("element scroll top: " + elementScrollTo.scrollTop())
                    //   console.log("new calc: " + (scrollableParentParentJS.scrollTop() + (elementScrollTo.position().top - scrollableParentParentJS.height())))
                    //   console.log("parent height " + scrollableParentJS.height());
                    // console.log("element height: "  +elementScrollTo.height())
                    //   console.log("the whole calc: " + elementScrollTo.offset().top -(scrollableParentParentJS.height() - elementScrollTo.height()))
                    //  scrollableParentParentJS.scrollTop(-100);
                     scrollableParentParentJS.animate({ scrollTop:  scrollableParentParentJS.scrollTop()  + elementScrollTo.offset().top - elementScrollTo.height() - scrollableParentParentJS.height()}, 300);
        }

    }, 300);
    // this.FocusOnReply(msg);
}

msgPaneCtrl.prototype.getScrollParent = function(node) {
    console.log("scroll Parents")
    console.log(node)
  if (node === null) {
    return null;
  }

  if (node.scrollHeight > node.clientHeight) {
      console.log("in node")
      console.log(node)
    return node;
  } else {
    return this.getScrollParent(node.parentNode);
  }
}


msgPaneCtrl.prototype.FocusOnReply = function(msg) {

    this.temporaryFile = null;

    setTimeout(function() {
    
                // console.log($('#rea_msg_'+msg.message.id+'-reply-message').siblings('.emoji-wysiwyg-editor'));
                 $('#rea_msg_'+msg.message.id+'-reply-message').siblings('.emoji-wysiwyg-editor').focus();


        }, 300);
}


msgPaneCtrl.prototype.ShowShare = function(event) {

    var parentElement = $(event.target).parent('.control-share');

    parentElement.find('.social-share').toggleClass('show');
}


msgPaneCtrl.prototype.ScrollToNewMessage = function() {
  

    // setTimeout(function() {$('#rea_message_new_input').focus()},500)
}

msgPaneCtrl.prototype.AddReply = function(msg, event) {

    if(!msg.replyText||msg.replyText=='')return;

    this.msgColl.AddReply(msg,function() {

        if(!msg.replyText||msg.replyText==''){

            msg.showReplyControls = false;
            msg.replyText=null;
            
            $('#rea_msg_'+msg.message.id+'-reply-message').siblings('.emoji-wysiwyg-editor').html("");
       
        }

        this.scope.$apply();
        this.ScrollToReply(msg);
    },this)
}


msgPaneCtrl.prototype.AddPropertySearch = function(msg) {

    var that = this;

    this.authCtrl.Login(function(result) {

        if(result!='success')return;

        if(that.propertySearches.length==0) {

            rea_util.Alert('You Currently Have No Saved Property Searches');

            return;
        }

        var data = {searches:that.propertySearches,name:'',body:'Added Property Search'};

        var dialogInst = that.modal.open({
            templateUrl: 'messages/addsearch.dlg.html',
            controller: 'AddSearchDlg',
            size:'lg',
            windowClass:'add-list',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        dialogInst.result.then(function (result) {

            that.msgColl.AddPropertySearchAttachment(msg,data.name,data.body,function(omsg){

                that.scope.$apply();
                that.ScrollToEnd();

            },this);

        }, function () {

        });

    },this)
}

msgPaneCtrl.prototype.AddPropertyList = function(msg) {

    var that = this;

    this.authCtrl.Login(function(result) {

        if(result!='success')return;

        if(that.propertyLists.length==0) {

            rea_util.Alert('You Currently Have No Saved Property Lists');

            return;
        }

        var data = {lists:that.propertyLists,name:'',body:'Added Property List'};

        var dialogInst = that.modal.open({
            templateUrl: 'messages/addlist.dlg.html',
            controller: 'AddListDlg',
            size:'lg',
            windowClass:'add-list',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        dialogInst.result.then(function (result) {

            that.msgColl.AddPropertyListAttachment(msg,data.name,data.body,function(omsg){

                this.scope.$apply();
                that.ScrollToEnd();

            },that);

        }, function () {

        });

    },this);
}

msgPaneCtrl.prototype.AddUploadFile = function(msg) {
   
    var data = {
        file: null,
        title:'',
        body: '',
        msg: msg,
        comment:''
    };

    var that  = this;

    $('#fileupload').off('change').on('change',function(){

        that.authCtrl.Login(function(result){

            if(result!='success')return;

            data.file = $('#fileupload')[0].files[0];

            var dialogInst = that.modal.open({
                templateUrl: 'messages/fileupload.dlg.html',
                controller: 'FileUploadDlg',
                size:'lg',
                windowClass:'upload-popup',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });

            dialogInst.result.then(function (result) {
                
                that.isUpload = true;
                that.isInUploadProgress = true;
                that.msgColl.tempMessage.bodyText = data.description;
                if(data.file){
                    that.msgColl.UploadFile(data.msg, data.file,data.title, data.description, function(err, msg) {
                        if (this.status && this.status === 'success') {
                            that.isUploadSuccess = true;
                            that.isInUploadProgress = false;
                            that.scope.$apply();
                        } else {
                            that.isUploadSuccess = false;
                            that.isInUploadProgress = false;
                            that.scope.$apply();

                        }
                        PubSub.publish('change.status',{value: false });
                        that.ScrollToEnd();

                    });

                }

            }, function () {

            });
        },this);
    })
    $('#fileupload').trigger('focus').trigger('click');
}

msgPaneCtrl.prototype.AddPropertyTour = function(msg) {

    var that = this;

    this.authCtrl.Login(function(result) {

        if(result!='success')return;

        if(that.propertyTours.length==0) {

            rea_util.Alert('You Currently Have No Saved Property Tours');

            return;
        }

        var data = {tours:that.propertyTours,name:'',body:'Added Property Tour'};

        var dialogInst = that.modal.open({
            templateUrl: 'messages/addtour.dlg.html',
            controller: 'AddTourDlg',
            size:'lg',
            windowClass:'add-list',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        dialogInst.result.then(function (result) {

            that.msgColl.AddPropertyTourAttachment(msg,data.name,data.body,function(omsg){

                this.scope.$apply();

                that.ScrollToEnd();

            },that);

        }, function () {

        });

    },this);
}

msgPaneCtrl.prototype.ViewFile = function(file) {
    file._url = rea_domain + file.url;
    this.fileViewerPopupService.previewFile(0, [file]);
}

msgPaneCtrl.prototype.ShareProperty = function(provider, property) { 
    console.log(provider)
    console.log(property)
    console.log(property.listingid)
    var propertyAddress = property.streetaddress.replace(/\s+/g, "-") + "-" + property.city.replace(/\s+/g, "-") + "-" + property.stateprovince.replace(/\s+/g, "-");
    var href = this.state.href("property", {address : propertyAddress, listingId: property.listingid}, {absolute : true});
    this.SocialShares(provider, href, property.streetaddress + ", " + property.city + ", " + property.stateprovince);
    // console.log(href)
    // return 'https://www.facebook.com/sharer/sharer.php?u=' + href;
}

msgPaneCtrl.prototype.SharePropertyTour = function(provider, propertyTour) {
    console.log(provider)
    var href = this.state.href("propertytour", {name : propertyTour}, {absolute : true});
    this.SocialShares(provider, href, propertyTour);
}
msgPaneCtrl.prototype.SharePropertyList = function(provider, propertyList) {
    var href = this.state.href("propertylist", {name : propertyList}, {absolute : true});
    this.SocialShares(provider, href, propertyList);
}
msgPaneCtrl.prototype.SharePropertySearch = function(provider, propertySearch) {
    console.log("share property search")
    console.log(propertySearch);
    var href = this.state.href("search", {searchName : propertySearch}, {absolute : true});
    this.SocialShares(provider, href, propertySearch);
}
msgPaneCtrl.prototype.SocialShares = function(provider, url, text){
    console.log("social shares")
    console.log(url)
    console.log(provider)
    console.log(text)
    this.Socialshare.share({
      'provider': provider,
      'attrs': {
        'socialshareUrl': url,
        'socialshareText' : text
      }
    });
}

msgPaneCtrl.prototype.ShowPropertyDetails= function(property) {
 
    var arr = [];
    arr.push(property);
    this.propertyDetailsCtrl.DisplayDetails(property.tablename,property.listingid, arr);
   
}

msgPaneCtrl.prototype.UploadPastedFile = function(msg,file) {

    var that = this;

    this.authCtrl.Login(function(result) {

        if(result!='success')return;

        var data = {comment:''};

        var dialogInst = that.modal.open({
            templateUrl: 'messages/uploadimage.dlg.html',
            controller: 'UploadImageDlg',
            size:'md',
            windowClass:'add-list',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        dialogInst.result.then(function (result) {
       
            that.msgColl.UploadPastedFile(msg,file,data.title,data.comment,function() {
            

                this.scope.$apply();

                setTimeout(function(){ $('html, body').animate({scrollTop : $(document).height() }, 300)}, 300) ;
            },that)

        }, function () {

        });

    },this);
}

msgPaneCtrl.prototype.IsNewMessage = function(adddate) {

    //var ONE_DAY = 24 * 60 * 60 * 1000;
    var TWO_MINUTE = 2 * 60 * 1000;
    var curTime = new Date();

    //current TimeZone of server -7 UTC
    var curTimeZone = -7;

    return (curTime.getTime()+ ((curTime.getTimezoneOffset()/60 + curTimeZone) * 60 * 60 * 1000)- Date.parse(adddate))<TWO_MINUTE;
}

mod.controller('AddListDlg', function($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.ok = function () {

        if(!data.name||data.name=='') {

            rea_util.Alert("Please Select A List");

            return;
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.controller('AddTourDlg', function($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.ok = function () {

        if(!data.name||data.name=='') {

            rea_util.Alert("Please Select A Tour");

            return;
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.controller('AddSearchDlg', function($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.ok = function () {

        if(!data.name||data.name=='') {

            rea_util.Alert("Please Select A Search");

            return;
        }

        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

mod.controller('UploadImageDlg', function($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.selectFile = function($file) {
        $scope.file = $file;
    }

    $scope.ok = function () {
        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});

//Message

mod.directive("message",messageDir);

function messageDir() {

    return {
        restrict: "E",
        templateUrl: "messages/message.tpl.html",
        scope: {
            msg: '<',
            isLast: '<',
            mpc: '<',
            searchKeyword: '<'                       
        },
        link: function(scope, element) {
            // console.log(scope.msg)
            scope.domain = rea_domain;

            if(scope.isLast) {
                // console.log(scope.msg);
                scope.mpc.toggleHideShowMessages(scope.msg);
                scope.mpc.ScrollToReply(scope.msg);
                scope.mpc.FocusOnReply(scope.msg);

            }

            if(scope.msg.messageGroup == "new") {
                scope.msg._showThreads = true;
            }
       

            var today = new Date().toDateString();

            scope.isNewMessage = function(date) {
                return false;
            }

            var emoji = $(element);
            
            var inputE = emoji.find('[data-emojiable]');

            if(inputE.length){

                var emojiPicker = new EmojiPicker({

                  emojiable_selector: '[data-emojiable=true]',

                  assetsPath: '/lib/img/',

                  popupButtonClasses: 'fa fa-smile-o'
                }).discover();

                var emojiDiv = emoji.find('.emoji-wysiwyg-editor');

                emojiDiv.on('keyup', function(){
                    inputE.val(emojiDiv.html());
                    inputE.trigger('change');
                });

                // emoji.data('emojiPicker', emojiPicker);
            }

            function getDateStringFromAddDate(adddate) {

                return moment(adddate, 'MMM D YYYY HH:mm A').toDate().toDateString();
            }                   
        }    
    };
}

mod.directive("messagePropertyCard",messagePropertyCardDir);

function messagePropertyCardDir() {

    return {
        restrict: "E",
        templateUrl: "messages/propertycard.tpl.html",
        bindToController: {
            property: '=',
        },
        controller: messagePropertyCardCtrl,
        controllerAs: 'messagePropertyCard',
        link: function (scope, element, attrs) {
            scope.property = scope.$eval(attrs.property);
        }
    }
}

function messagePropertyCardCtrl($scope) {

    this.domain = rea_domain;
}

//New Message

mod.directive("newMessage",newMessageDir);

function newMessageDir() {
    return {
        restrict: "E",
        templateUrl: "messages/newmessage.tpl.html",
        controller: newMsgCtrl,
        controllerAs: "nmc",
        link: function(scope, element){
                var emoji = $(element);   
                var inputE = emoji.find('[data-emojiable]')
                if(inputE.length){
                    var emojiPicker = new EmojiPicker({
                      emojiable_selector: '[data-emojiable=true]',
                      assetsPath: '/lib/img/',
                      popupButtonClasses: 'fa fa-smile-o'
                    }).discover();
                    var emojiDiv = emoji.find('.emoji-wysiwyg-editor');
                    emojiDiv.on('keyup', function(){
                        inputE.val(emojiDiv.html());
                        inputE.trigger('change');
                    });
                    PubSub.publish('binding.paste',{});

                    // emoji.data('emojiPicker', emojiPicker);
            }
        }
    }
}

mod.controller("newMsgCtrl",['messageCollection','$scope','$element',newMsgCtrl]);

function newMsgCtrl(messageCollection,$scope,$element) {

    nmc = this;
    this.msgColl = messageCollection;
    this.scope = $scope;
    nmc.msg = this.msgColl.tempMessage;
    nmc.showControls = false;
    nmc.isShowingSharedFiles = false;

    PubSub.publish("messages.init",{});
}

newMsgCtrl.prototype.TextChanged = function() {

    if(this.msg.bodyText.length==0) {

        this.showControls = false;
    }
    else {

        this.showControls = true;
    }
}

newMsgCtrl.prototype.ClearMessage = function(e) {
    
    this.TextChanged();
    $(event.target).closest('.cancel-save').siblings('.emoji-wysiwyg-editor').text('');
    // console.log($(event.target).closest('.cancel-save').siblings('.emoji-wysiwyg-editor'));
    //console.log($(event.target).parent('div').parent('div').find(".input-wrapper").eq(0).find('.emoji-wysiwyg-editor').eq(0));
  
    $(event.target).parent('div').parent('div').find(".input-wrapper").eq(0).find('.emoji-wysiwyg-editor').eq(0).html('');

    this.msg.Initialize();

    this.showControls = false;
}

newMsgCtrl.prototype.AddMessage = function() {

    if(this.msg.data.message.body.length==0) {

        rea_util.Alert('Please ,Enter A Message Before Sending');

        return;
    }

    this.msgColl.AddMessage(function(message) {
      
        // Upload file if user has selected a file
        if (this.temporaryFile) {
            this.temporaryFile = null;
            this.msgColl
                .UploadFile(message.message.id, this.temporaryFile)
                .then(function() {
                    console.log('Upload file successful');

                
                })
                .catch(function(err) {
                    alert('Error while uploading file');
                });

        }
        this.TextChanged();
        
        this.scope.$apply();
      

        //this.toggleHideShowMessages()

    },this);

}

mod.directive('fileViewerPopup', function() {

    return {
        restrict: 'E',
        templateUrl: 'messages/file-viewer-popup.html',
        link: function(scope) {
            scope.isShowing = false;

            scope.$on('openFileViewerPopup', function(event, args) {
                scope.index = args.index;
                scope.files = args.files;
                scope.fileUrl = scope.files[scope.index]._url;
                scope.fileName = scope.files[scope.index].name;
                scope.isShowing = true;
                scope.fileType = getFileType(scope.fileUrl);
            });

            scope.closePopup = function() {
                scope.isShowing = false;
            }
            scope.nextFile = function() {
              
                scope.index = scope.index + 1;
                scope.fileUrl = scope.files[scope.index]._url;
                scope.fileType = getFileType(scope.fileUrl);
            }
            scope.prevFile = function() {
              
                scope.index = scope.index - 1;
                scope.fileUrl = scope.files[scope.index]._url;
                scope.fileType = getFileType(scope.fileUrl);
            }
           
            function getFileType(fileUrl) {
              
                var imageExts = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];
                var fileUrlArray = fileUrl.split('.');
                if (fileUrlArray.length === 0) return 'unknown';
                var ext = fileUrlArray[fileUrlArray.length - 1];
                if (ext === 'pdf') {
                    return 'pdf';
                } else if (imageExts.indexOf(ext) !== -1) {
                    return 'image';
                }
                return 'unknown';
            }

        
        }
    }
});

mod.service('fileViewerPopupService', function($rootScope, $timeout) {

    var that = this;

    that.previewFile = function(index, files) {

        $timeout(function() {
            $rootScope.$broadcast('openFileViewerPopup', {
                index: index,
                files: files
            });
        }, 500);

        $rootScope.$on('openFileViewerPopup', function(e, args) {
            // console.log(args);
        });
    }
})

mod.directive('uploadedFiles', function(fileViewerPopupService, $timeout) {

    return {
        restrict: 'E',
        templateUrl: 'messages/uploaded-files.html',
        scope: {
            isShowingSharedFiles: '=',
            files: '<'
        },
        link: function(scope, element) {
            let availableExts = [
                'doc', 'jpg', 'pdf', 'png', 'xls', 'jpeg'
            ];
          
            let itemWidth = 0;
            let maxWidth = 0;
            let actualWidth = 0;
            scope.fileListOffsetX = 0;
            scope.files.map(function(file) { file._url = rea_domain + file.url; });
            scope.toggleFileList = function() {
                scope.isShowingSharedFiles = !scope.isShowingSharedFiles;
                if (scope.isShowingSharedFiles === true) {
                    $timeout(function() {
                        calculateSize();
                        //   console.log(scope.files)
                    }, 100);
                }
            }

            scope.openFile = function(index) {
                fileViewerPopupService.previewFile(index, scope.files);
            }

            scope.moveLeft = function() {
                if (scope.fileListOffsetX < 0) {
                    scope.fileListOffsetX += (itemWidth + 10);
                }
            }

            scope.moveRight = function() {
                if (Math.abs(scope.fileListOffsetX) + actualWidth < maxWidth) {
                    scope.fileListOffsetX -= (itemWidth + 10);
                }
            }

            scope.getFileTypeImage = function(file) {
                let ext = getFileExt(file);
         
                return 'images/file-' + ext + '.png';
            }

            scope.getSmallFileTypeImage = function(file) {
                let ext = getFileExt(file);
                return 'images/file-' + ext + '-icon.png';
            }

            scope.formatTime = function(file) {
                return moment(file.adddate, 'MMM D YYYY HH:mm A').fromNow();
            }

            function calculateSize() {
                console.log("calculate size");
                itemWidth = $(element).find('.file-item:eq(0)').outerWidth();
                maxWidth = scope.files.length * (itemWidth + 10);
                actualWidth = $(element).find('.file-list-wrapper').innerWidth();
                scope.fileListOffsetX = 0;
            }

            function getFileExt(file) {
                let nameArr = file.name.split('.');
                let ext = nameArr[nameArr.length - 1];
                

                var foundExts =availableExts.filter(function(instant) { return instant.toLowerCase() == ext.toLowerCase()});
                // console.log(foundExts.length > 0 ? foundExts[0] : 'pdf')
                return foundExts.length > 0 ? foundExts[0] : 'pdf';
                // if (availableExts.indexOf(ext.toLowerCase()) !== -1) {
                //     return ext;
                // }
                // return 'pdf';
            }
        }
    }
})
