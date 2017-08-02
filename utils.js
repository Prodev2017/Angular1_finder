var rea_util =
    {
        _WaitTimer: null,
        _NumberPattern: new RegExp(/^\d+\.?\d*$/),
        SaveToDisk: function (fileURL, fileName) {
            // for non-IE
            if (!window.ActiveXObject) {
                var save = document.createElement('a');
                save.href = fileURL;
                save.target = '_blank';
                save.download = fileName || 'unknown';

                var event = document.createEvent('Event');
                event.initEvent('click', true, true);
                save.dispatchEvent(event);
                (window.URL || window.webkitURL).revokeObjectURL(save.href);
            }

            // for IE
            else if (!window.ActiveXObject && document.execCommand) {
                var _window = window.open(fileURL, '_blank');
                _window.document.close();
                _window.document.execCommand('SaveAs', true, fileName || fileURL)
                _window.close();
            }
        },
        Alert: function (text) {

            swal(text);
        },
        ConfirmAction: function (text,button, callback) {

            swal({
                    text:text,
                    title: 'Are You Sure?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: button,
                    closeOnConfirm:true
                },
                callback
            );
        },
        FlashMessage: function (message, duration) {

            if (!duration) duration = 500;

            var msg = $("<div style='position:fixed;left:50%;top:50%;transform: translate(-50%, -50%);z-index:2000;padding:20px;background-color:white;border: 1px solid black;border-radius:10px'>" + message + "</div>");

            $('body').append(msg);

            setTimeout(function () {
                msg.fadeOut(300, function () {
                    msg.remove()
                })
            }, duration)
        },
        IsValidEMail: function (email) {

            var validEmailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return validEmailPattern.test(email);
        },
        IsValidPhone: function (phone) {

            var validPhoneNumberPattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

            return validPhoneNumberPattern.test(phone);
        },
        IsNumber: function(value) {
            return rea_util._NumberPattern.test(value);
        },
        StringAfter: function(string,pattern) {

            var index = string.indexOf(pattern);

            if(index<0)return string;

            return string.substring(index+pattern.length);
        },
        ContainsString: function(string,pattern) {

            return string.indexOf(pattern)>=0;
        },
        StringUpTo: function (string,pattern) {

            var index = string.indexOf(pattern);

            if(index<0)return string;

            return string.substring(0,index);
        },
        ThousandsDelimit: function(string) {

            return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        QueryToObject:function(query) {

            return JSON.parse('{"' + decodeURI(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        },
        ObjectToQuery:function(obj) {

            var query = '';

            var first = true;

            for (var attrname in obj) {

                if(!first) {

                    query += '&';
                }

                first = false;

                query += attrname+'='+obj[attrname];
            }

            return query;
        },
        CenterDiv: function (target, dest) {

            var tWindow = $(target);

            var tWindowWidth = tWindow.outerWidth(true);

            var tWindowHeight = tWindow.outerHeight(true);

            var vWidth = window.innerWidth ? window.innerWidth : $(window).width();

            var vHeight = window.innerHeight ? window.innerHeight : $(window).height();

            if (dest) {

                vWidth = $(dest).width();

                vHeight = $(dest).height();
            }

            tWindow.css({
                "position": "fixed",
                "top": ((vHeight / 2) - (tWindowHeight / 2)) + "px",
                "left":((vWidth / 2) - (tWindowWidth / 2)) + "px"
            });
        },
        IsObject: function(a) {

            return (!!a) && (a.constructor === Object);
        },
        IsArray:function(a) {
            return (!!a) && (a.constructor === Array);
        },
        IsEmptyObject: function (obj) {

            for (var prop in obj) {

                if (Object.prototype.hasOwnProperty.call(obj, prop)) {

                    return false;
                }
            }

            return true;
        },
        CreateCookie: function(name,value,days){

            if (days) {

                var date = new Date();

                date.setTime(date.getTime()+(days*24*60*60*1000));

                var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";

            document.cookie = name+"="+value+expires+"; path=/";
        },
        RemoveCookie: function(name) {

            rea_util.CreateCookie(name,"",-1);
        },
        ShowWaitPopup: function(show,message,delay) {

            if(rea_util._WaitTimer!=null) {

                clearTimeout(rea_util._WaitTimer);

                rea_util._WaitTimer = null;
            }

            if(show)
            {
                if(delay!=null&&delay>0) {

                    _WaitTimer = setTimeout(function() {_WaitPopup(message)},delay);
                }
                else {

                    _WaitPopup(message);
                }
            }
            else {

                $('#rea_wait_popup').hide();
            }
        },
        IsMobile : {
                Android: function() { return navigator.userAgent.match(/Android/i); },
                BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
                iOS: function() { return navigator.userAgent.match(/iPhone|iPod/i); },
                Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
                Windows: function() { return navigator.userAgent.match(/IEMobile/i); },
                Any: function() { return rea_util.IsMobile.Android() || rea_util.IsMobile.BlackBerry() || rea_util.IsMobile.iOS() || rea_util.IsMobile.Opera() || rea_util.IsMobile.Windows(); }
        },
        IsNarrow : function() {

            return $(window).width()<768;
        },
        _WaitPopup: function(message) {

            if(message==null)message="Processing Your Request";

            var wait = $('#rea_wait_popup');

            if(wait.length==0) {

                $('body').append('<div id="rea_wait_popup" style="display:none;z-index:1500;color:black;border:2px solid black;text-align:left;padding:16px;"><div style="float:left;font-size:16px;font-weight:bold;padding-top:10px;padding-right:10px;">'+message+'</div><img src="/app/images/ajax-loader.gif"></div>');

                wait = $('#rea_wait_popup');
            }

            CenterWindow(wait);

            wait.show();
        }
    }
