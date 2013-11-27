define([
    'underscore'
    ,'backbone'
], function(_, Backbone){

    /**
     * @class Model
     * */
    var Model = Backbone.Model.extend({
        constructor: function Model(){
            Backbone.Model.apply(this, arguments);
        }
    });

    return Model;
});
