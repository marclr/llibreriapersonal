/**
 * Created by Marc on 16/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'bean',
    'collections/imatges',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/general/listPattern.html',
    'text!/templates/imatge/list.html',
    'views/tematica/list',
    'views/imatges/contingut',
    'views/general/cercador',
    'views/general/comentari',
    'util'
], function($, _, Backbone, bean, ImatgeCollection, listPattern, imatgeListTemplate, TematicaListView, ContingutImatgeView, CercadorView, ComentariView,util) {

    var ImatgeListView = Backbone.View.extend(function() {

        var imatges = new ImatgeCollection();
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
                'click #myModal .rating': "starRating"
                //'click .imatge' : 'popup' //Definit dins del render
            },

            initialize: function (params) {
                var that = this;
                imatges.on('reset', function () {
                    that.update();
                })
            },

            starRating: function(element){
                // obtenir puntuacions
                //var puntuacions = $(element.currentTarget).find('input[name="#puntuacions"]').val();
                var codiImatge = $('#codi_element').val();
                var values = util.getInputsForm('#myModal');
                var codi = $(element.currentTarget).find('input[name="codi"]').val();
                //var model = texts.get(codi);
                var puntuacions = $( "input:checked" ).val();

                var values = Object.create({tipus: {values: null}, login: {values: null}, llibre: {values: null}, imatge: {values: null}, codiText: {values: null}, puntuacio: {values: null}});
                values.login = null;
                values.llibre = null;
                values.imatge = codiImatge;
                values.tipus = 2;
                values.puntuacio = puntuacions;
                values.text = null;
                $.ajax({
                    data: values,
                    type: "PUT",
                    url: "/puntuacions/"+ values.imatge,
                    success:
                        function (data) {
                            bean.fire(Event,"puntuacioImatgeOK", data);
                        },
                    error:
                        function (data) {
                            bean.fire(Event, "puntuacioImatgeKO", data);
                        }
                })
            },
            render: function () {
                var compiledTemplate = _.template(listPattern, {nomPagina: "Imatges"});
                this.$el.empty().append('<br><br>'+compiledTemplate);

                //Afegim les tematiques
                tematicaView = new TematicaListView({el:'#panellTematica'});
                tematicaView.update();

                //Afegim les tematiques
                var cercaView = new CercadorView({el:'#cercador'});
                cercaView.update();

                //Afegim contingut
                 var imatgesContingut = new ContingutImatgeView({el:'#contingut'});
                imatgesContingut.update(imatges);

                //Events
                $(".more").on("click", this.more);
                $('button.more').show();
                $('.imatge').on("click", this.popup);
            },

            renderImatges: function () {
                var imatgesContingut = new ContingutImatgeView({el:'#contingut'});
                imatgesContingut.update(imatges);
                $('button.more').show();
                $('.imatge').on("click", this.popup);
            },

            popup: function (element) {
                var el = element.currentTarget;
                var codi = $(el).next().val();
                $('.modal-body').empty();
                var title = $(el).parent('a').attr("title");
                var description = $(el).parent('a').attr("alt");
                $('.modal-title').html(title);
                $('#codi_element').val(codi);
                $($(el).parents('div').html()).appendTo('.modal-body');
                $('.modal-body').append(description);
                $($('.modal-body').find('img').get(0)).removeClass('llistaImatges').removeClass('imatge')
                $('#myModal').modal({show:true});

                //Carreguem el form de posar comentaris
                var comentari = new ComentariView({el:'#comentaris'});
                comentari.update(2,codi);
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
                //Si estem posan elements d'una nova tematica resetejem opcions
                if(nou) { this.inicialitzarOptions();  }
                var that = this;
                if(elements) {
                    imatges = elements;
                    that.renderImatges();
                    if(imatges.length>0) options.page++;
                }
                else {
                    //Resetejem les opcions inicials
                    imatges.fetch({data: $.param(options)}).done(
                        function () {
                            if (imatges.length > 0) options.page++;
                            that.render();
                        }
                    );
                }
            },
            more: function()  {
            /*[TODO] Preguntar com controlar el cas en que no tens res mes a mostrar, la tematicaView
            no pot retornar res, i tampoc intertesa crear una nova vista en les sublcasses, fer un match d'abans i després
            en cas que tot doni igual no augmentar la pagina...*/
                tematicaView.more(options,imatges);
                options.page++;
            },
            carregarMesElements : function () {
              imatges.fetch({data: $.param( options )}).done(
                  function(){
                      if(imatges.length>0) options.page++;
                      bean.fire(Event, "mesPagines", {elements:imatges, el:this.el});
                  }
              );
        }
      }
    }());
    // Our module now returns our view
    return ImatgeListView;
});