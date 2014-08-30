/**
 * Created by Marc on 16/04/2014.
 */
define([
    'underscore',
    'backbone'
], function(_, Backbone){
    var TematicaModel = Backbone.Model.extend({
        urlRoot: "/tematica",

        elementsByTematica: function() {
            var retorn = this.save(null);
            return retorn;
        },
        getTematica: function(obj) {
            return this.fetch();
        }
    });
    // Return the model for the module
    return TematicaModel;
});