/**
 * Created by Marc on 16/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/llibre/list.html'
], function($, _, Backbone,  llibreListTemplate) {
    var ContingutLlibreView = Backbone.View.extend(function() {

        return {
            initialize: function (params) {
                var that = this;
            },
            render: function (llibres) {
                //Afegim contingut
                var imatgesContingut = _.template(llibreListTemplate, {items: llibres});
                this.$el.empty().append(imatgesContingut);
            },
            update: function (llibres) {
                this.render(llibres);
            }
        }
    }());

    // Our module now returns our view
    return ContingutLlibreView;
});