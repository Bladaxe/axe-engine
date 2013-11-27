define([
    'jquery'
    ,'classes/Model'
], function($, Model){

    'use strict';

    /**
     * @class NewsModel
     * */
    var NewsModel = Model.extend({

        defaults: {
            'id'        : 0
            ,'title'    : ''
        }

        ,url: app.getBaseUrl() + 'falseapi/newsitem.json'

        ,constructor: function NewsModel() {
            Model.apply(this, arguments);
        }

    });

    return NewsModel;

});