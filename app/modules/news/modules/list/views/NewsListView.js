define([
    'jquery'
    ,'underscore'
    ,'classes/ModuleView'
    ,'newslist/views/NewsListItemView'
    ,'text!../tmpl/list.html'
], function($, _, ModuleView, NewsListItemView, tmpl){

    var _private = {

        bindEvents: function(){
            this.listenTo(this.model, 'list.load', this.renderList);
        }
    };

    /**
     * @class NewsListView
     */
    var NewsListView = ModuleView.extend({

        constructor: function NewsListView(){
            ModuleView.apply(this, arguments);
        }

        ,initialize: function(){
            _private.bindEvents.call(this);
        }

        ,render: function(){
            this.$el.html( _.template( tmpl ) );
            return this.$el;
        }

        ,renderList: function(items){
            var $list = this.elementByLabel('list')
                ,view = null;

            $list.html('');
            items.each(function(model){
                view = new NewsListItemView({model: model});
                $list.append(view.render());
            });
        }
    });

    return NewsListView;

});