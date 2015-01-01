define(['text!language/tpl/lists.html','language/collections/language','language/views/list'],
	function (template,Languages,Language) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"col-lg-13",
            initialize: function () {
				this.template = _.template(template);
				this.request = null;
				this.fetched = 0;
				this.offsetLength = 10;
				this.objLanguage = new Language();
				this.render();
			},
			render: function () { 
				this.$el.html(this.template({}));
				$(window).scroll(_.bind(this.lazyLoading, this));
                $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchLanguages(0);
			},
			fetchLanguages:function(offset){
				var that = this;
				var _data = {};
				 _data['offset'] = offset;
				this.request = this.objLanguage.fetch({data: _data, success: function(data) {
					_.each(data.models,function(model){
						var objLanguage = new Languages({model:model});
						that.$el.find('tbody').append(objLanguages.$el);
					})
					that.offsetLength = data.length;
					that.fetched = that.fetched + data.length;
					if (that.fetched < parseInt(11)) {
                        that.$el.find("tbody tr:last").attr("data-load", "true");
                        that.$el.find("tbody").append("<tr id='tr_loading'><td colspan='6'><div class='gridLoading fa fa-spinner spinner' style='text-align:center; margin-left:auto;'></div></td>");
                         
                    } 
				}}) 
			},
			lazyLoading: function() {
                var $w = $(window);
                var th = 200;
                var filters = this.$el.find('tbody tr:last').prev();
                var inview = filters.filter(function() {
                    var $e = $(this),
                            wt = $w.scrollTop(),
                            wb = wt + $w.height(),
                            et = $e.offset().top,
                            eb = et + $e.height();
                    return eb >= wt - th && et <= wb + th;
                });
                if (inview.length && inview.attr("data-load") && this.$el.height() > 0) {
                    inview.removeAttr("data-load"); 
                    this.$el.find("#tr_loading").remove();
                    this.fetchLanguages(this.offsetLength);
                }
            },
		});
	});
