/**
 * Created by Marc on 16/04/2014.
 */
define([
    'backbone',
    // Pull in the Model module from above
    'models/llibre'
], function(Backbone, LlibreModel){
    var LlibreCollection = Backbone.Collection.extend({
        model: LlibreModel,
        url: "/llibres"
    });
    // You don't usually return a collection instantiated
    return LlibreCollection;
});