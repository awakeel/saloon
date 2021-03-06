define(['jquery', 'backbone', 'underscore',  'text!templates/footer.html'],
	function ($, Backbone, _,   template) {
		'use strict';
		return Backbone.View.extend({
			id: 'footer',
                        tagName: 'footer',
                        className:"clearfix",
                        events: {
                            "click #change_font_global":function(){
                                $("*").css("font-family",$("#font-family-name").val());
                            }
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
