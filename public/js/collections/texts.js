
/**
 * Created by Marc on 16/04/2014.
 */

define([
    'backbone',
    // Pull in the Model module from above
    'models/text'
], function(Backbone, TextModel){
    var TextCollection = Backbone.Collection.extend({
        model: TextModel,
        url: "/texts"
    });
    // You don't usually return a collection instantiated
    return TextCollection;
});