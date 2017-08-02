function MessageCollection() {

    this.messages = [];

    this.tempMessage = new Message();

    this.MessagesRequest = null;
}

MessageCollection.prototype.GetMessages = function(successCallback,context) {

    if(this.MessagesRequest!=null) {

        this.MessagesRequest.abort();

        this.MessagesRequest = null;
    }

    var that = this;

    this.MessagesRequest = $.ajax({

        url:rea_domain+'/messages/messages',
        cache: false,
        data: "",
        dataType: 'json',
        method: 'GET',
        success: function (messages) {

            this.messages = [];

            for(var n=0;n<messages.length;n++) {

                var msg = messages[n];

                if(msg.message.body)msg.message.body = msg.message.body.replace(/\n/g,'<BR>');

                for(var i=0;i<msg.threads.length;i++) {

                    var thread = msg.threads[i].data;

                    if(thread.body)thread.body = thread.body.replace(/\n/g,'<BR>');
                }

                var message = new Message(messages[n]);

                that.messages.push(message);
            }

            successCallback.call(context,null);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error retrieving messages: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

            that.MessagesRequest = null;
        }
    });
}

MessageCollection.prototype.AddMessage = function(successCallback,context) {

    var that = this;

    $.ajax({

        url:rea_domain+'/messages/addmessage',
        cache: false,
        data: "body="+this.tempMessage.bodyText+"&messageid=0",
        dataType: 'json',
        method: 'POST',
        success: function (message) {

            if(message.message.body)message.message.body=message.message.body.replace(/\n/g,'<BR>');

            var msg = new Message(message);

            that.messages.push(msg);

            that.tempMessage.Initialize();

            if(successCallback)successCallback.call(context,message)
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error adding temporary message: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

            that.ListingIDRequest = null;
        }
    });
}

