/**
 * Created by Marc on 16/04/2014.
 */
define([
    'underscore',
    'backbone'

], function(_, Backbone){
    var ComentariModel = Backbone.Model.extend({
        urlRoot: "/comentaris",
        idAttribute: 'codi',

        initialize: function (options) {
            if(options) {
                var tipus = options.tipus;
                if (tipus == 1) this.urlRoot = "/comentaris/texts";
                else if (tipus == 2) this.urlRoot = "/comentaris/imatges";
                else if (tipus == 3) this.urlRoot = "/comentaris/llibres";
            }
        },
        update: function(values) {
            return this.save(values);
        }
    });

    // Return the model for the module
    return ComentariModel;
});