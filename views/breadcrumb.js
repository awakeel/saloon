define([ 'backbone', 'underscore',  'text!templates/breadcrumb.html'],
	function (Backbone, _,   template) {
		'use strict';
		return Backbone.View.extend({
		    
			initialize: function () {
				 this.language = this.options.setting.language
				this.template = _.template(template); 
				this.render();
				 			
			},
			render: function () {
				this.$el.html(this.template({}));
				this.$el.find(".btn-add-new").on('click',function(){
					console.log('I am clicked');
					$('#popup').show();
				})
			},
			getCurrentDate:function(){
				var date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
				return date;
			},
			addNewButton:function(){
				return '<button class="btn btn-success btn-lg pull-right btn-add-new">'+this.options.setting.language["add"]+'</button>';
				
			}
		});
	});
