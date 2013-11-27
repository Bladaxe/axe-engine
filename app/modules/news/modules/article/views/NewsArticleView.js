define([
    'jquery'
    ,'underscore'
    ,'classes/ModuleView'
    ,'newsarticle/views/NewsArticleItemView'
    ,'text!../tmpl/article.html'
], function($, _, ModuleView, NewsArticleItemView, tmpl){

    var _private = {
        bindEvents: function(){
            this.listenTo(this.model, 'article.load', this.renderItem);
            this.listenTo(this.model, 'pause', this.clear);
        }
    };

    /**
     * @class ArticleView
     */
    var ArticleView = ModuleView.extend({

        constructor: function ArticleView(){
            ModuleView.apply(this, arguments);

        }

        ,initialize: function(){
            _private.bindEvents.call(this);
        }

        ,render: function(){
            this.$el.html( _.template( tmpl ) );
            return this.$el;
        }

        ,renderItem: function(item){
            var view = new NewsArticleItemView({model: item});
            view.setElement(this.elementByLabel('item'));
            view.render();
        }

        ,clear: function(){
            this.elementByLabel('item').html('');
        }

    });

    return ArticleView;

});