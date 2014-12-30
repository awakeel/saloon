define(['jquery', 'backbone', 'underscore',  'text!templates/leftmenu.html','views/breadcrumb'],
	function ($, Backbone, _,   template,BreadCrumb) {
		'use strict';
		return Backbone.View.extend({
			id: 'footer',
                        tagName: 'footer',
                        className:"clearfix",
                        events: {
                           'click .navbar-side li':'openWorkspace'
                        },

			initialize: function () {
				this.template = _.template(template);				
				this.render();
				 			
			},
			openWorkspace:function(ev){
				var that = this;
				var title = $(ev.target).text();
			    var folder = this.checkUndefined($(ev.target).data('folder'));
			    if(!folder){ $(ev.target).parent('li').data('folder')}
			    require([folder+'/views/lists'],function(Lists){
			    	var objLists = new Lists();
			    	var objBreadCrumb = new BreadCrumb({title:title});
			    	$('#page-wrapper').find('.page-content').html(objBreadCrumb.$el);
			    	$('#page-wrapper').find('.page-content').append(objLists.$el);
			    })
			},
			render: function () {
				this.$el.html(this.template({}));
				
			},
			checkUndefined:function(id){
				if(typeof id!="undefined") return id;
				else return false;
			}
		});
	});
