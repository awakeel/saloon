define(['text!branches/tpl/addupdate.html','wizard'],
	function (template,wizard) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close-p':"closeView", 
				 "click .save-p":"save"
			 },
			 id:"rootwizard",
			  initialize: function () {
				this.template = _.template(template);
				this.render();
			},
			render: function () {  
				this.$el.html(this.template( ));
				this.startWizard();
				this.fillLanguages();
				this.fillJobTypes();
				this.fillCountries();
				this.fillCurrencies();
				this.fillTimings();
			},
			closeView:function(){
				
				 this.undelegateEvents();
				 this.$el.remove();
				 this.$el.removeData().unbind(); 
				 this.remove();  
				 Backbone.View.prototype.remove.call(this);
			},
			startWizard:function(){
				var that = this;
				 
				
				this.$el.bootstrapWizard({onTabShow: function(tab, navigation, index) {
					var $total = navigation.find('li').length;
					var $current = index+1;
					var $percent = ($current/$total) * 100;
					that.$el.find('.bar').css({width:$percent+'%'});
					
					// If it's the last tab then hide the last button and show the finish instead
					if($current >= $total) {
						that.$el.find('.pager .next').hide();
						that.$el.find('.pager .finish').show();
						that.$el.find('.pager .finish').removeClass('disabled');
					} else {
						that.$el.find('.pager .next').show();
						that.$el.find('.pager .finish').hide();
					}
					
				}});
				that.$el.find('finish').click(function() {
					alert('Finished!, Starting over!');
					that.$el.find("a[href*='tab1']").trigger('click');
				});
			},
			fillCountries:function(){
				var url = "api/countries";
				 var that = this;
				 var options = "<select value=0>Select language</option>";
                jQuery.getJSON(url, function(tsv, state, xhr) {
                    var jobtypes = jQuery.parseJSON(xhr.responseText);
                    _.each(jobtypes,function(key){
                   	  	options +="<option value="+key.id+"  >"+key.name+"</option>";
                   	  	
                    })
                    that.$el.find("#ddlcountries").html(options);
                    
                });
			},
			fillTimings:function(){
				var url = "api/timings";
				 var that = this;
				 var options = "<select value=0>Select language</option>";
                jQuery.getJSON(url, function(tsv, state, xhr) {
                    var jobtypes = jQuery.parseJSON(xhr.responseText);
                    _.each(jobtypes,function(key){
                   	  	options +="<option value="+key.id+"  >Opened "+key.opened+ " - Closed "+key.opened+"</option>";
                   	  	
                    })
                    that.$el.find("#ddltimings").html(options);
                    
                });
			},
			fillCurrencies:function(){
				var url = "api/currencies";
				 var that = this;
				 var options = "<select value=0>Select language</option>";
               jQuery.getJSON(url, function(tsv, state, xhr) {
                   var jobtypes = jQuery.parseJSON(xhr.responseText);
                   _.each(jobtypes,function(key){
                  	  	options +="<option value="+key.id+"  >"+key.name+"</option>";
                  	  	
                   })
                   that.$el.find("#ddlcurrencies").html(options);
                   
               });
			},
			fillJobTypes:function(){
				 var url = "api/jobtypes";
				 var that = this;
				 var options = "<select value=0>Select language</option>";
                 jQuery.getJSON(url, function(tsv, state, xhr) {
                     var jobtypes = jQuery.parseJSON(xhr.responseText);
                     _.each(jobtypes,function(key){
                    	  	options +="<option value="+key.id+"  >"+key.name+"</option>";
                    	  	
                     })
                     that.$el.find("#ddljobtypes").html(options);
                     
                 });
			},
			fillServices:function(){
				
			},
			fillLanguages:function(){
				 var url = "api/languages";
				 var that = this;
				 var options = "<select value=0>Select language</option>";
                 jQuery.getJSON(url, function(tsv, state, xhr) {
                     var languages = jQuery.parseJSON(xhr.responseText);
                     _.each(languages,function(key){
                    	  	options +="<option value="+key.id+"  >"+key.title+"</option>";
                    	  	
                     })
                     that.$el.find("#ddllanguage").html(options);
                     
                 });
			}
		 
		});
	});
