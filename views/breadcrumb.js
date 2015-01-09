define([ 'backbone', 'underscore',  'text!templates/breadcrumb.html'],
	function (Backbone, _,   template) {
		'use strict';
		return Backbone.View.extend({
		    
			initialize: function () {
				 this.language = this.options.setting.language;
				this.template = _.template(template); 
				 this.title = this.options.title;
				this.render();
				 	console.log(this.title)		
			},
			render: function () {
				var that = this;
				this.$el.html(this.template({})); 
			},
			getCurrentDate:function(){
				var date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
				return date;
			},
			addNewButton:function(){
			//	if(this.options.show !="n")
				//return '<button class="btn btn-success btn-lg pull-right btn-add-new">'+this.options.setting.language["add"]+'</button>';
				
			},
			getTitle:function(){
				return this.language[this.title];
			}
		});
	});
