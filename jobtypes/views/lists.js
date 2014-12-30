define(['backbone', 'underscore',  'text!departments/tpl/lists.html'],
	function (Backbone, _,   template) {
		'use strict';
		return Backbone.View.extend({  
                        events: {
                             
                         },

			initialize: function () {
				this.template = _.template(template);				
				this.render();
				 			
			},

			render: function () {
				this.$el.html(this.template({}));
				
			}
		});
	});
