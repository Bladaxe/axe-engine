define([
    'jquery'
    ,'underscore'
    ,'backbone'
], function($, _, Backbone){

    /**
     * @class View
     * */
    var View = Backbone.View.extend({

        hiddenClass: 'hidden'

        ,constructor: function View(){
            Backbone.View.apply(this, arguments);
        }

        ,render: function(){}

        ,elementByLabel: function(label){
            var prefix = '';
            if(this.model){
                prefix = this.model.id + '.';
            }

            var $el = this.$el.find("[data-label='" + prefix + label + "']");
            return $el.length == 0 ? null: $el;
        }

        ,hide: function(){
            this.toggle(true);
        }

        ,show: function(){
            this.toggle(false);
        }

        /**
         * @param {boolean} [status]
         * */
        ,toggle: function(status){
            if(this.$el){
                status = typeof status == 'undefined' ? !this.$el.hasClass(this.hiddenClass): status;
                this.$el.toggleClass(this.hiddenClass, status);
            } else {
                app.logW('Element not found for toggle', this);
            }

        }
    });

    return View;
});
