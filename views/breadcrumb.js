define([ 'backbone', 'underscore',  'text!templates/breadcrumb.html'],
	function (Backbone, _,   template) {
		'use strict';
		return Backbone.View.extend({
		 
			initialize: function () {
				this.template = _.template(template);	
				this.title = this.options.title;
				this.render();
				 			
			},

			render: function () {
				this.$el.html(this.template({}));
				
			},
			getCurrentDate:function(){
				var date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
				return date;
			}
		});
	});
