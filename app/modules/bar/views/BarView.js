define([
    'jquery',
    'underscore',
    'classes/ModuleView',

    'text!../tmpl/bar.html'
], function($, _, ModuleView, tmpl){

    var _private = {
        bindEvents: function(){

        }
    };

    /**
     * @class BarView
     */
    var BarView = ModuleView.extend({

        constructor: function BarView(){
            ModuleView.apply(this, arguments);
        },

        initialize: function(){
            _private.bindEvents.call(this);
        }

        ,el: $('[data-module=bar]')

        ,render: function(){
            this.$el.html( _.template( tmpl, this.model.toJSON() ) );
            return this.$el;
        }

    });

    return BarView;

});