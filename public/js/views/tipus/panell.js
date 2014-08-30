/**
 * Created by Marc on 09/05/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/tipus',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/tipus/listTipus.html'
], function($, _, Backbone, TipusCollection, tipusListTemplate) {
    var TipusListView = Backbone.View.extend(function() {

        var tipus = new TipusCollection();

        return {

            initialize: function (params) {
                var that = this;
                tipus.on('reset', function () {
                    that.update();
                })
            },

            render: function (codi) {
                // Using Underscore we can compile our template with data
                var compiledTemplate = _.template(tipusListTemplate, {items: tipus, sel:codi});
                // Append our compiled template to this Views "el"
                this.$el.empty().append(compiledTemplate);
            },

            update: function (options,codi) {
                var op = options || {reset: true}
                var that = this;
                tipus.fetch({data: $.param( op )}).done(
                    function(){
                        that.render(codi);
                    }
                );
            }
        }
    }());

    // Our module now returns our view
    return TipusListView;
});