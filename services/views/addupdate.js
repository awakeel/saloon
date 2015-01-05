define(['text!services/tpl/addupdate.html','services/models/service','services/views/list'],
	function (template,ServiceModel,Service) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close-p':"closeView", 
				 "click .save-p":"save"
			 },
			  initialize: function () {
				this.template = _.template(template);
				 
				this.render();
			},
			render: function () {  
				this.$el.html(this.template( ));
			},
			closeView:function(){
				 this.undelegateEvents();
				 this.$el.remove();
				 this.$el.removeData().unbind(); 
				 this.remove();  
				 Backbone.View.prototype.remove.call(this);
			},
			save:function(){ 
				var name = this.$el.find('#txtname').val();
				var type = this.$el.find('input[name=optionstype]:checked').val() 
				var comments = this.$el.find('#txtcomments').val()
				 	var objService = new ServiceModel();
		            	objService.set('branchid',1);
		            	objService.set('name',name);
		            	objService.set('type',type);
		            	objService.set('comments',comments);
		            	var model = objService.save(); 
		            	this.options.page.objServices.add(objService);  
		                var last_model = this.options.page.objServices.last();
		                //this.closePopup();
		                var objService = new Service({model:objService,page:this,setting:this.options.page.setting});
		                this.options.page.$el.find('tbody').prepend(objService.$el);
						this.options.page.setting.services[this.options.page.setting.services.length-1] = name;
						this.closeView();
						this.options.page.setting.successMessage();
		            
			}
		 
		});
	});
