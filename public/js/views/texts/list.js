/**
 * Created by Marc on 16/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'bean',
    'collections/texts',
    'views/tematica/list',
    'views/general/cercador',
    'views/texts/contingut',
    'views/general/comentari',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/general/listPattern.html',
    'event',
    'util'
], function($, _, Backbone, bean, TextCollection, TematicaListView, CercadorView, ContingutTextsView, ComentariView, listPattern, Event, util) {
    var TextsListView = Backbone.View.extend(function() {

        var texts = new TextCollection();
        var tematicaView;

        var options = {
            page: 0,
            limit: 5,
            public: 1,
            esborrat: 0,
            reset: true
        };

        return {

            events : {
                'click #puntuacions': "starRating"
              //'click .text':"showText"
              //'click #close':"closeText", Es troba dins de la funcio render
            },

            initialize: function (params) {
                var that = this;
                texts.on('reset', function () {
                    that.update();
                })
            },

            starRating: function(element){
                // obtenir puntuacions
                //var puntuacions = $(element.currentTarget).find('input[name="#puntuacions"]').val();
                var codiText = $('#codi_element').val();
                var values = util.getInputsForm('#contingutText');
                var codi = $(element.currentTarget).find('input[name="codi"]').val();
                //var model = texts.get(codi);
                var puntuacions = $( "input:checked" ).val();

                var values = Object.create({tipus: {values: null}, login: {values: null}, llibre: {values: null}, imatge: {values: null}, codiText: {values: null}, puntuacio: {values: null}});
                values.login = null;
                values.llibre = null;
                values.imatge = null;
                values.tipus = 1;
                values.puntuacio = puntuacions;
                values.text = codiText;
                console.log(values);
                $.ajax({
                    data: values,
                    type: "PUT",
                    url: "/puntuacions/"+ values.text,
                    success:
                        function (data) {
                            bean.fire(Event,"puntuacioOK", data);
                        },
                    error:
                        function (data) {
                            bean.fire(Event, "puntuacioKO", data);
                        }
                })
            },

            showText: function(element) {
                var codi = $(element.currentTarget).find('input[name="codi"]').val();
                var model = texts.get(codi);
                $('#titol_element').empty().append(model.get('titol'));
                $('#text_element').empty().append(model.get('text'));
                $('#codi_element').val(model.get('codi'));

                //Mostrem el que toca
                $('#llistaText').hide();
                $('.pager').hide();
                $('#contingutText').show().addClass('panel panel-default');

                //Carreguem el form de posar comentaris
                var comentari = new ComentariView({el:'#comentaris'});
                comentari.update(1,codi);
            },

            closeText: function(){
                $('#llistaText').show();
                $('.pager').show();
                $('#contingutText').hide().removeClass('panel panel-default');
                $('#titol_element').empty();
                $('#text_element').empty();
            },

            render: function () {
                var compiledTemplate = _.template(listPattern, {nomPagina: "Texts"});
                this.$el.empty().append('<br><br>'+compiledTemplate);

                //Afegim les tematiques
                tematicaView = new TematicaListView({el:'#panellTematica'});
                tematicaView.update();

                //Afegim les tematiques
                var cercaView = new CercadorView({el:'#cercador'});
                cercaView.update();

                //Afegim contingut
                var llibresContingut = new ContingutTextsView({el:'#contingut'});
                llibresContingut.update(texts);

                //Events
                $(".more").on("click", this.more);
                $("#close").on("click", this.closeText);
                $(".text").on("click", this.showText);
                $('button.more').show();
            },

            renderTexts: function () {
                var textsContingut = new ContingutTextsView({el:'#contingut'});
                textsContingut.update(texts);
                $("#close").on("click", this.closeText);
                $(".text").on("click", this.showText);
                $('button.more').show();
            },

            more: function () {
              tematicaView.more(options, texts);
              options.page++;
            },

            inicialitzarOptions: function() {
                options = {
                    page: 0,
                    limit: 5,
                    public: 1,
                    esborrat: 0,
                    reset: true
                };
            },

            update: function (nou,elements) {
                if(nou) { this.inicialitzarOptions();  }
                var that = this;
                if(elements) {
                    texts = elements;
                    that.renderTexts();
                    if(texts.length>0) options.page++;
                }
                else {
                    //Resetejem les opcions inicials
                    texts.fetch({data: $.param(options)}).done(
                        function () {
                            if (texts.length > 0) options.page++;
                            that.render();
                        }
                    );
                }
            }
        }
    }());

    // Our module now returns our view
    return TextsListView;
});