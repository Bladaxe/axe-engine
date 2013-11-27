define([
    'underscore'
    ,'backbone'
], function(_, Backbone){

    /**
     * @class Collection
     * */
    var Collection = Backbone.Collection.extend({
        constructor: function Collection(){
            Backbone.Collection.apply(this, arguments);
        }
    });

    return Collection;
});
