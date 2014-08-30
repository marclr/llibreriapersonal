/**
 * Created by Marc on 16/04/2014.
 */
define([
    'underscore',
    'backbone'
], function(_, Backbone){
    var ImatgeModel = Backbone.Model.extend({
        urlRoot: "/imatges",
        idAttribute: 'codi',

        update: function(values) {
            return this.save(values);
        }
    });
    // Return the model for the module
    return ImatgeModel;
});