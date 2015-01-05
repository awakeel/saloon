define([ 'text!dashboard/tpl/quickstats.html'],
	function (  template) {
		'use strict';
		return Backbone.View.extend({  
			className:"row",
                        events: {
                             
                         },

			initialize: function () {
				this.template = _.template(template);		
				this.setting = this.options.setting;
				this.render();
				 			
			},

			render: function () {
				this.$el.html(this.template({}));
				 
				
			} 
			
		});
	});
