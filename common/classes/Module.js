define([
    'underscore',
    'classes/Model'
], function(_, Model){

    var _private = {
        
        bindEvents: function(){
//            console.error('events');
        }

        ,unBindEvents: function(){
//            console.error('unevents');
        }
        
    };
    
    /**
     * @class Module
     * */
    var Module = Model.extend({

        defaults: {
            id: 0
            ,parent: null
        }

        ,modules: {}

        ,routes: null

        ,_view: null

        ,_viewClass: null

        ,_i18n: {}

        ,_prefix: ''

        ,_ready: false

        ,constructor: function Module(options){

            this._prefix = (options.parent ? options.parent.getEventsPrefix() + '.': '') + options.id;

            this.on('initialize', this.onInitialize);

            Model.apply(this, arguments);

            this.on('run', this.onRun);
            this.on('resume', this.onResume);
            this.on('pause', this.onPause);
            this.on('stop', this.onStop);
            this.on('destroy', this.onDestroy);

            this.on('module.load module.resume', this.onChildModuleLoad);
        }

        ,onInitialize: function(){}

        ,initialize: function() {
            this.trigger('initialize');
//            console.error('%cInitialize', 'color: blue', this.id);
            this._status = Module.STATUS_CREATED;
        }

        ,onRun: function() {}

        ,run: function() {
            log.i('%crun', 'color: lightgreen', this.id);

            var parent = this.getParent();

            if(parent){
                mediator.subscribe(parent.getEventsPrefix() + '.ready', _.bind(function(status){
                    if(this._viewClass && !this._view){
                        this._view = new this._viewClass({model: this});
                        this._view.render();
                        this.setReady(true);
                    }
                }, this));

                this.listenTo(parent, 'pause', _.bind(function(){
                    this.pause();
                }, this));
            }

            this.trigger('run');
            this.resume();

            return this;
        }

        ,onResume: function(){}

        ,resume: function() {
            log.i('%cresume', 'color: green', this.id);
            this.trigger('resume');
            this._status = Module.STATUS_RESUMED;
        }

        ,onPause: function(){}

        ,pause: function() {
            if(this._status != Module.STATUS_PAUSED){
                log.i('%cpause', 'color: gold', this.id);
                this.trigger('pause');
                this.setReady(false);
                this._status = Module.STATUS_PAUSED;
            }
        }

        ,onStop: function(){}

        ,stop: function() {
            if(this._status != Module.STATUS_STOPED){
                log.i('%cstop', 'color: orange', this.id);
                this.trigger('stop');
                this.setReady(false);
                this._status = Module.STATUS_STOPED;
            }
        }

        ,onDestroy: function(){}

        ,destroy: function() {
            log.i('%cdestroy', 'color: maroon', this.id);
            this.setReady(false);
            this.trigger('destroy');
        }

        /**
         * Publishes event in mediator (app)
         * @protected
         * @methodOf Module.prototype
         * @param {String} eventName
         */
        ,publish: function(eventName){

            if(!eventName) return;

            var args = _.toArray(arguments);
            args[0] = this.getEventsPrefix() + '.' + eventName;
            mediator.publish.apply(this, args);

        }

        ,subscribe: function(channels, subsciptions){

            var args = Array.prototype.slice.call(arguments, 1)
                ,_channels = channels.split(' ')
                ,_prefixChannels = []
                ,i = _channels.length
                ;

            while(i--) {
                _prefixChannels[i] = this.getEventsPrefix() + '.' + _channels[i];
            }

            args[0] = _prefixChannels.join(' ');
            mediator.publish.apply(this, args);
        }

        ,unsubscribe: function(channels){

        }

        ,hasRoute: function(route){
            if(!this.routes) return false;
            var router = mediator.getRouter(),
                pattern = null,
                key = ''
                ;
            for(key in this.routes){
                if(this.routes.hasOwnProperty(key)){
                    pattern = router.routeToRegExp(key + (this.routes[key]['params'] ? '/' + this.routes[key]['params'] : ''));
                    if(pattern.test(route)) return [key, this.routes[key]];
                }
            }
            return false;
        }

        ,setUserData: function(key, data){
            var fullKey = this.id.replace(/\//g,'.') + '.' + key;
            return app.getStorage().set(fullKey, data);
        }

        ,getUserData: function(key){
            var fullKey = this.id.replace(/\//g,'.') + '.' + key;
            return app.getStorage().get(fullKey);
        }

        ,getEventsPrefix: function(){
            return this._prefix;
        }

        ,getView: function(){
            return this._view;
        }

        ,i18n: function(){
            return this._i18n;
        }

        /**
         * @param {boolean} status
         * */
        ,setStatus: function(status){
            this.publish('loading', status);
        }

        ,getParent: function(){
            return this.get('parent');
        }

        /**
         * @param {String|Array} name
         * @param {Function} [callback]
         * */
        ,loadModules: function(name, callback){
            var modules = _.isArray(name) ? name: [name];
            require(
                modules
                ,_.bind(function(){

                    for(var i = 0, l = arguments.length; i < l; ++i){
//                        if(modules[i] == 'comments') {
//                            log.c('load modules comments', this.id, this.modules);
//                        }
                        this.modules[modules[i]] = new arguments[i]({
                            id: modules[i],
                            parent: this
                        });
                    }

                    if(_.isFunction(callback)){
                        callback(this.modules[modules[0]]);
                    }

                }, this)
                , _.bind(function(e){

                    console.error('Sorry! Module ' + e + ' disabled');

                })
            );

        }

        ,getModules: function(){
            return _.keys(this.modules);
        }

        /**
         * @param {String|Array} name
         * */
        ,attachModules: function(){

            var name    = Array.prototype.slice.call(arguments, 0),
                run     = []
                ,i      = name.length
                ;

            while(i--){
                if(this.modules[name[i]]){

                    this.trigger('module.resume', name[i]);
                    this.modules[name[i]].resume();
                } else {
                    run.push(name[i]);
                }
            }

            this.loadModules(run, _.bind(function(){

                var i = run.length;

                while(i--){
                    this.trigger('module.load', run[i]);
                    this.modules[run[i]].run();
                }
            }, this));
        }

        ,onChildModuleLoad: function(moduleName){}

        ,setReady: function(status){
            this._ready = status;
            this.publish('ready', status);
        }

    });

    Module.STATUS_BUSY      = 0;
    Module.STATUS_CREATED   = 1;
    Module.STATUS_RESUMED   = 2;
    Module.STATUS_PAUSED    = 3;
    Module.STATUS_STOPED    = 4;

    return Module;

});
