/**
 * Created by Marc on 16/04/2014.
 */
define([
    'backbone',
    // Pull in the Model module from above
    'models/imatge'
], function(Backbone, ImatgeModel){
    var ImatgeCollection = Backbone.Collection.extend({
        model: ImatgeModel,
        url: "/imatges"
    });
    // You don't usually return a collection instantiated
    return ImatgeCollection;
});