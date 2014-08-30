/**
 * Created by Marc on 16/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/imatge/list.html'
], function($, _, Backbone,  imatgeListTemplate) {
    var ContingutImatgeView = Backbone.View.extend(function() {

        return {
            initialize: function (params) {
                var that = this;
            },
            render: function (imatges) {
                //Afegim contingut
                var imatgesContingut = _.template(imatgeListTemplate, {items: imatges});
                this.$el.empty().append(imatgesContingut);
            },
            update: function (imatges) {
                this.render(imatges);
            }
        }
    }());

    // Our module now returns our view
    return ContingutImatgeView;
});