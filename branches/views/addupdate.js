define(['text!branches/tpl/addupdate.html','wizard','branches/models/branch','timepick'],
	function (template,wizard,ModelBranch,timepick) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close-p':"closeView", 
				 "click .save-p":"save",
				 "click .btn-save":"saveSteps"
			 },
			 id:"rootwizard",
			  initialize: function () {
				this.id = 0;
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
					that.$el.find(".first-text").val(first)
					that.$el.find(".end-text").val(end)
				})
				console.log(this.$el.find("#timepicker1"));
				this.$el.find(".timepicker").timepicker({ 'timeFormat': 'H:i' });
				this.$el.find('.days').on('click',function(){
					if($(this).prop('checked')!= true){
						var first = that.$el.find("#txts"+$(this).attr('id')).val('');
						var end = that.$el.find("#txte"+$(this).attr('id')).val('');
					}
				})
			} ,
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
						return that.saveBasicInfo(id);
						//that.saveBasicSetting();
						break;
					 
					case 2:
						//that.saveJobTypes(2);
						break;
				 
					case 3:
						//that.saveServices(3);
						break;
					case 4:
						//that.saveEmployees(4);
						break;
					}
				} });
			
			},
			saveBasicInfo:function(id){
				this.clearFormInput();
				var name = this.$el.find('#txtname').val();
				if(!name){
					this.$el.find('.name-error').removeClass('hide');
					return false;
				}
				var desc = this.$el.find('#txtdescription').val();
				if(!desc){
					this.$el.find('.desc-error').removeClass('hide');
					return false;
				}
				
				
				this.objModelBranch.set({name:name,notes:desc});
				var countryid = this.$el.find('#ddlcountries').val();
				var currencyid = this.$el.find('#ddlcurrencies').val();
				var languageid = this.$el.find("#ddllanguage").val();
				if(!name){
					
				}
				this.objModelBranch.set({id:this.objModelBranch.get('id'),countryid:countryid,currencyid:currencyid,languageid:languageid});
				return this.saveTiming(id);
				
			},
			clearFormInput:function(){
				this.$el.find('.name-error').addClass('hide');	 
				this.$el.find('.desc-error').addClass('hide');
				this.$el.find('.help-block').addClass('hide');
			},
			saveTiming:function(id){
				
				 var days = [];
				 this.days = days;
				 var data = "";
				 var that = this;
			     $('.timings-div :checked').each(function() {
			    	 days.push($(this).val());
			     });
			     var returnValue = true;
			     if(days.length < 1){
			    	 that.$el.find('.timing-error').removeClass('hide');
						return false;
			     }
			     _.each(days,function(index){
			    	 console.log(index);
			    	 if(index){
					    	 console.log(that.$el.find("#txte"+index).val()) 
					    	 var start = that.$el.find("#txts"+index).val();
					    	 var end = that.$el.find("#txte"+index).val()
					    	
					    	 var diff = that.calculate(start,end);
					    	 console.log(index + 'start '+ start + ' end '+ end + 'difference')
					    	 if(diff < 1 ){
					    		var span = '<span class="help-block"><i class="fa fa-warning"></i> Correct time for '+ index +'</span>';
					    		 that.$el.find("#txts"+index).after(span);
					    		 that.$el.find("#txte"+index).after(span);
					    		 returnValue = false;
					    	 }
					    	
					    		 data += index+"="+start+"##"+end+'||';
			    	 } 
			     })
			     
			     if(returnValue == false) return false;
	                 var that = this;
	                 var spin = this.setting.showLoading('Saving info please wait',this.$el,{top:'30%'});
                  this.objModelBranch.set({timing:data});
 				 
 				  $.when(this.objModelBranch.save()).done(function(){
 					this.showMessage('Basic Info, setting and timing successfuly saved.',id);
 					
 				  }).fail(function(){
 					  this.showMessage('Problem saving info',id);
 					   
 				   });
 			 
 				 spin.stop ();
 				  
			},
			calculate:function(time1,time2) {
				 if(time1 == 0 || time2 == 0) return 0;
		         var hours = parseInt(time1.split(':')[0], 10) - parseInt(time2.split(':')[0], 10);
		         if(hours < 0) hours = 24 + hours;
		         
		         return hours;
		     },
			showMessage:function(text,id){
				 
				var time = ""; 
				this.id = id;
				if( this.days.length == 0 && this.id == 1)
				///	time = "although time is not selected, you can add it later.  ";
				if(id == 1)
					this.$el.find('.btn-save').html('Go to next step').removeClass('btn-save').addClass('next-step-ahead').attr('data-id',this.id);
				
				
				var str = '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+text+ time;
                
				if (id !=5)
                	   str +='<strong><a class="next-step-ahead" style="cursor:pointer" data-id='+this.id+'>Go to Next Step</a></strong>.';
                  
                   str +='</div>';
                this.$el.find('.show-message').html(str);
                this.$el.find('.next-step-ahead').attr('data-id',this.id);
                var that = this;
				this.$el.find('.next-step-ahead').on('click',function(){
					console.log(that.id)
					 switch(that.id){
					case 1:
						  that.showMessage('Add Few job types to department for example, Manager, Hair dresser, cleaner etc, or ',2)
						  ///that.$el.find('.pager .next-1').click();
						break;
					case 2:
						  
						  that.showMessage('Add some services to department for example, Hair dressing, massage etc, or  ',3)
						  ///that.$el.find('.pager .next-1').click();
							break;
					case 3:
						  that.$el.find('.pager .next-1').click();
						  that.showMessage('Add employees to department for example XYZ who is working with you, or ',4)
							break;
					case 4:
						  that.$el.find('.next-step-ahead').html('All done');
						 
						  that.showMessage('Schedule your employee timing and assign task, <a>You have successfuly created new department</a>',5)
							break;
						
					}
				});
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
