/**
 * Created by Marc on 05/06/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'bean',
    'text!/templates/general/rating.html',
    'event'
], function($, _, Backbone, bean, cercadorTemplate,Event) {
    var RatingView = Backbone.View.extend(function() {

        return {
            events: {
                'click #search' : 'buscar'
            },
            initialize: function (params) {

            },

            render: function () {
                // Using Underscore we can compile our template with data
                var compiledTemplate = _.template(cercadorTemplate, {});
                // Append our compiled template to this Views "el"
                this.$el.empty().append(compiledTemplate);
            },

            update: function () {
                this.render();
            }
        }
    }());

    // Our module now returns our view
    return RatingView;
});