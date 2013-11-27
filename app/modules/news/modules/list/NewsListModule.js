define('newslist', [
    'jquery'
    ,'classes/Module'
    ,'newslist/views/NewsListView'
    ,'news/collections/NewsCollection'
], function($, Module, ViewClass, NewsCollection){

    'use strict';

    var _private = {

        items: new NewsCollection()

        ,bindEvents: function(){
            _private.items.on('sync', _.bind(_private.onSync, this));
        }

        ,getItems: function() {
            _private.items.fetch();
        }

        ,onSync: function() {
            this.trigger('list.load', _private.items);
        }
    };

    /**
     * @class NewsListModule
     * */
    var NewsListModule = Module.extend({



        constructor: function NewsListModule() {
            Module.apply(this, arguments);
            this._viewClass = ViewClass;
        }

        ,onInitialize: function(){
            _private.bindEvents.call(this);
        }

        ,onRun: function(){
            _private.getItems();
        }

        ,onPause: function(){

        }

    });

    return NewsListModule;

});