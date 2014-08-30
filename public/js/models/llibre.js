/**
 * Created by Marc on 16/04/2014.
 */
define([
    'underscore',
    'backbone'
], function(_, Backbone){
    var LlibreModel = Backbone.Model.extend({
        urlRoot: "/llibres",
        idAttribute: 'codi',

        update: function(values) {
            return this.save(values);
        }
    });
    // Return the model for the module
    return LlibreModel;
});