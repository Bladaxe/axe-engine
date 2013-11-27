define([
    'jquery',
    'underscore',
    'classes/View',

    'text!../tmpl/item.html'
], function($, _, View, tmpl){

    var _private = {

    };

    /**
     * @class NewsListItemView
     */
    var NewsListItemView = View.extend({

        selector: null

        ,constructor: function NewsListItemView(){
            View.apply(this, arguments);
        }

        ,render: function(){
            this.$el.html( _.template( tmpl, this.model.toJSON() ) );
            return this.$el;
        }


    });

    return NewsListItemView;

});