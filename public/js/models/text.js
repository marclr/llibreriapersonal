/**
 * Created by Marc on 16/04/2014.
 */
define([
    'underscore',
    'backbone'

], function(_, Backbone){
    var TextModel = Backbone.Model.extend({
        urlRoot: "/texts",
        idAttribute: 'codi',


        update: function(values) {
            return this.save(values);
        }
    });

    // Return the model for the module
    return TextModel;
});