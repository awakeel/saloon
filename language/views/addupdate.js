define(['text!language/tpl/addupdate.html'],
	function (template) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close-p':"closeView"
			 },
			  initialize: function () {
				this.template = _.template(template);
				 
				this.render();
			},
			render: function () {
				this.$el.html(this.template());
			},
			closeView:function(){
				console.log(this);
				 this.undelegateEvents();
				 this.$el.remove();
				 this.$el.removeData().unbind(); 
				 this.remove();  
				 Backbone.View.prototype.remove.call(this);
			}
		 
		});
	});
