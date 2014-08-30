
/**
 * Created by Marc on 16/04/2014.
 */

define([
    'backbone',
    // Pull in the Model module from above
    'models/comentari'
], function(Backbone, ComentariModel){
    var ComentariCollection = Backbone.Collection.extend({
        model: ComentariModel,
        url: "/comentaris"
    });
    // You don't usually return a collection instantiated
    return ComentariCollection;
});