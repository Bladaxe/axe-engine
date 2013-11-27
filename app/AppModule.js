define([
    'jquery'
    ,'backbone'
    ,'underscore'
    ,'router'
    ,'classes/Module'
    ,'app/views/AppView'
    ,'i18n!app/nls/app'
    ,'css!/app/assets/app.css'
], function($, Backbone, _, Router, Module, AppView, i18n){

//    'use strict';

    var _config = {
        debug: true
        ,pageCache: 5
        ,pages: {
            'news': 'news'
        }
        ,require: {
            packages: [
                {name: 'news' , main: 'NewsModule' , location: '/app/modules/news'}
                ,{name: 'bar' , main: 'BarModule' , location: '/app/modules/bar'}
            ]
        }
    };

    require.config(_config.require);

    var _pages = [];

    var _private = {
        bindEvents: function(){
            this.on('navigate', _.bind(_private._onNavigate, this));
        }

        ,_onNavigate: function(link){
            _router.go(link, true);
        }
    };

    //set ajax defaults
    $.ajaxSetup({
        crossDomain : true
        ,method     : 'POST'
        ,type       : 'POST'
        ,dataType   : 'json'
        ,processData: false
        ,contentType: 'application/json'
        ,traditional: true
        ,xhrFields  : {
            withCredentials: false
        }
        ,statusCode: {
            200: function(data){
                log.i('%cLoaded', 'background: yellow; color: green', data);
            }
        }
        ,beforeSend : function(xhr, params){
            params.data = JSON.stringify(params.data);
            ( params.type == 'GET' ) && ( params.type = 'POST' );
        }
    });

    var _router = Router
        ,_baseUrl = '/'
        ;

    /**
     * @class AppModule
     * */
    var AppModule = Module.extend({

        constructor: function AppModule() {
            Module.apply(this, arguments);
        }

        ,onInitialize: function(){

            _router.initialize();

            this.modules = {
                bar     : null
                ,news   : null
            };
        }

        ,onRun: function(){
            _private.bindEvents.apply( this );

            this._view = new AppView({model: this});
            this._view.render();
            this.setReady(true);

            this.routes = {
                '(*actions)': {
                    callback: _.bind(function(link) {

                        var path = _router.getPathParams(link),
                            moduleName = path === '' ? _config.pages[_.keys(_config.pages)[0]]: (_config.pages[path]);

                        if(typeof moduleName == 'undefined') {
                            console.error(404);
                            return false;
                        }

                        this.attachModules(moduleName);

                        return true;
                    }, this)

                }
            };

            app.getRouter().addRoutes(this.routes);

            this.attachModules('bar');
        }

        ,onChildModuleLoad: function(module) {

            if(_.indexOf(this.getPages(), module) != -1){
                var lastModule = _.last(_pages);

                if(lastModule != module) {

                    _pages = _.without(_pages, module);
                    _pages.push(module);

                    if(_pages.length > _config.pageCache){
                        var oldModuleName = _pages.shift();
                        this.trigger('module.destroy', oldModuleName);
                        this.modules[oldModuleName].destroy();
                        delete this.modules[oldModuleName];
                    }

                    if(lastModule) {
                        this.trigger('module.pause', lastModule);
                        this.modules[lastModule].pause();
                    }
                }
            }

        }

        ,getPages: function(){
            return _.values(_config.pages);
        }

        ,getRouter: function(){
            return _router;
        }

        /**
         * @param {String} name
         * @param {String} [defaultName]
         * @return {String}
         * */
        ,_: function(name, defaultName){
            defaultName = typeof defaultName == 'undefined'? '': defaultName;
            return typeof i18n[name] == 'undefined' ? defaultName: i18n[name];
        }

        /**
         * Base url for all ajax calls
         * @return {String}
         */
        ,getBaseUrl: function(){
            return _baseUrl;
        }

    });

    return AppModule;

});