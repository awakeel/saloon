define(['text!reports/html/campaign_pie_chart.html','goog!visualization,1,packages:[corechart]'],
function (template) {
        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // Campaign Reports page 
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        'use strict';
        return Backbone.View.extend({                        
            /**
             * Attach events on elements in view.
            */            
            events: {				              
            },
            /**
             * Initialize view - backbone .
            */
            initialize:function(){
              // _.bindAll(this, 'searchByTag','updateRefreshCount');  
               this.template = _.template(template);		               
               this.render();
            },
            /**
             * Initialize view .
            */
            render: function () {
               this.$el.html(this.template({}));
               this.app = this.options.page.app;   
               this.legend = this.options.legend;
               this.chartArea = this.options.chartArea;
            }
            /**
             * Custom init function called after view is completely render in wrokspace.
            */
            ,                       
            createChart:function(_data){
              if(this.chart){
                  this.chart.clearChart();
              }  
              var data = google.visualization.arrayToDataTable(_data);
              var options = {
                title: '',
                colors:['#454F88','#2F93E5','#62ABE6','#0C73C2','#B6CBDB'],
                pieSliceText: 'value',
                legend:this.legend,
                pieResidueSliceColor:'black',                          
                chartArea:this.chartArea,    
                fontSize:12,
                fontName:"'PT Sans',sans-serif",
                backgroundColor: 'transparent',
                'backgroundColor.stroke':'#ccc',
                'backgroundColor.strokeWidth':2,
                pieSliceTextStyle:{fontSize:16}                
              };
              var formatter = new google.visualization.NumberFormat(
                        {pattern:'#,###'}
                );
              formatter.format(data, 1);      
              this.chart = new google.visualization.PieChart(this.el);
              this.chart.draw(data, options);
             
            }
        });
});