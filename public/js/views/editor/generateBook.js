/**
 * Created by Rachid on 18/04/2014.
 */
define([
    'jquery',
    'underscore',
    'bean',
    'backbone',
    'jqueryui',
    'models/llibre',
    'collections/texts',
    'collections/imatges',
    'collections/tematica',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/editor/generateBook.html',
    'event',
    'util'
], function($, _, bean, Backbone, jqueryui, ModelLlibre, TextCollection, ImatgeCollection, TematiquesCollection, generateBookTemplate, Event, util) {
    var GenerateBookView = Backbone.View.extend(function() {
        var text = new TextCollection();
        var imatge = new ImatgeCollection();
        var tematiques = new TematiquesCollection();
        var llibre = new ModelLlibre();


        return {
            events:{
                "click #gotopas2":"generarIndex",
                "click #gotopas3":"introduirDadesLlibre",
                "click #backtopas1":"seleccionarElements",
                "click #backtopas2":"generarIndex",//[TODO] Fer un metode apart per aixi no perdre l'index?
                "click #generar":"generarLLibre"
            },
            initialize: function (params) {
                var that = this;
            },


            generarLLibre: function() {
                var values = util.recollir('#pas3');
                var aux = util.checkValues(values);
                if(Object.keys(aux).length) {
                    util.showErrors(this.$el,aux);
                }
                else {
                    util.removeErrors();
                    var sele = $('#index input');
                    var longitud = sele.length;
                    var indexos = sele.eq(0).val();
                    for (var it = 1; it < longitud; it++) {
                        indexos = indexos + ";" + sele.eq(it).val();
                    }
                    values.index = indexos;
                    llibre.update(values).done(function (data) {
                        bean.fire(Event, 'llibreOK', data);
                    }).fail(function (data) {
                        bean.fire(Event, 'llibreKO', data);
                    });
                }
            },
            updateLlibre: function (values) {
                this.renderLlibre(values);
            },
            renderLlibre: function () {
                // Using Underscore we can compile our template with data
                var compiledTemplate = _.template(generateBookTemplate, {});
                // Append our compiled template to this Views "el"
                this.$el.empty().append(compiledTemplate);
            },
            introduirDadesLlibre: function() {
                $('#pas1').hide();
                $('#pas2').hide();
                $('#pas3').show();
            },
            seleccionarElements: function() {
                $('#index').empty();
                $('#pas1').show();
                $('#pas2').hide();
                $('#pas3').hide();
            },
            generarIndex: function() {
                var seleccionats = $('li.selected').clone().removeClass('selected').addClass('in-index');
                if(seleccionats.length>0) {
                    $('#index').empty().append(seleccionats);
                    $('#pas1').hide();
                    $('#pas2').show();
                    $('#pas3').hide();
                    $('#index').sortable();
                    util.removeErrors();
                }
                else{
                    $('#feedback.missatge-error').empty().append("No es pot crear un llibre sense escollir almenys un element");
                }
            },

            render: function () {
                var compiledTemplate = _.template(generateBookTemplate, {text:text, imatge:imatge, tematiques:tematiques});
                this.$el.empty().append(compiledTemplate);

                //Permetem seleccionar els elements que vulguin els usuaris per generar el llibre
                $("li.element").on("click", function(element) {
                    var e = $(element.currentTarget);
                    if(e.hasClass('not-selected')) {
                        e.removeClass('not-selected')
                        e.addClass('selected')
                    }
                    else {
                        e.removeClass('selected')
                        e.addClass('not-selected')
                    }
                })

                $("checkbox.tematica").on("click", function(element) {
                    var e = $(element.currentTarget);
                    if(e.hasClass('not-selected')) {
                        e.removeClass('not-selected')
                        e.addClass('selected')
                    }
                    else {
                        e.removeClass('selected')
                        e.addClass('not-selected')
                    }
                })
            },

            update: function () {
                var that = this;
                text.fetch().done(function() {
                    imatge.fetch().done(function() {
                        tematiques.fetch().done(function() {
                            that.render();
                        })
                    })
                });
            }
        }
    }());

    // Our module now returns our view
    return GenerateBookView;
});