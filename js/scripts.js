$(document).ready(function() {
    SI.init();
});

var SI = {
    $currentPageContentWrapper: null,
	tagArray: ["NYFW", "LFW", "MFW", "PFW"],
    allChartData: undefined,
    defaultTag: "NYFW",
    currentTag: undefined,
    jsonData: undefined,
    init: function() {
		this.buildHeader();
        this.loadHashtag();
        
    },
    buildHeader: function() {
        var self = this;
        _.each(this.tagArray,function(tag){
            if (tag==self.defaultTag){
                $('.js-header').append('<li class="active"><div class="arrow-down"></div><a data-value="'+tag+'" class="js-hash" href="#">#'+tag+'</a></li>');
            }else{
                $('.js-header').append('<li><div class="arrow-down"></div><a data-value="'+tag+'" class="js-hash" href="#">#'+tag+'</a></li>');
            }
        });
            
        $('.js-header').on('click','.js-hash',function(e){
            e.preventDefault();
            self.currentTag = $(this).data("value");
            $('.js-header li').removeClass('active');
            $(this).parent().addClass('active');
            self.loadHashtag();
        });
    },
    loadHashtag: function(){
        var self = this;
        if (self.currentTag==undefined){
             self.currentTag = self.defaultTag;
             self.getChartData();
             self.getJson();
             
        }else{
             self.showLoading();
             self.getJson();
        }
    },
    getChartData: function(){
        var self = this;
        self.allChartData= [];
        _.each(this.tagArray,function(tag){
            $.ajax({
                type: 'GET',
                dataType: "JSON",
                url: 'http://localhost:9001/json/'+tag+'.json',
                data: {},
                success: function(data, status, xhr) {
                    var actualJson = data;
                    actualJson = data.timeline;
                    var array = [];
                    array.push(tag);
                    _.each(actualJson,function(itm){
                        array.push(itm.count);
                    });
                    self.allChartData.push(array);
                },
                error: function(xhr, error) {
                    alert('error');
                }
            });
            
        });
        
    },
    createChart: function(){
        var self = this;
        var chart = c3.generate({
            bindto: '.js-graph',
            legend: { show: false },
            axis: {
              y: {
                show: false
            },
              x: {
                  tick: {
                      outer: false
                    }
              }
          },
          tooltip: {
              show: false
            },
            point: {
              show: false
          },
            data: {
                columns: self.allChartData,
                type: 'spline'
            },
            
            
        });
    },
    updateData: function(){
        var self = this;
        $('.js-main-counter').html(self.jsonData.hashtag_count);
        _.each(self.jsonData.locations, function (v, k) {
                var value = parseInt((Object.values(v)[0]/self.jsonData.hashtag_count)*100);
                if (Object.keys(v).toString()=="New York"){
                    
                    $('.js-circle-nyc').css('transform','scale('+value+')');
                }
                if (Object.keys(v).toString()=="Paris"){
                    
                    $('.js-circle-par').css('transform','scale('+value+')');
                }
                if (Object.keys(v).toString()=="Milan"){
                    
                    $('.js-circle-mil').css('transform','scale('+value+')');
                }
                if (Object.keys(v).toString()=="London"){
                    
                    $('.js-circle-lnd').css('transform','scale('+value+')');
                }
          });
          $('.js-secondary-list').html("");
          _.each(self.jsonData.related_hashtags, function (v, k) {
              var hashtag = Object.keys(v).toString();
              var hastagValue = Object.values(v)[0];
              var html = '<div class="secondary-result__list-item"><div class="rel-hashtag"><div class="rel-hashtag__name headline-3">#'+ hashtag +'</div><div class="rel-hashtag__counter headline-2">'+ hastagValue +'</div></div></div>';
              $('.js-secondary-list').append(html);
          });
        //30/148*100

        
    },
    showLoading: function(){
        $('body').removeClass('loaded-hide loaded');
        
    },
    hideLoading: function(){
        $('body').addClass('loaded');
        setTimeout(function(){ $('body').addClass('loaded-hide'); }, 300);
    },
    getJson: function(){
        var self = this;
        $.ajax({
            type: 'GET',
            dataType: "JSON",
            url: 'http://localhost:9001/json/'+self.currentTag+'.json',
            data: {},
            success: function(data, status, xhr) {
                console.log(data, status, xhr);
                self.jsonData = data;
                setTimeout(function(){ self.updateData(); self.hideLoading();self.createChart(); }, 500);
                
                
            },
            error: function(xhr, error) {
                alert('error');
            }
        });
    }
};
