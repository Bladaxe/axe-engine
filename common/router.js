define(
    'router', ['backbone'],
function() {

    var _router = null;

    var _lastPath = null;

    /**
     * @class
     */
    var AppRouter = Backbone.Router.extend({
        routes: {
            '*actions': 'default'
        }
    });

    return {

        initialize: function(){
            _router = new AppRouter;
            _router.on('route:default', function (actions) {
                _lastPath = actions === null ? '': actions;
            });

            Backbone.history.start({pushState: true});

            /**
             * change bahavior of core backbone method to call all handlers attached to url
             * @param fragmentOverride
             * @returns {boolean}
             */
            Backbone.history.loadUrl = function(fragmentOverride) {
                var fragment = this.fragment = this.getFragment(fragmentOverride);
                var matched = false;
                _.map(this.handlers, function(handler) {
                    if (handler.route.test(fragment)) {
                        handler.callback(fragment);
                        matched = true;
                    }
                });
                return matched;
            };
        }

        ,addRoutes: function(routes){

            _.each(routes, _.bind(function(action, key){
                if(!_.isFunction(action) && !_.isObject(action)) return;
                var callback,
                    context = this,
                    route = key + (action.params ? '/' + action.params : '')
                    ;

                if(_.isFunction(action)) {
                    callback = action;
                } else {
                    callback = action.callback;
                    context = action.context;
                }

                _router.route(route, key, function(){
                    callback.apply(context, arguments);
                });

                if(_lastPath !== null) {

                    var routeExp = this.routeToRegExp(route)
                        ,match = _lastPath.match();

                    if(match) {
                        var args = this.getParams(routeExp, _lastPath);
                        callback.apply(context, args);
                    }
                }
            }, this));
        }

        ,go: function(url) {
            var opts = _.extend({trigger:true}, arguments[1] || {});
            _router.navigate(url, opts);
        }

        ,back: function(){
            return window.history.back();
        }

        ,getRoutes: function(){
            return _router.routes;
        }

        ,routeToRegExp: function(route){
            return _router._routeToRegExp(route);
        }

        ,getPathParams: function(path){
            var result = '';

            if(path) {
                path.replace(/^\/+|\/+$/g, '');
                result = path.split('/')[0];
            }

            return result;
        }

        ,getParams: function(regExp,route){
            try {
                return _router._extractParameters(regExp, route);
            } catch(ex){
                return [];
            }
        }

        ,getRouter: function(){
            return _router;
        }
    };
});
