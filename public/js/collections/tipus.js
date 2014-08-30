/**
 * Created by Marc on 16/04/2014.
 */
define([
    'backbone',
    // Pull in the Model module from above
    'models/tipus'
], function(Backbone, TipusModel){
    var TipusCollection = Backbone.Collection.extend({
        model: TipusModel,
        url: "/tipus"
    });
    // You don't usually return a collection instantiated
    return TipusCollection;
});