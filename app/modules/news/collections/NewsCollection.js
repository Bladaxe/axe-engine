define([
    'jquery'
    ,'classes/Collection'
    ,'../models/NewsModel'
], function($, Collection, NewsModel){

    'use strict';

    /**
     * @class NewsCollection
     * */
    var NewsCollection = Collection.extend({

        model: NewsModel

        ,url: app.getBaseUrl() + 'falseapi/news.json'

        ,constructor: function NewsCollection() {
            Collection.apply(this, arguments);
        }

    });

    return NewsCollection;

});