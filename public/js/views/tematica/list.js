/**
 * Created by Marc on 16/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'bean',
    'collections/tematica',
    'collections/texts',
    'collections/imatges',
    'collections/llibres',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/tematica/listTematica.html',
    'event'
], function($, _, Backbone, bean, TematicaCollection, TextCollection, ImatgeCollection, LlibreCollection, tematicaListTemplate,Event) {
    var TematicaListView = Backbone.View.extend(function() {

        var tematica = new TematicaCollection();

        return {
            events: {
                'click .tematica' : 'canviarTematica'
            },

            initialize: function (params) {
                var that = this;
                this.update();
                tematica.on('reset', function () {
                    that.update();
                })
            },

            render: function () {
                // Using Underscore we can compile our template with data
                var compiledTemplate = _.template(tematicaListTemplate, {items: tematica});
                // Append our compiled template to this Views "el"
                this.$el.empty().append(compiledTemplate);
                this.delegateEvents();
            },

            update: function (options,ruta) {
                var op = options || {reset: true}
                var that = this;
                tematica.fetch({data: $.param( op )}).done(
                    function(){
                        that.render(ruta);
                    }
                );
            },

            canviarTematica : function(el) {
                $('.more').html('Més...').removeAttr('disabled');
                $('#panellTematica').find('.active').attr('class', 'list-group-item tematica');
                var element = el.target;
                var codiTematica = $(element).children().get(0).value;
                $(element).attr('class', 'list-group-item tematica active');
                bean.fire(Event, "canviarTematica", codiTematica);
            },

            more:function(options, coleccio) {
                this.$('.more').html('Carregant...').attr('disabled', 'disabled');
                var tipus = $('#general').find('.active').text().toLowerCase();
                var tematica = $('#panellTematica').find('.active').children().val();

                //Tres events
                var elements;
                if(tipus=="texts") {
                    elements = new TextCollection();
                }
                else if(tipus=="imatges") {
                    elements = new ImatgeCollection();
                }
                else if(tipus=="llibres") {
                    elements = new LlibreCollection();
                }

                if(tematica == -1) {//Carreguem tots els elements
                    elements.fetch({data: $.param(options)}).done(
                        function () {
                            var el = '#columna1';
                            if(tipus=="texts")el = "#llistaText";
                            bean.fire(Event, "mesPagines", {el: el, elements: elements, tipus: tipus, coleccio:coleccio});
                        });
                }
                else {
                    $.ajax({
                        url: "tematica/" + tematica + '/' + tipus,
                        data: options,
                        success: function (data) {
                            for (var i = 0; i < data.length; i++) {
                                if (tipus == "texts")elements.add(data[i].text);
                                else if (tipus == "imatges")elements.add(data[i].imatge);
                                else if (tipus == "llibres")elements.add(data[i].llibre);
                            }
                            var el = '#columna1';
                            if(tipus=="texts")el = "#llistaText";
                            bean.fire(Event, "mesPagines", {el: el, elements: elements, tipus: tipus, coleccio:coleccio});
                        },
                        fail: function (data) {
                        }
                    })
                }
                this.$('.more').html('Més...').removeAttr('disabled');
            }


        }
    }());

    // Our module now returns our view
    return TematicaListView;
});