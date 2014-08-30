/**
 * Created by Marc on 16/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'bean',
    'models/text',
    'models/imatge',
    'collections/llibres',
    'views/tematica/list',
    'views/general/cercador',
    'views/llibres/contingut',
    'views/general/comentari',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/general/listPattern.html',
    'event',
    'util'
], function($, _, Backbone, bean, TextModel, ImatgeModel, LlibreCollection, TematicaListView, CercadorView, ContingutLlibresView, ComentariView, listPattern, Event, util) {
    var LlibresListView = Backbone.View.extend(function() {

        var llibres = new LlibreCollection();
        var tematicaView;

        var options = {
            page: 0,
            limit: 5,
            public: 1,
            esborrat: 0,
            reset: true
        };

        return {

            events: {
                'click #contingutLlibre': "starRating"
            },
            initialize: function (params) {
                var that = this;
                llibres.on('reset', function () {
                    that.update();
                })
            },

            starRating: function(element){
                // obtenir puntuacions
                //var puntuacions = $(element.currentTarget).find('input[name="#puntuacions"]').val();
                var codiLlibre = $('#codi_element').val();
                var values = util.getInputsForm('#contingutLlibre');
                var codi = $(element.currentTarget).find('input[name="codi"]').val();
                //var model = llibres.get(codi);
                var puntuacions = $( "input:checked" ).val();

                var values = Object.create({tipus: {values: null}, login: {values: null}, llibre: {values: null}, imatge: {values: null}, codiText: {values: null}, puntuacio: {values: null}});
                values.login = null;
                values.llibre = codiLlibre;
                values.imatge = null;
                values.tipus = 3;
                values.puntuacio = puntuacions;
                values.text = null;
                $.ajax({
                    data: values,
                    type: "PUT",
                    url: "/puntuacions/"+ values.llibre,
                    crossDomain: true,
                    success:
                        function (data) {
                            bean.fire(Event,"puntuacioLlibreOK", data);
                        },
                    error:
                        function (data) {
                            bean.fire(Event, "puntuacioLlibreKO", data);
                        }
                })
            },

            showLlibre: function(element) {
                var el = element.currentTarget;
                var title = $(el).find('#titol').text();
                var codi = $(el).find('input[name=codi]').val();
                $('#titol_element').empty().append(title);
                $('#codi_element').val(codi);
                var index = llibres.get({id:codi}).get('index');
                var elements = index.replace(/:/g,'').split(';');


                for(var i = 0; i< elements.length; i++) {
                    var codificacio = elements[i]
                    $('#text_element').append('<div id="' + codificacio + '"></div>')
                    var tipus = codificacio.charAt(0);
                    var id = codificacio.substring(1);

                    var model;
                    if(tipus == "I") model = new ImatgeModel({codi: id});
                    else model = new TextModel({codi: id});

                    (function(tipus, codificacio, model) {
                        model.fetch().done(function () {
                            if (tipus == "I") {
                                var imatgeM = model.get('imatge');
                                var titol = imatgeM['titol'];
                                var descripcio = imatgeM['descripcio'];
                                var ruta = imatgeM['ruta'];

                                var i = '<p><div class="thumbnail block">' +
                                    '<img src="'+ruta+'" alt="'+titol+'">' +
                                    '<div class="caption text-center">' +
                                    '<h5 class="center-block">'+titol+'</h5>' +
                                    '</div></p>';
                                 $('#' + codificacio).append(i);
                            }
                            else if (tipus == "T") {
                                var textM = model.get('text');
                                var titol = "<h3>" + textM.titol + "</h3>";
                                var text = "<p>" + textM.text + "</p>";
                                $('#' + codificacio).append(titol + "<br>" + text);
                            }

                        })
                    })(tipus, codificacio, model);
                }

                //Carreguem el form de posar comentaris
                var comentari = new ComentariView({el:'#comentaris'});
                comentari.update(3,codi);
                $('#columna1').hide();
                $('#contingutLlibre').show();
                $('.pager').hide();
            },

            render: function () {
                var compiledTemplate = _.template(listPattern, {nomPagina: "Llibres"});
                this.$el.empty().append('<br><br>'+compiledTemplate);

                //Afegim les tematiques
                tematicaView = new TematicaListView({el:'#panellTematica'});
                tematicaView.update();

                //Afegim les tematiques
                var cercaView = new CercadorView({el:'#cercador'});
                cercaView.update();

                //Afegim contingut
                var llibresContingut = new ContingutLlibresView({el:'#contingut'});
                llibresContingut.update(llibres);

                //Events
                $(".more").on("click", this.more);
                $("#close").on("click", this.closeLlibre);
                $('.llibre').on("click", this.showLlibre);
                $('button.more').show();
            },
            closeLlibre: function(){
                $('#columna1').show();
                $('.pager').show();
                $('#contingutLlibre').hide().removeClass('panel panel-default');
                $('#titol_element').empty();
                $('#text_element').empty();
            },
            renderLlibres: function () {
                var llibresContingut = new ContingutLlibresView({el:'#contingut'});
                llibresContingut.update(llibres);
                $("#close").on("click", this.closeLlibre);
                $('.llibre').on("click", this.showLlibre);
                $('button.more').show();
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
                    llibres = elements;
                    that.renderLlibres();
                    if(llibres.length>0) options.page++;
                }
                else {
                    //Resetejem les opcions inicials
                    llibres.fetch({data: $.param(options)}).done(
                        function () {
                            if (llibres.length > 0) options.page++;
                            that.render();
                        }
                    );
                }
            },
            more: function()  {
                tematicaView.more(options,llibres)
                options.page++;
            },
            popup: function (element) {
                var el = element.currentTarget;
                $('.modal-body').empty();
                var title = $(el).find('#titol').text();
                var description = $(el).find('#descripcio').text();
                $('.modal-title').html(title);
                var imatge = $(el).parent().find('.prova').parent().html();
                $(imatge).appendTo('.modal-body');
                $('.modal-body').append("<br>").append(description);
                $('#myModal').modal({show:true});
            }
        }
    }());

    // Our module now returns our view
    return LlibresListView;
});