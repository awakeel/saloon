(function () {
   'use strict';
    require.config({  
       deps: ['main'], 
       waitSeconds:400,
       urlArgs: "v="+new Date().getTime() ,
       paths:{
           jquery:'libs/jquery',
           underscore:'libs/underscore',
           backbone:'libs/backbone-min',
           text:'libs/text',
           'moment': 'libs/moment',
           'bootstrap': 'libs/bootstrap.min',
           },
        shim: {
                backbone: {
                   deps: ['jquery', 'underscore'],
                   exports: 'Backbone'
                },
                underscore: {
                   exports: '_'
                },
                jquery: {
                   exports: 'jQuery'
               },
               bootstrap: ['jquery']
                       }
    });
 
  define(['backbone','views/main_container'],function(Backbone,Container){
	  var Router = Backbone.Router.extend({
		  routes:{
			  '':'dashboard'
		  },
		  initialize:function(){
			  this.dashboard();
		  },
		  dashboard:function(){
			  var objContainer = new Container( );
			  $('#wrapper').append(objContainer.objHeader.$el);
			  $('#wrapper').append(objContainer.objLeftMenu.$el);
			  $('#wrapper').append(objContainer.$el);
			  $('#page-wrapper').find('.page-content').html(objContainer.objBreadCrumb.$el);
			  $('#page-wrapper').find('.page-content').append(objContainer.objDashboard.$el);
              $('#wrapper').append(objContainer.objFooter.$el);
           //   this.mainContainer.dashBoardScripts()
		  }
		  
	  });
	  var mainRouter = new Router();
	  Backbone.history.start({pushState: true}); //Start routing
  })
   
 
})();