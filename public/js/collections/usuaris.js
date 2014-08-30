/**
 * Created by Marc on 16/04/2014.
 */
define([
    'backbone',
    // Pull in the Model module from above
    'models/usuari'
], function(Backbone, UsuariModel){
    var UsuariCollection = Backbone.Collection.extend({
        model: UsuariModel,
        url: "/usuaris"
    });
    // You don't usually return a collection instantiated
    return UsuariCollection;
});