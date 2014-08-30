/**
 * Created by Marc on 16/04/2014.
 */
define([
    'underscore',
    'backbone'
], function(_, Backbone){
    var TipusModel = Backbone.Model.extend({
        urlRoot: "/tipus",

        elementsByTipus: function() {
            var retorn = this.save(null);
            return retorn;
        }
    });
    // Return the model for the module
    return TipusModel;
});