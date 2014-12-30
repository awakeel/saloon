define(['jquery', 'backbone','views/breadcrumb',  'views/header','dashboard/views/lists', 'text!templates/main_container.html','views/footer','views/leftmenu',   'views/workspace','moment'],
        function ($, Backbone, BreadCrumb,  HeaderView,Dashboard,template, FooterView,LeftMenu,  WorkSpace,Moment) {
            "use strict";

            return Backbone.View.extend({
                id: 'page-wrapper',
                tagName: 'div',
                
                initialize: function () {
                    this.objHeader = new HeaderView();
                    this.objFooter = new FooterView();
                    this.objLeftMenu = new LeftMenu();
                    this.objDashboard = new Dashboard();
                    this.objBreadCrumb = new BreadCrumb();
                    this.render();
                }
                ,
                render: function () {
                    // Render header, main container, footer and news panel          
                    //this.$el.append(this.header.$el,LandingPage, this.footer.$el,this.news.$el);          
                  this.template = _.template(template);
                    this.$el.append( this.template({}));
                    

                },
                addWorkSpace: function (options) {
                       
                },
                landingPageslist: function () {
                    this.addWorkSpace({type: '', title: 'Landing Pages', sub_title: 'Listing', url: 'landingpages/landingpages', workspace_id: 'landingpages', 'addAction': true, tab_icon: 'lpageslisting'});
                },
            });

        });



