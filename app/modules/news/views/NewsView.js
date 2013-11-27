define([
    'jquery'
    ,'underscore'
    ,'classes/ModuleView'

    ,'css!../assets/news.css'
    ,'text!../tmpl/news.html'
], function($, _, ModuleView, css, tmpl){

    var _private = {

        bindEvents: function(){
            this.model.on('module.load module.resume', _.bind(_private.modulePrepare, this));
            this.listenTo(this.model, 'pause', _.bind(this.pauseModules, this));
        }

        ,modulePrepare: function(moduleName){
//            this.getChildModules(moduleName).addClass(this._hiddenClass);
//            this.elementByModuleName(moduleName).removeClass(this._hiddenClass);
        }
    };

    /**
     * @class NewsView
     */
    var NewsView = ModuleView.extend({

        constructor: function NewsView(){
            ModuleView.apply(this, arguments);
        }

        ,initialize: function(){
            _private.bindEvents.call(this);
        }

        ,render: function(){
            this.$el.html( _.template( tmpl ) );
            return this.$el;
        }


    });

    return NewsView;

});