define('bar', [
    'jquery',
    'classes/Module',
    'bar/views/BarView'
], function($, Module, BarView){

    'use strict';

    var _private = {
        bindEvents: function(){

        }
    };

    /**
     * @class BarModule
     * */
    var BarModule = Module.extend({

        constructor: function BarModule() {
            Module.apply(this, arguments);
            this._viewClass = BarView;
        }

        ,onRun: function(){
            _private.bindEvents.apply( this );
        }

    });

    return BarModule;

});