define(['text!employees/tpl/list.html'],
	function (template) {
		'use strict';
		return Backbone.View.extend({  
			tagName:'tr',
            initialize: function () {
				this.template = _.template(template);
				this.render();
			},
			render: function () {
				this.$el.html(this.template(this.model.toJSON()));
				
			}
		});
	});
