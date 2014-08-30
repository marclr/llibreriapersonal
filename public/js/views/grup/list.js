/**
 * Created by Rachid on 18/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'bean',
    'ckeditor',
    'models/usuari',
    'models/text',
    'collections/tematica',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/grup/list.html',
    'text!/templates/grup/crearSala.html',
    'text!/templates/grup/escollirSala.html',
    'text!/templates/editor/editor.html',
    'text!/templates/grup/xat.html',
    'event',
    'edicioCompartida',
    'util'
], function($, _, Backbone, bean, ckeditor, UsuariModel, TextModel, TematicaCollection, editorListTemplate, crearSala, escollirSala, editorTemplate, xatTemplate,event, edicioCompartida, util) {
    var GrupListView = Backbone.View.extend(function() {
        var socket = event.obtenirSocket();
        var tematica = new TematicaCollection();
        var user = false;

        function getNicknameFromUser() {
            if(localStorage.getItem('usuari') !== null ){
                var user = new UsuariModel(JSON.parse(localStorage.getItem('usuari')));
                return user.get('login');
            }
        }

        function saveNickname(nick) {
            localStorage.setItem('nick',nick);
        }

        function getNickname() {
            if(localStorage.getItem('nick') !== null )
                return localStorage.getItem('nick');
        }

        return {
            events: {
                'click .grup':'canviarOpcio',
                'click #crearSala':'crearSala',
                'click .unir':'unirSala'
            },

            initialize: function (params) {
                if(localStorage.getItem('usuari') !== null )user = true;
                var that = this;
                socket.on('createSuccess', function(nom, isCreator) {
                    that.renderEditor(nom, isCreator);
                })
                //Definim l'event de nouAdmin
                socket.on('newOwner', function() {
                    $('.panell-butons').append('<input type="button" id="guardarText" class ="btn btn-success" value="Guardar text">')
                        .append('<input type="button" class="btn btn-danger" id="leaveGroup" value="Sortir de la sala"/>');
                    $('#guardarText').on('click',that.saveText);
                    $('#leaveGroup').on('click', function() {
                        that.notifyExit();
                        that.render();
                    });
                });
            },

            unirSala: function(element) {
                var el = $(element.currentTarget);
                var sala = $(el.find('input').get(0)).val();
                socket.emit('create',sala,getNickname());
                //Al acabar s'executa un callback, createSuccess, localitzat a crearSala
            },

            crearSala: function() {
                var sala = $('#nomSala').val();
                socket.emit('create', sala, getNickname());
                //Al acabar s'executa un callback, createSuccess, localitzat a crearSala
            },

            renderSalesActives:function() {
                var that = this;
                if($('#xat').length>0) $('#xat').empty();
                socket.emit('getRooms');
                socket.on('rooms', function(data) {
                    var compiledTemplate = _.template(escollirSala,{sales:JSON.parse(data)});
                    $('#contingut').empty().append(compiledTemplate);
                })
            },

            renderEditor: function(nom, isCreator) {
                var that = this;
                tematica.fetch().success(function() {
                    var compiledTemplate = _.template(editorTemplate,{tematiques:tematica});
                    $('#contingut').empty().append('<h3>Sala: '+nom+'</h3>'+compiledTemplate);
                    $('#crearText').removeClass('col-sm-10');
                    $('.panell-butons').append('<input type="button" class="btn btn-danger" id="leaveGroup" value="Sortir de la sala"/>');

                    $('#guardarText').on('click',that.saveText);
                    $('#leaveGroup').on('click', function() {
                        that.notifyExit();
                        that.render();
                    });
                    /*Aquestes dues linies es troben dins del fitxer edicioCompartida, sino no es podia cerar l'event de canvi
                    var config = { extraPlugins: 'onchange'};
                    CKEDITOR.replace('editor1', config);*/
                    var compiledTemplate = _.template(xatTemplate);
                    $('#xat').empty().append(compiledTemplate);

                    $('#panell').find('a').removeClass('active');
                    edicioCompartida.initialize(isCreator);

                });
            },

            notifyExit:function () {
                socket.emit('exit');
            },

            saveText: function() {
                var values = util.recollir('#crearText');
                values.text = CKEDITOR.instances.editor1.getData();
                var aux = util.checkValues(values);
                if(Object.keys(aux).length) {
                    util.showErrors(this.$el,aux);
                }
                else {
                    util.removeErrors();
                    var text = new TextModel();
                    text.update(values).done(function (data) {
                        bean.fire(Event, 'createOK', data);
                    }).fail(function (data) {
                        bean.fire(Event, 'createKO', data);
                    });
                }
            },

            render: function (opcio) {
                var compiledTemplate = _.template(editorListTemplate, {nomPagina:"Redacció en grup"});
                this.$el.empty().append('<br><br>'+compiledTemplate);
                var compiledTemplate = _.template(crearSala,{});
                $('#contingut').empty().append(compiledTemplate);
            },

            canviarOpcio: function(element) {
                var opcio = $($(element.currentTarget).find('input').get(0)).val();
                var menu =  $('#panell').find('a');
                menu.removeClass('active');
                $(menu.get(opcio)).addClass('active');
                this.update(opcio);
            },

            update: function (opcio) {
                if(localStorage.getItem('usuari') !== null ) user = true;
                if(user) {
                    saveNickname(getNicknameFromUser());
                    this.notifyExit();
                    if (opcio == 1) this.renderSalesActives();
                    else this.render();//opcio per defecte, crear nova sala
                }
            }

        }
    }());

    // Our module now returns our view
    return GrupListView;
});
