define(['text!branches/tpl/lists.html','branches/collections/branches','branches/views/list','branches/models/branch'],
	function (template,Branches,Branch,LanguageModel) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"col-lg-13",
			events:{
			 	"click .close-p":"closePopup",
				//"click .save-p":"saveToken",
				"click .delete-p":"deleteToken",
				"click .btn-add-new":"addNew"
			},
            initialize: function () {
				this.template = _.template(template);
				this.request = null;
				this.fetched = 0;
				 this.searchText = '';
				this.setting = this.options.setting;
				this.offsetLength = 10;
				this.objBranches = new Branches();
				this.render();
				
			},
			addNew:function(){
				var that = this;
			  	 require(['branches/views/addupdate'],function(addupdate){
      		 	 	that.$el.html(new addupdate({id:0,model:{title:'',languagetitle:''},page:that}).$el);
				 })
			 
		     },
			render: function () { 
				this.$el.html(this.template({}));
				$(window).scroll(_.bind(this.lazyLoading, this));
                $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchBranches();
                var that = this;
                var id = null;
               
                
			},
			 
			fetchBranches:function(){
				var that = this;
				var _data = {}; 
				  this.objBranches.reset();
				 that.$el.find('tbody').empty();
				 if(this.request)
	                    this.request.abort();
				 this.request = this.objBranches.fetch({data: _data, success: function(data) {
					_.each(data.models,function(model){
						var objBranch = new Branch({model:model,page:that,setting:that.setting});
						that.$el.find('tbody').append(objBranch.$el);
					})
					that.offsetLength = data.length;
					that.fetched = that.fetched + data.length;
					
					//if (that.fetched < parseInt(11)) {
                       // that.$el.find("tbody tr:last").attr("data-load", "true");
                       // that.$el.find("tbody").append("<tr id='tr_loading'><td colspan='6'><div class='gridLoading fa fa-spinner spinner' style='text-align:center; margin-left:auto;'></div></td>");
                         
                    //} 
					 var id = null;
					 
				}});
				 console.log('I am clicked at list');
				
			},
			fillLanguages:function(){
				 var url = "api/languages";
				 var that = this;
				 var options = "<select value=0>Select language</option>";
                 jQuery.getJSON(url, function(tsv, state, xhr) {
                     var languages = jQuery.parseJSON(xhr.responseText);
                     _.each(languages,function(key){
                    	 var selected = "";
                   	     if(that.setting.selectedLanguage == key.langaugeid)1
                   	     	selected = "selected";
                   	     
                    	  	options +="<option value="+key.id+" "+selected+">"+key.title+"</option>";
                    	  	
                     })
                     that.$el.find(".ddllanguage").html(options);
                     that.$el.find(".ddllanguage").on('change',function(ev){
                    	 that.languageFilter = $(this).val();
                    	 that.fetchLanguages();
                     })
                 });
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
            searchLanguages:function(ev){ 
                     this.searchText = ''; 
                     this.timer = 0;
                     var that = this;
                     var text = $(ev.target).val(); 
                     var code = ev.keyCode ? ev.keyCode : ev.which;
                     var nonKey =[17, 40 , 38 , 37 , 39 , 16,8,46];
                     if ((ev.ctrlKey==true)&& (code == '65' || code == '97')) {
                           return;
                     }
                     if($.inArray(code, nonKey)!==-1) return;
                          if(code == 8 || code == 46){
                                 if(text){ 
		                        	 that.searchText = text;
			                          that.fetchLanguages();
		                         }
                           }else{
		                   
		                        this.searchText = text;
		                          clearTimeout(that.timer); // Clear the timer so we don't end up with dupes.
		                            that.timer = setTimeout(function() { // assign timer a new timeout 
		                                if (text.length < 2) return;
		                                that.searchText = text;
		                                that.fetchLanguages(that.langaugeFilter);
		                           }, 500); // 2000ms delay, tweak for faster/slower
                          }
            },
            saveToken:function(title,translate,view){
            	 
            	var objLanguage = new LanguageModel();
            	objLanguage.set('languageid',this.languageFilter);
            	objLanguage.set('title',title);
            	objLanguage.set('languagetitle',translate);
            	var model = objLanguage.save(); 
            	this.objLanguages.add(objLanguage);  
                var last_model = this.objLanguages.last();
                //this.closePopup();
                var objLanguage = new Language({model:objLanguage,page:this,setting:this.setting});
				this.$el.find('tbody').prepend(objLanguage.$el);
				view.closeView();
				this.setting.successMessage();
            }
           
            
		});
	});