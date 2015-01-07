(function() {
	'use strict';
	require.config({
		deps : [ 'main' ],
		waitSeconds : 400,
		urlArgs : "v=" + new Date().getTime(),
		paths : {
			jquery : 'libs/jquery',
			underscore : 'libs/underscore',
			backbone : 'libs/backbone-min',
			text : 'libs/text',
			'moment' : 'libs/moment',
			'bootstrap' : 'libs/bootstrap.min',
			'flex' : 'js/flex',
			'wizard' : 'libs/wizard',
			'fullcalendar' : 'libs/fullcalendar.min',
			'datepicker':"libs/bootstrap-datepicker",
			'timepick':'libs/timepick',
			'daterangepicker':"libs/daterangepicker",
			'typeahead':'libs/typeahead.min',
			'tokenfield':"libs/bootstrap-tokenfield.min", 
		},
		shim : {
			jquery : {
				exports : 'jQuery'
			},
			backbone : {
				deps : [ 'jquery', 'underscore' ],
				exports : 'Backbone'
			},
			underscore : {
				exports : '_'
			},
			flex : {
				deps : [ 'jquery' ],
				exports : 'flex'
			},
			wizard : {
				deps : [ 'jquery' ],
				exports : 'wizard'
			},
			fullcalendar : {
				deps : [ 'jquery' ],
				exports : 'fullcalendar'
			},

			bootstrap : [ 'jquery' ]
		}
	});

	define([ 'jquery', 'bootstrap', 'backbone', 'app', 'flex',
			'views/main_container' ], function(jquery, bootstrap, Backbone,
			app, flex, Container) {
		var Router = Backbone.Router.extend({
			routes : {
				'' : 'dashboard'
			},
			initialize : function() {
				this.dashboard();
			},
			dashboard : function() {
				var settings = app.load(this.loadPages);
			},
			loadPages : function() {
				var objContainer = new Container({
					setting : app
				});
				$('#wrapper').append(objContainer.objHeader.$el);
				$('#wrapper').append(objContainer.objLeftMenu.$el);
				$('#wrapper').append(objContainer.$el);
				$('#page-wrapper').find('.page-content').html(
						objContainer.objBreadCrumb.$el);
				$('#page-wrapper').find('.page-content').append(
						objContainer.objDashboard.$el);
				$('#wrapper').append(objContainer.objFooter.$el);
			}

		});
		var mainRouter = new Router();
		Backbone.history.start({
			pushState : true
		}); //Start routing
	})

})();