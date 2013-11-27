define('news', [
    'jquery'
    ,'classes/Module'
    ,'news/views/NewsView'
], function($, Module, ViewClass){

    'use strict';

    var _config = {
        pages: {
            'acticle'   : 'newsarticle'
            ,'list'     : 'newslist'
        }
        ,require: {
            packages: [
                {name: 'newsarticle', main: 'NewsArticleModule', location: '/app/modules/news/modules/article'}
                ,{name: 'newslist', main: 'NewsListModule', location: '/app/modules/news/modules/list'}
            ]
        }
    };

    require.config(_config.require);

    var _private = {

    };

    /**
     * @class NewsModule
     * */
    var NewsModule = Module.extend({

        newsId: 0

        ,modules: {
            'newslist'      : null
            ,'newsarticle'  : null
        }

        ,constructor: function NewsModule() {
            Module.apply(this, arguments);
        }

        ,onInitialize: function(){

            this._viewClass = ViewClass;

            this.routes = {
                'news(/:id)': {
                    callback: _.bind(function(id){
                        if(id){
                            this.newsId = id;
                            this.attachModules('newsarticle');
                        } else {
                            this.newsId = 0;
                        }
                    }, this)
                }
            };
            app.getRouter().addRoutes(this.routes);

        }

        ,onRun: function(){

        }

        ,onResume: function(){
            if(this.newsId == 0){
                this.attachModules('newslist');
            }
        }

        ,onPause: function(){
            this.newsId = 0;
        }

        ,onChildModuleLoad: function(moduleName){
            _.each(_config.pages, _.bind(function(module){
                if(module != moduleName && this.modules[module]){
                    this.modules[module].pause();
                }
            }, this));
        }

    });

    return NewsModule;
});