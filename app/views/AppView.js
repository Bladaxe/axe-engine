define([
    'jquery',
    'underscore',
    'classes/ModuleView',

    'text!../tmpl/app.html',
    'text!../tmpl/module.html'
], function($, _, ModuleView, tmpl, tmplModule){

    var _private = {

        bindEvents: function(){
            this.model.on('module.load module.resume', _.bind(_private.modulePrepare, this));
        }

        ,onLinkClick: function(e){
            var $el = $(e.currentTarget)
                ,href = $el.attr('href')
                ,protocol = e.target.protocol + '//';

            if (href.slice(protocol.length) !== protocol) {
                e.preventDefault();
                this.model.trigger('navigate', $el.attr('href'), $el);
            }
        }

        ,modulePrepare: function(moduleName) {

            var $outerModule = this.$el.find('[data-module=' + moduleName + ']').not(this.$pages.find('[data-module] [data-module]')),
                $innerModule = this.$pages.children('[data-module=' + moduleName + ']');

            if($outerModule.length > 0 && $innerModule.length == 0){

            } else {

                this.$pages.children('[data-module]').addClass(this._hiddenClass);

                if($innerModule.length == 0){
                    this.$pages.append(_.template(tmplModule, {'id': moduleName}));
                }

                $innerModule.removeClass(this._hiddenClass);

            }
        }

        ,onSubmit: function(e){
            e.preventDefault();
        }

    };

    /**
     * @class AppView
     */
    var AppView = ModuleView.extend({

        $pages: null

        ,events: {
            'click a:not([data-bypass])': _private.onLinkClick
            ,'submit': _private.onSubmit
        }

        ,constructor: function AppView(){
            ModuleView.apply(this, arguments);
        },

        initialize: function(){
            _private.bindEvents.call(this);
        }

        ,render: function(){
            this.$el.html(_.template(tmpl));
            this.$pages = this.elementByLabel('pages');
            return this.$el;
        }

    });

    return AppView;

});