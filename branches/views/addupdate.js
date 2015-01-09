define(['text!branches/tpl/addupdate.html','wizard','branches/models/branch','timepick'],
	function (template,wizard,ModelBranch,timepick) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close-p':"closeView", 
				 "click .save-p":"save"
			 },
			 id:"rootwizard",
			  initialize: function () {
				this.template = _.template(template);
				this.setting = this.options.setting;
				this.objModelBranch = new ModelBranch();
				this.render();
			},
			render: function () {  
				this.$el.html(this.template( ));
				this.startWizard();
				this.fillLanguages();
				this.fillJobTypes();
				this.fillCountries();
				this.fillCurrencies();
				//this.fillTimings();
				this.fillServices();
				this.fillEmployees();
				this.addSchedule();
				
				var that = this;
				this.$el.find('#chkall').on('click',function(){ 
					that.$el.find('.days').prop("checked", !that.$el.find('.days').prop("checked"));
					var first = that.$el.find("#txtsm").val();
					var end = that.$el.find("#txtem").val();
					if(!first)
						first = "9:00AM";
					if(!end)
						end = "5:00PM";
					that.$el.find(".timepicker").val(first)
					that.$el.find(".timepicker").val(end)
				})
				console.log(this.$el.find("#timepicker1"));
				this.$el.find(".timepicker").timepicker({});
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
						that.$el.find('.pagerw .next').hide();
						that.$el.find('.pagerw .finish').show().on('click',function(){
							console.log('some one clicked me');
						});
						that.$el.find('.pagerw .finish').removeClass('disabled');
					} else {
						that.$el.find('.pagerw .next').show();
						that.$el.find('.pagerw .finish').hide();
					}
					 
					
					
				} ,onNext:function(tab, nav, index){
					var id = tab.data('id');
					switch(id){
					case 1:
						that.saveBasicInfo();
						//that.saveBasicSetting();
						break;
					 
					case 2:
						that.saveJobTypes();
						break;
				 
					case 3:
						that.saveServices();
						break;
					case 4:
						that.saveEmployees();
						break;
					}
				} });
			
			},
			saveBasicInfo:function(){
				var name = this.$el.find('#txtname').val();
				var desc = this.$el.find('#txtdescription').val();
				this.objModelBranch.set({name:name,notes:desc});
				var countryid = this.$el.find('#ddlcountries').val();
				var currencyid = this.$el.find('#ddlcurrencies').val();
				var languageid = this.$el.find("#ddllanguage").val();
				this.objModelBranch.set({id:this.objModelBranch.get('id'),countryid:countryid,currencyid:currencyid,languageid:languageid});
				this.objModelBranch.save();
			},
			saveBasicSetting:function(){
				var countryid = this.$el.find('#ddlcountries').val();
				var currencyid = this.$el.find('#ddlcurrencies').val();
				var languageid = this.$el.find("#ddllanguage").val();
				this.objModelBranch.set({id:this.objModelBranch.get('id'),countryid:countryid,currencyid:currencyid,languageid:languageid});
				this.objModelBranch.save();
				this.saveTiming();
			},
			saveTiming:function(){
				 var days = [];
				 var data = "";
				 var that = this;
			     $('.timings-div :checked').each(function() {
			    	 days.push($(this).val());
			     });
			     _.each(days,function(index){
			    	 console.log(that.$el.find("#txte"+index).val())
			    	 if(index)
			    		 data += index+"="+that.$el.find("#txts"+index).val()+"##"+that.$el.find("#txte"+index).val()+'||';
			     })
			     
			     
                 var result = false;
                 var that = this;
                 this.objModelBranch.set({id:this.objModelBranch.get('id'),timing:data});
 				 this.objModelBranch.save();
			    
			},
			saveJobTypes:function(){
				
			},
			saveServices:function(){
				
			},
			saveEmployees:function(){
				
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
                  	  	options +="<option value="+key.id+"  >"+key.code+" -- "+key.name+"</option>";
                  	  	
                   })
                   that.$el.find("#ddlcurrencies").html(options);
                   
               });
			},
			fillJobTypes:function(){
				var that = this;
				require(['jobtypes/views/lists'],function(JobTypes){
					var objJobTypes = new JobTypes({setting:that.setting});
					that.$el.find(".table-jobtypes").html(objJobTypes.$el);
				})
			},
			fillServices:function(){
				var that = this;
				require(['services/views/lists'],function(Services){
					var objServices = new Services({setting:that.setting});
					that.$el.find(".table-services").html(objServices.$el);
				})
			},
			addSchedule:function(){
				var that = this;
				require(['schedule/views/lists'],function(Services){
					var objServices = new Services({setting:that.setting});
					that.$el.find(".table-schedule").html(objServices.$el);
				})
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
			},
			fillEmployees:function(){
				var that = this;
				require(['employees/views/lists'],function(Employees){
					var objEmployees = new Employees({setting:that.setting});
					that.$el.find(".table-employees").html(objEmployees.$el);
				})
			}
		 
		});
	});