MessageCollection.prototype.AddReply = function(message,successCallback,context) {

    $.ajax({

        url:rea_domain+'/messages/addreply',
        cache: false,
        data: "messageid="+message.message.id+"&body="+message.replyText,
        dataType: 'json',
        method: 'POST',
        success: function (thread) {

            if(thread.data.body)thread.data.body=thread.data.body.replace(/\n/g,'<BR>');

            message.threads.push(thread);

            message.replyText = '';

            if(successCallback)successCallback.call(context,thread);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error adding message reply: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}

MessageCollection.prototype.AddPropertyAttachments = function(message,propertyIDs,body,successCallback,context) {

    var temporary = message==null||message.message.id==0;

    var params = "messageid="+(message==null ? 0:message.message.id)+"&type=property";

    if(rea_util.IsNumber(propertyIDs)) {

        params += "&savedpropertyid="+propertyIDs;
    }
    else {

        params += "&savedpropertyids="+propertyIDs;
    }

    if(body)params += '&body='+body;

    var that = this;

    $.ajax({

        url:rea_domain+'/messages/addattachment',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        xhrFields: {
            withCredentials: true
        }, 
        success: function (msg) {

            if(temporary) {

                msg = new Message(msg);

                that.messages.push(msg);

                that.tempMessage.Initialize();
            }
            else {

                for(var n=0;n<msg.threads.length;n++) {

                    message.threads.push(msg.threads[n]);
                }
            }

            if(successCallback)successCallback.call(context,msg);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error adding message property attachment: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}

MessageCollection.prototype.AddPropertyListAttachment = function(message,propertyList,body,successCallback,context) {

    var params = "messageid="+message.message.id+"&type=propertylist";

    if(rea_util.IsNumber(propertyList))params += "&propertylistid="+propertyList;
    else params += "&propertylistname="+propertyList;

    if(body)params += "&body="+body;

    var temporary = message.message.id==0;

    var that = this;

    $.ajax({

        url:rea_domain+'/messages/addattachment',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        xhrFields: {
            withCredentials: true
        }, 
        success: function (msg) {

            if(temporary) {

                msg = new Message(msg);

                that.messages.push(msg);

                that.tempMessage.Initialize();
            }
            else {

                message.threads=msg.threads;
            }

            if(successCallback)successCallback.call(context,msg);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error adding property list attachment: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}

MessageCollection.prototype.AddPropertyTourAttachment = function(message,propertyTour,body,successCallback,context) {

    var params = "messageid="+message.message.id+"&type=propertytour";

    if(rea_util.IsNumber(propertyTour))params += "&propertytourid="+propertyTour;
    else params += "&propertytourname="+propertyTour;

    if(body)params += "&body="+body;

    var temporary = message.message.id==0;

    var that = this;

    $.ajax({

        url:rea_domain+'/messages/addattachment',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        xhrFields: {
            withCredentials: true
        }, 
        success: function (msg) {

            if(temporary) {

                msg = new Message(msg);

                that.messages.push(msg);

                that.tempMessage.Initialize();
            }
            else {

                message.threads=msg.threads;
            }

            if(successCallback)successCallback.call(context,msg);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error adding property tour attachment: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}

MessageCollection.prototype.AddPropertySearchAttachment = function(message,propertySearch,body,successCallback,context) {

    var params = "messageid="+message.message.id+"&type=savedsearch";

    if(rea_util.IsNumber(propertySearch))params += "&savedsearchid="+propertySearch;
    else params += "&savedsearchname="+propertySearch;

    if(body)params += "&body="+body;

    var temporary = message.message.id==0;

    var that = this;

    $.ajax({

        url:rea_domain+'/messages/addattachment',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        xhrFields: {
            withCredentials: true
        }, 
        success: function (msg) {


            if(temporary) {

                msg = new Message(msg);

                that.messages.push(msg);

                that.tempMessage.Initialize();
            }else{
               message.threads=msg.threads; 
            }

            if(successCallback)successCallback.call(context,msg);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error adding property tour attachment: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}

MessageCollection.prototype.UploadPastedFile = function(message,file,title,comment,successCallback,context) {

    //https://stackoverflow.com/questions/18055422/how-to-receive-php-image-data-over-copy-n-paste-javascript-with-xmlhttprequest

    var that = this;

    var temporary = message.message.id==0;

    var extension = file.type.match(/\/([a-z0-9]+)/i)[1].toLowerCase();

    var formData = new FormData();

    formData.append('file', file);
    formData.append('extension', extension );
    formData.append("mimetype", file.type );
    formData.append('submission-type', 'paste');
    formData.append('messageid',message.message.id.toString());
    if(title)formData.append('title',title);
    if(comment)formData.append('comment',comment);

    var xhr = new XMLHttpRequest();
    
    xhr.withCredentials = true;
    xhr.responseType = "json";

    xhr.open('POST', rea_domain+'/messages/uploadattachment');

    xhr.onload = function () {

        if (xhr.status == 200) {

            var msg = xhr.response;

            if(temporary) {

                msg = new Message(msg);

                that.messages.push(msg);

                that.tempMessage.Initialize();
            }
            else {

                message.threads=msg.threads;
            }

            if(successCallback)successCallback.call(context,msg);
        }
        else {

            console.log("Error uploading file: "+xhr.status+" url:"+this.url)
        }
    };

    xhr.send(formData);
}

MessageCollection.prototype.UploadFile = function(message,file,title,comment,successCallback,context) {

    var that = this;

    var temporary = message.message.id==0;

    var extension = file.type.match(/\/([a-z0-9]+)/i)[1].toLowerCase();

    var formData = new FormData();

    formData.append('file', file);
    formData.append('extension', extension );
    formData.append("mimetype", file.type );
    formData.append('submission-type', 'input');
    formData.append('messageid',message.message.id.toString());
    if(comment)formData.append('comment',comment);
    if(title)formData.append('title',title);

    var xhr = new XMLHttpRequest();

    xhr.responseType = "json";

    xhr.open('POST',rea_domain + '/messages/uploadattachment');

    xhr.onload = function () {

        if (xhr.status == 200) {

            var msg = xhr.response;

            if(temporary) {

                msg = new Message(msg);

                that.messages.push(msg);

                that.tempMessage.Initialize();
            }
            else {

                message.threads=msg.threads;
            }

        }

        else {

            console.log("Error uploading file: "+xhr.status+" url:"+this.url)
        }
        if(successCallback){
            successCallback.call({context:context, msg: msg, status: xhr.status == 200? 'success': 'fail'});
        }
    };

    xhr.send(formData);
}

//Message Class

function Message(data) {

    this.tempMessage = false;

    this.message = {};

    this.threads = [];

    this.bodyText = "";

    this.replyText = "";

    this.showReplyControls = false;

    if(!data) {

        this.Initialize();
    }
    else {

        this.message = data.message;

        this.threads = data.threads;
    }
}

Message.prototype.Hilite = function() {

    return false;
}

Message.prototype.ReplyTextChanged = function() {

    if(this.replyText.length>0) {

        this.showReplyControls=true;
    }
    else {

        this.showReplyControls=false;
    }
}

Message.prototype.Initialize = function() {

    this.tempMessage = true;

    this.message.id = 0;

    this.message.senderIcon = 'images/avatar.png';

    this.message.senderName = 'Me';

    this.message.adddate = null;

    this.message.body = '';

    this.threads = [];

    this.bodyText = '';

    this.replyText = '';
}



