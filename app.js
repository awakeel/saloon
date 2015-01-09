define(['jquery','language/collections/languages'], function (jquery,Language) {
    'use strict';
    var app = Backbone.Model.extend({
        load: function (callback) {
        	 this.language = {};
        	 this.selectedLanguage = 1;
        	 this.jobTypes = {};
        	 this.services = {};
             this.set(_.extend({
                env: 'TEST',
                complied: 1,
                bms_token: '123',
                user_Key: 'KEY123',
                images_CDN: 'imgcdn',
                host: window.location.hostname,
                path: 'PATH',
                session: null,
                cache_data: {}
            }, window.sz_config || {}));
			  this.objLanguage = new Language();
			  var that = this;
			    this.objLanguage.fetch({data: {specific:1,languageid:this.selectedLanguage}, success: function(data) {
                                    //alert(key.languagetitle);
			    	  _.each(data.toJSON(), function( key, value ) {
			    		  that.language[key.title] = key.languagetitle;
			    	 }) 
			    	  if ($.isFunction(callback)) {
			            callback.call();
			          }
			    }}); 
        },
        
 
        getUser: function () {
            var URL = "";
            jQuery.getJSON(URL, _.bind(function (tsv, state, xhr) {
                var _json = jQuery.parseJSON(xhr.responseText);
                if (this.checkError(_json)) {
                    return false;
                }
                this.set("user", _json);
                var allowedAdmin = ['admin', 'jayadams', 'demo'];
                if (allowedUser.indexOf(this.get("user").userId) > -1) {
                    this.mainContainer.$(".local-adds").hide();
                }
                else {
                    this.mainContainer.$(".local-adds").hide();
                }
               

            }, this)); 
        }, 
        clearCache: function () {
            window.setTimeout(_.bind(this.removeAllCache, this), 1000 * 60 * 30);
        },
        checkError: function (result) {
            var isError = false;
            if (result && result[0] && result[0] == "err") {
                isError = true;
            }
            return isError;
        },
        autoLoadImages: function () {
            var preLoadArray = []
            $(preLoadArray).each(function () {
                var image = $('<img />').attr('src', this);
            });
        }, 
        showLoading: function (message, container, _styles) {
            var divStyles = "";
            if (message) {
                message = message !== true ? message : 'Loading...';
                $(container).find('.loading').remove();
                if (_styles) {
                    _.each(_styles, function (val, key) {
                        divStyles += key + ":" + val + ";"
                    }, this);
                }
                $(container).append('<div class="loading"><p style=' + divStyles + '>' + message + '</p></div>');
            }
            else {
                $(container).find(' > .loading').remove();
            }
        },
        showAlert: function (message, container, option) {
            if (message) {
                var inlineStyle = (option && option.top) ? ('top:' + option.top) : '';
                var fixed_position = (option && option.fixed) ? "fixed" : "";
                var cl = 'error';
                var title = 'Error';
                if (option && option.type == 'caution')
                {
                    cl = 'caution';
                    title = 'Caution';
                }

                var message_box = $('<div class="messagebox messsage_alert messagebox_ ' + cl + '" style=' + inlineStyle + '><h3>' + title + '</h3><p>' + message + '</p><a class="closebtn"></a></div> ');
                $(container).append(message_box);
                message_box.find(".closebtn").click(function (e) {
                    message_box.fadeOut("fast", function () {
                        $(this).remove();
                    })
                    e.stopPropagation()
                });
            }
        } ,
        showAlertPopup: function (message, container) {
            if (message) {
                var dialogHTML = '<div class="overlay"></div><div class="messagebox messagebox_ delete"><h3>' + message.heading + '</h3>';
                var btn = '<div class="btns"><a class="btn-red btn-ok"><span>Yes, ' + message.text + '</span><i class="icon ' + message.icon + '"></i></a><a class="btn-gray btn-cancel"><span>No, Cancel</span><i class="icon cross"></i></a></div><div class="clearfix"></div>';
                dialogHTML += '<p>' + message.detail + '</p>' + btn + '</div>';
                var dialog = $(dialogHTML);
                $(container).append(dialog);
                dialog.find(".btn-ok").click(function () {
                    dialog.fadeOut("fast", function () {
                        $(this).remove();
                    });
                    if (message.callback)
                        message.callback();
                });

                dialog.find(".btn-gray").click(function () {
                    dialog.fadeOut("fast", function () {
                        $(this).remove();
                    })
                });
            }
        },
        showLoginExpireAlert: function (message, container) {
            if (message) {
                var dialogHTML = '<div class="overlay"><div class="messagebox caution"><h3>' + message.heading + '</h3>';
                var btn = '<div class="btns"><a href="/pms/" class="btn-green btn-ok"><span>Login</span><i class="icon next"></i></a></div><div class="clearfix"></div>';
                dialogHTML += '<p>' + message.detail + '</p>' + btn + '</div></div>';
                $(container).append(dialogHTML);
                $(".overlay .btn-ok").click(function () {
                    if (message.callback)
                        message.callback();
                });
            }
        },
        showMessge: function (msg) {
            $(".global_messages p").html(msg);
            $(".global_messages").show();
            var marginLeft = $(".global_messages").width() / 2;
            $(".global_messages").css("margin-left", (-1 * marginLeft) + "px");
            $(".global_messages").hide();
            $(".global_messages").slideDown("medium", function () {
                setTimeout('$(".global_messages").hide()', 4000);
            });
            $(".global_messages .closebtn").click(function () {
                $(".global_messages").fadeOut("fast", function () {
                    $(this).hide();
                })
            });
        },
        encodeHTML: function (str) {
            str = str.replace(/:/g, "&#58;");
            str = str.replace(/\'/g, "&#39;");
            str = str.replace(/=/g, "&#61;");
            str = str.replace(/\(/g, "&#40;");
            str = str.replace(/\)/g, "&#41;");
            str = str.replace(/</g, "&lt;");
            str = str.replace(/>/g, "&gt;");
            str = str.replace(/\"/g, "&quot;");
            return str;
        }
        ,
        decodeHTML: function (str, lineFeed) {
            //decoding HTML entites to show in textfield and text area 				
            str = str.replace(/&#58;/g, ":");
            str = str.replace(/&#39;/g, "\'");
            str = str.replace(/&#61;/g, "=");
            str = str.replace(/&#40;/g, "(");
            str = str.replace(/&#41;/g, ")");
            str = str.replace(/&lt;/g, "<");
            str = str.replace(/&gt;/g, ">");
            str = str.replace(/&gt;/g, ">");
            str = str.replace(/&#9;/g, "\t");
            str = str.replace(/&nbsp;/g, " ");
            str = str.replace(/&quot;/g, "\"");
            if (lineFeed) {
                str = str.replace(/&line;/g, "\n");
            }
            return str;
        },
        getMMM: function (month) {
            var monthNames = [
                "Jan", "Feb", "Mar",
                "Apr", "May", "Jun",
                "Jul", "Aug", "Sep",
                "Oct", "Nov", "Dec"
            ];
            return monthNames[month];
        },
        getBookingStatus: function (flag) { 
            var status = 'Draft';
            if (flag == 'A') {
                status = 'All'
            }
            else if (flag == 'D') {
                status = 'Draft'
            }
            else if (flag == 'P') {
                status = 'Pending'
            }
            else if (flag == 'C') {
                status = 'Sent'
            }
            else if (flag == 'S') {
                status = 'Scheduled'
            }
            else if (flag == 'R') {
                status = 'Running'
            }
            return status;
        },
         
        setAppData: function (appVar, data) {
            var _data = this.get("app_data");
            _data[appVar] = data;
        },
        getAppData: function (appVar) {
            return this.get("app_data")[appVar];
        },
        removeAllCache: function () {
            var cache = this.get("app_data");
            $.each(cache, function (k, v) {
                cache[k] = null;
                delete cache[k];
            })
            this.clearCache();
            console.log("Cache is cleared now time=" + (new Date()));
        },
        removeCache: function (key) {
            var cache = this.get("app_data");
            cache[key] = null;
            delete cache[key];
        },
        removeSpinner: function (elObj) {
            if (elObj.parents('.ws-content').length) {
                var activeSpaceID = elObj.parents('.ws-content').attr('id');
                activeSpaceID = activeSpaceID.split('_')[1];
                $('#wp_li_' + activeSpaceID).find('.spinner').remove();
            }
        },
        addSpinner: function (elObj) {
            if (elObj.parents('.ws-content').length) {
                var activeSpaceID = elObj.parents('.ws-content.active').attr('id');
                var lastActiveWorkSpace = activeSpaceID.split('_')[1];
                $('#wp_li_' + lastActiveWorkSpace).append('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
            }
        }, 
        getData: function (data) {
            var app = this;
            $.ajax({
                dataType: "json",
                url: data.URL,
                async: data.isAsyncFalse ? false : true,
                success: function (tsv, state, xhr) {
                    if (xhr && xhr.responseText) {
                        var salesforce = jQuery.parseJSON(xhr.responseText);
                        if (app.checkError(salesforce)) {
                            if (data.errorCallback)
                                data.errorCallback();
                            return false;
                        }
                        app.setAppData(data.key, salesforce);
                        if (data.callback)
                            data.callback();
                    }
                }
            });
        }, 
        showStaticDialog: function (options) {
            options['app'] = this;
            var dialog = new bmsStaticDialog(options);
            $(".modal,.modal-backdrop").css("visibility","hidden");
            $("body").append(dialog.$el);
            dialog.show();
            return dialog;           
        },
        showAddDialog: function (options) {                        
            var dialog = new addDialog(options);            
            $("body").append(dialog.$el);            
            dialog.init();
            return dialog;           
        }, 
        validateEmail: function (emailVal)
        {
            var email_patt = new RegExp("[A-Za-z0-9A-Z!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?");
            //var email_patt = new RegExp("[A-Za-z0-9'_`-]+(?:\\.[A-Za-z0-9'_`-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])");
            return email_patt.test(emailVal);
        },
        showError: function (params) {
            if (params.control) {
                params.control.find(".inputcont").addClass("error");
                params.control.find(".inputcont").append('<span class="errortext"><i class="erroricon"></i><em>' + params.message + '</em></span>');
            }
        },
        hideError: function (params) {
            if (params.control) {
                params.control.find(".inputcont").removeClass("error");
                params.control.find(".inputcont span.errortext").remove();
            }
        },
        addCommas: function (nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },  
        stringTruncate: function (title, length) {
            // var title = 'web administrator';

            if (title && title.length > length) {
                return $.trim(title).substring(0, length)
                        .split(" ").slice(0, -1).join(" ") + "..";
            } else {
                return title;
            }

        }, 
        scrollingTop: function (scrollObj) {
            var scrolltoDiv = scrollObj.scrollDiv;
            var appendtoDiv = scrollObj.appendto;
            var scrollBar = scrollObj.scrollElement ? scrollObj.scrollElement : $(window);
            if (typeof (scrolltoDiv) === "string" && scrolltoDiv === 'window') {
                var top_button = $('<button class="ScrollToTop scroll-summary" type="button" style="display: none"></button>');
                $(appendtoDiv).append(top_button);
                top_button.click(_.bind(function () {
                    if (scrollObj.scrollElement && scrollBar[0] !== window) {
                        scrollBar.animate({scrollTop: 0}, 600);
                    }
                    else {
                        $("html,body").css('height', '100%').animate({scrollTop: 0}, 600).css("height", "");
                    }
                }, this));
                scrollBar.scroll(_.bind(function () {
                    if (scrollBar.scrollTop() > 50) {
                        top_button.fadeIn('fast');
                    } else {
                        top_button.fadeOut('fast');
                    }
                }, this));
                //console.log(scrolltoDiv + '   ' + appendtoDiv);
            }
        },
        removeDialogs: function () {
            if (this.dialogView) {
                this.dialogView.hide();
            }
        },
        isEmpty: function (val) {
            return (val === undefined || val == null || val.length <= 0) ? true : false;
        },
        isNumeric: function (s) {
            if (!/^\d+$/.test(s)) {
                return false;
            } else {
                return true;
            }
        }, 
        validkeysearch: function (event) {
            var regex = new RegExp("^[A-Z,a-z,0-9]+$");
            var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (event.keyCode == 8 || event.keyCode == 32 || event.keyCode == 37 || event.keyCode == 39) {
                return true;
            }
            else if (regex.test(str)) {
                return true;
            }
            else {
                return false;
            }
            event.preventDefault();
        },
        getIEVersion: function(){
            var msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
            if (isNaN(msie)) {
              msie = parseInt((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
            }
            return msie;
        }, 
        successMessage:function(text){
        	var info = '<div class="alert alert-success top-message">';
        	info +='<strong>'+this.language['successalert']+':</strong>  '+ this.language['successtext']+'.';
        	info +='</div>';
        	$(".page-content").prepend(info);
        	setTimeout(function(){ $(".page-content .top-message").remove()}, 3000);
        },
        errorMessage:function(text){
        	var info = '<div class="alert alert-error top-message">';
        	info +='<strong>'+this.language['erroralert']+':</strong>  '+ this.language['errortext']+'.';
        	info +='</div>';
        	$(".page-content").prepend(info);
        	setTimeout(function(){ $(".page-content .top-message").remove()}, 3000);
        }
    });

    return new app();

});
