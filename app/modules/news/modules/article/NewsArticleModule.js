define('newsarticle', [
    'jquery'
    ,'classes/Module'
    ,'news/models/NewsModel'
    ,'newsarticle/views/NewsArticleView'
], function($, Module, NewsModel, ViewClass){

    'use strict';

    var _private = {
        bindEvents: function(){
            this._model.on('sync', _.bind(_private.onSync, this));
            this.on('article.change', _.bind(_private.onChange, this));
        }

        ,onChange: function(model){
            if(model.get('id')){
                this._model.fetch();
            }
        }

        ,onSync: function(){
            this.trigger('article.load', this._model);
        }
    };

    /**
     * @class NewsArticleModule
     * */
    var NewsArticleModule = Module.extend({

        _model: null

        ,modules: {
//            'comments': null
        }

        ,constructor: function ArticleModule() {
//            log.c('constructor news', this.modules);

            Module.apply(this, arguments);

            this._viewClass = ViewClass;
            this._model = new NewsModel;

            _private.bindEvents.call(this);

            this.routes = {
                'news(/:id)': {
                    callback: _.bind(function(id){
                        if(this._model.get('id') != id){
                            this._model.set('id', id);
                            this.trigger('article.change', this._model);
                        }

//                        if(id){
//                            this.attachModules('comments');
//                        }

                    }, this)
                }
            };

            app.getRouter().addRoutes(this.routes);
        }

    });

    return NewsArticleModule;

});