var app = angular.module("myMod",['ngSanitize','ngAnimate','mgcrea.ngStrap']);

app.config(function($modalProvider) {
    angular.extend($modalProvider.defaults, {
        html: true
    });
})

app.directive("messagesPane",messagesDir);

function messagesDir() {
    return {
        restrict: "E",
        templateUrl: "test.tpl.html",
        controller: msgsCtrl,
        controllerAs: "vm"
    };
}

app.controller("msgsCtrl",msgsCtrl);

function msgsCtrl($uibModal){

    var vm = this;

    vm.modal = $uibModal;

    vm.searchTest = "";

    vm.messageData =
        [
            {
                messageId: 1,
                senderIcon: '../images/avatar.png',
                senderName: 'Jim',
                timeStamp: '9:28 PM Mar 13',
                body: 'this is message 1',
                replies:
                [
                    {
                        replyId: 1,
                        senderIcon: '../images/avatar.png',
                        senderName: 'Me',
                        timeStamp: '9:28 PM Mar 13',
                        body: 'I understand 1'
                    }
                ],
                propertysearches:
                [
                    {
                        searchId: 1,
                        name: 'Burnaby - Metrotown',
                        description: ['price:Up to $100,000','beds: 1 to 2'],
                        args: ''
                    }
                ],
                propertylists:
                [
                    {
                        listId: 1,
                        name: 'My List',
                        length: 21
                    }
                ],
                files:
                [
                    {
                        attachmentId: 1,
                        name: 'sample_lab_writeup_ib.pdf',
                        url:'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwiYuZ72wP_SAhVE3mMKHUTqBJ4QFggcMAA&url=http%3A%2F%2Fwww.cabarrus.k12.nc.us%2Fsite%2Fhandlers%2Ffiledownload.ashx%3Fmoduleinstanceid%3D67901%26dataid%3D214541%26FileName%3Dsample%2520%2520lab%2520write%2520up.pdf&usg=AFQjCNH_EAPzpvEvkGsk-dMQ3HbLreKmaw&sig2=Eqrh1vHli1NpXkXo041cQA'
                    },
                    {
                        attachmentId: 2,
                        name: 'properties2.pdf',
                        url:''
                    }
                ],
                propertyphotos:
                [

                ],
                images:
                [
                    'http://scene7.targetimg1.com/is/image/Target/51696939?wid=328&hei=328&qlt=80&fmt=pjpeg'
                ]
            },
            {
                messageId: 2,
                senderIcon: '../images/avatar.png',
                senderName: 'Me',
                timeStamp: '9:28 PM Mar 14',
                body: 'this is message 2',
                replies:
                    [
                        {
                            replyId: 3,
                            senderIcon: '../images/avatar.png',
                            senderName: 'Jim',
                            timeStamp: '9:28 PM Mar 13',
                            body: 'I understand 2'
                        }
                    ],
                propertysearches:
                [

                ],
                propertylists:
                [

                ],
                files:
                [
                    {
                        attachmentId: 3,
                        type: 'file',
                        name: 'properties.pdf',
                        url: ''
                    }
                ],
                propertyphotos:
                [

                ],
                images:
                [

                ]
            }
        ];

    vm.messages = [];

    for(var i=0;i<vm.messageData.length;i++) {

        vm.messages.push(new message(vm.messageData[i],vm.modal));
    }
}

msgsCtrl.prototype.StartSearch = function() {

    alert("Start Search");
}

msgsCtrl.prototype.ScrollToStart = function() {

    alert("Scroll To Start");
}

msgsCtrl.prototype.ScrollToEnd = function() {

    $('html, body').animate({
        scrollTop: $(document).height()
    }, 'slow');
}

msgsCtrl.prototype.NewMessage = function() {

    this.ScrollToEnd();

    $('new-message textarea').focus();
}

msgsCtrl.prototype.AddMessage = function(msg) {

    this.messages.push(msg);
};

msgsCtrl.prototype.AddFile = function(msg) {

    alert('msgsCtrl Add File');
}

msgsCtrl.prototype.Searches = function() {

    return [{searchid: 1,name:'Search 1'}, {searchid: 2,name:'Search 2'}]
}

app.directive("message",messageDir);

function messageDir() {
    return {
        restrict: "E",
        templateUrl: "testmessage.tpl.html"
    };
}

app.directive("newMessage",newMessageDir);

function newMessageDir() {
    return {
        restrict: "E",
        templateUrl: "testnewmessage.tpl.html",
        controller: newMsgCtrl,
        controllerAs: "nm"
    }
}

app.controller("newMsgCtrl",newMsgCtrl);

function newMsgCtrl() {

    nm = this;

    nm.msg = new message(null);

    nm.showControls = false;

    nm.showAttachments = false;
}

newMsgCtrl.prototype.TextChanged = function() {

    if(nm.msg.data.body.length==0) {

        nm.showControls = false;
    }
    else {

        nm.showControls = true;
    }
}

newMsgCtrl.prototype.AddMessage = function(collection) {

    if(!collection) {

        console.log("Error newMsgCtrl.AddMessage no collection specified");

        return;
    }

   nm.msg.data.timestamp = Date.now();

   collection.AddMessage(new message(nm.msg.data));

   this.ClearMessage();
}

newMsgCtrl.prototype.ClearMessage = function() {

    nm.msg.Initialize();

    nm.showControls = false;

}


/*app.directive("testPane",function () {
    return {
        restrict: "E",
        transclude: true,
        controller: "myCtrl",
        template: "<div ng-transclude></div>"
         };
});*/



