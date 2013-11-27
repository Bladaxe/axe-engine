define([
    'jquery',
    'underscore',
    'classes/View',

    'text!../tmpl/item.html'
], function($, _, View, tmpl){

    var _private = {

    };

    /**
     * @class NewsView
     */
    var NewsView = View.extend({

        $newsListElement: null

        ,selector: null

        ,constructor: function NewsView(){
            View.apply(this, arguments);
        }

        ,render: function(){
            this.$el.html( _.template( tmpl, this.model.toJSON() ) );
            return this.$el;
        }


    });

    return NewsView;

});