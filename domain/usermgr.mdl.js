function UserManager() {

    this.isAuthenticated = false;

    this.leadID = null;

    this.name = '';

    this.email = '';
}

UserManager.prototype.RequiresLogin = function() {

    var requiresLogin = this.requiresLogin;

    this.requiresLogin = false;

    return requiresLogin;
}

//Profile Data

UserManager.prototype.GetInfo = function(successCallback,context) {

    var that = this;

    $.ajax({

        url:rea_domain+'/leads/leadinfo',
        cache: false,
        data: "",
        dataType: 'json',
        method: 'GET',
        success: function (info) {

            that.leadID = info.leadid;

            that.name = info.name;

            that.email = info.email;

            //that.isAuthenticated = info.isauthenticated;

            if(successCallback)successCallback.call(context,info);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting lead info: "+status+" url:"+this.url)
        },
        complete: function() {

        }
    });
}

UserManager.prototype.GetContactInfo = function(successCallback,context) {

    $.ajax({

        url:rea_domain+'/leads/contactinfo',
        cache: false,
        data: "",
        dataType: 'json',
        method: 'GET',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error getting contact info: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}

UserManager.prototype.UpdateContactInfo = function(contactinfo,successCallback,context) {

    var params = "firstname="+contactinfo.firstname+"&lastname="+contactinfo.lastname+"&emailaddress="+contactinfo.email+"&mobilephone="+contactinfo.mobilephone+"&homephone="+contactinfo.homephone;

    $.ajax({

        url:rea_domain+'/leads/updatecontactinfo',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error updating contact info: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}

UserManager.prototype.Login = function(email,password,successCallback,context) {

    var that = this;

    $.ajax({

        url:rea_domain+'/leads/login',
        cache: false,
        data: "emailaddress="+email+"&password="+password,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(response.status=='success') {

                that.isAuthenticated = true;

                that.leadID = response.leadid;

                that.name = response.name;

                that.email = response.email;
            }
            else {

                that.isAuthentcated = false;
            }

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error logging in: "+status+" url:"+this.url)
        },
        complete: function() {

        }
    });
}

UserManager.prototype.Register = function(firstname,lastname,email,mobilephone,password,working,market,successCallback,context) {

    var that = this;

    if(!mobilephone)mobilephone='';

    var params = "firstname="+firstname+"&lastname="+lastname+'&emailaddress='+email+'&mobilephone='+mobilephone+'&password='+password+'&working='+working;

    var markettype = [];

    for(var attrname in market) {

        if(market[attrname])markettype.push(attrname);
    }

    if(markettype.length>0) {

        params += '&markettype='+markettype.join(',');
    }

    $.ajax({

        url:rea_domain+'/leads/register',
        cache: false,
        data: params,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(response.status=='success') {

                that.name = firstname;

                that.email = email;

                that.isAuthenticated = true;

                response.isAuthenticated = true;
            }
            else {

                response.isAuthenticated = false;
            }

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error logging in: "+status+" url:"+this.url)
        },
        complete: function() {

        }
    });
}

UserManager.prototype.ForgotPassword = function(email,successCallback,context) {

    var that = this;

    $.ajax({

        url:rea_domain+'/leads/forgotpassword',
        cache: false,
        data: "emailaddress="+email,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error logging in: "+status+" url:"+this.url)
        },
        complete: function() {

        }
    });
}

UserManager.prototype.UpdatePassword = function(currentPassword,newPassword,successCallback,context) {

    $.ajax({

        url:rea_domain+'/leads/updatepassword',
        cache: false,
        data: "currentpassword="+currentPassword+"&newpassword="+newPassword,
        dataType: 'json',
        method: 'POST',
        success: function (response) {

            if(successCallback)successCallback.call(context,response);
        },
        error: function(xhr,status) {

            if(!status)status='';

            console.log("Error updating password: "+status+" url:"+this.url+" data:"+this.data)
        },
        complete: function() {

        }
    });
}

