define(['backbone', 'underscore',  'text!dashboard/tpl/lists.html'],
	function (Backbone, _,   template) {
		'use strict';
		return Backbone.View.extend({  
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
