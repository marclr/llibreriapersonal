/**
 * Created by Marc on 16/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/text/list.html'
], function($, _, Backbone,  textListTemplate) {
    var ContingutTextView = Backbone.View.extend(function() {

        return {
            initialize: function (params) {
                var that = this;
            },
            render: function (texts) {
                //Afegim contingut
                var imatgesContingut = _.template(textListTemplate, {items: texts});
                this.$el.empty().append(imatgesContingut);
            },
            update: function (texts) {
                this.render(texts);
            }
        }
    }());

    // Our module now returns our view
    return ContingutTextView;
});