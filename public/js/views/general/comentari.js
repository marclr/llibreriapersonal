/**
 * Created by Marc on 05/06/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'bean',
    'models/text',
    'models/comentari',
    'collections/comentaris',
    'text!/templates/general/comentari.html',
    'event'
], function($, _, Backbone, bean, TextModel, ComentariModel, ComentariCollection, comentariTemplate, Event) {
    var ComentariView = Backbone.View.extend(function() {

        var timer;
        var tipus;
        var id;
        var comentaris = new ComentariCollection();
        return {
            events: {
                'click .btn-comentari':"showComentari",
                'click #shareButton':"addComentari"
            },

            render: function () {
                var compiledTemplate = _.template(comentariTemplate, {comentaris:comentaris});
                this.$el.empty().append(compiledTemplate);
            },

            update: function (t,codi) {
                tipus = t;
                id = codi;
                var that = this;
                var comentari = new ComentariModel({codi:codi,tipus:tipus});
                comentaris.reset();
                comentari.fetch().done(
                    function(retorn) {
                        for(var i=0;i<retorn.length;i++) comentaris.add(new ComentariModel(retorn[i]));
                        that.render();
                    }
                );
            },
            showComentari: function(el) {
                $(el.currentTarget).hide();
                $('#textareaWrap').show();
            },
            addComentari: function() {
                var element = $('.missatge-error'); //Cache del div amb els errors
                element.empty(); //Podem borrar el missatge d'error que hi hagi
                window.clearTimeout(timer);//i eliminem el timer, ja nno cal
                var text = $('#wall').val();
                //Cas en que no hi hagi contingut en el text, comprovacio part client
                if(text.length==0)  {
                    element.empty().append("El comentari ha de tenir text");
                    timer = setTimeout(function() {
                        element.empty();
                    }, 5000);
                }
                else { //Tot va be, podem guardar-ho a la bdb
                    $('#wall').val('');
                    var values = {
                        text:text,
                        tipus:tipus,
                        idElement:id
                    };
                    var comentari = new ComentariModel();
                    comentari.save(values).done(
                        function(c) {
                            var d = new Date(c.createdAt) ;
                            $('.llistaComentaris').prepend('' +
                                '<div class="comentari">' +
                                '   <b>'+ c.UsuariId+'</b>' +
                                '   <div class="pull-right">'+ d.toUTCString()+'</div>' +
                                '   <br>' + c.text +
                                '</div>' +
                                '<hr>');

                            $('.btn-comentari').show();
                            $('#textareaWrap').hide();
                        }
                    );
                }
            }

        }
    }());

    // Our module now returns our view
    return ComentariView;
});