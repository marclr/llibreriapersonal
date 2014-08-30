/**
 * Created by Marc on 16/04/2014.
 */
define([
    'backbone',
    // Pull in the Model module from above
    'models/tematica'
], function(Backbone, TematicaModel){
    var TematicaCollection = Backbone.Collection.extend({
        model: TematicaModel,
        url: "/tematica"
    });
    // You don't usually return a collection instantiated
    return TematicaCollection;
});