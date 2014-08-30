/**
 * Created by Marc on 16/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'bean',
    'text!/templates/general/cercador.html',
    'event'
], function($, _, Backbone, bean, cercadorTemplate,Event) {
    var CercadorView = Backbone.View.extend(function() {

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
            },

            buscar : function(element) {
                var tipus = $('#general').find('.active').text().toLowerCase();
                var that = this;
                var string = $('#aBuscar').val();
                $.ajax({
                    url:"/search/"+tipus+"/"+string,
                    success:function(data) {
                        bean.fire(Event,"resultatCercaOK",{tipus:tipus,data:data})
                    },
                    fail:function(data) {}
                })
            }
        }
    }());

    // Our module now returns our view
    return CercadorView;
});