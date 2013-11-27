define([
    'jquery'
    ,'underscore'
    ,'classes/View'
], function($, _, View){

    /**
     * @class ModuleView
     * */
    var ModuleView = View.extend({

        _hiddenClass: 'hidden'

        ,_registered: {}

        ,_containerIsReady: false

        ,constructor: function ModuleView(){
            View.apply(this, arguments);

            var selector = _.isFunction(this.selector) ? this.selector(): this.selector;
            if(selector){
                this.setElement($(selector));
            }

            this
                .listenTo(this.model, 'pause', _.bind(function(){
                    if(this.$el){
                        this.$el.addClass(this._hiddenClass);
                    }
                },this))
                .listenTo(this.model, 'resume', _.bind(function(){
                    if(this.$el){
                        this.$el.removeClass(this._hiddenClass);
                    }
                }, this))
            ;


        }

        ,selector: function(){
            var parent = this.model.get('parent')
                ,result = '[data-module=' + this.model.id + ']';

            if(parent){
                result = parent.getView().$el.find(result);
            }

            return result;
        }

        ,switchModule: function(id){
            var $module = this.$el.find('[data-module=' + id + ']');

            this.$el.find('[data-module]')
                .not($module)
                .addClass(this._hiddenClass);
            $module.removeClass(this._hiddenClass);
        }

        ,pauseModules: function(){
            this.$el.find('[data-module]').addClass(this._hiddenClass);
        }

        ,getChildModules: function(exceptModule){
            var selectors = [];
            _.each(this.model.getModules(), function(moduleName){
                if(exceptModule != moduleName){
                    selectors.push('[data-module=' + moduleName + ']');
                }
            });
            return this.$el.find(selectors.join(','));
        }

        ,elementByModuleName: function(moduleName){
            return this.$el.find('[data-module=' + moduleName + ']');
        }

        ,register: function(name, events){
            var _object = null
                ;

            this._registered[name] = {};

            for(var _event in events){
                if(events.hasOwnProperty(_event)){
                    this._registered[name][_event] = null;
                }
            }

            for(var event in events){
                if(events.hasOwnProperty(event)){
                    _object = events[event];

                    this.listenTo(_object, event, _.bind(function(event, data){
                        var reg = this._registered[name]
                            ,result = true
                            ;
                        console.error(event, data);
                        reg[event] = data;
                        for(var evt in reg){
                            if(reg.hasOwnProperty(evt))
                            result = reg[evt] && result;
                        }

                        if(result){
                            this.trigger(name, reg);
                        }

                    }, this, event));
                }
            }
        }
    });

    return ModuleView;
});
