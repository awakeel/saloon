define(['text!login/tpl/login.html','authorize/models/login'],
	function (template,Login) {
		'use strict';
		return Backbone.View.extend({  
			events:{
				"click #btnLogin":"login"
			},
			initialize: function () {
				this.template = _.template(template);
				var objLogin = new Login();
				this.render();
			},
			render: function () {
				this.$el.html(this.template()); 
			},
			login:function(){
				console.log(this.$el.find("#phone").val());
			}
		});
	});
