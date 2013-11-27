define([
    'jquery',
    'underscore',
    'classes/View',

    'text!../tmpl/item.html'
], function($, _, View, tmpl){

    var _private = {
        bindEvents: function(){

        }
    };

    /**
     * @class NewsArticleItemView
     */
    var NewsArticleItemView = View.extend({

        constructor: function NewsArticleItemView(){
            View.apply(this, arguments);
        }

        ,initialize: function(){
            _private.bindEvents.call(this);
        }

        ,render: function(){

            this.model.set('title', Math.random());

            this.$el.html( _.template( tmpl, this.model.toJSON()) );
            return this.$el;
        }

    });

    return NewsArticleItemView;

});