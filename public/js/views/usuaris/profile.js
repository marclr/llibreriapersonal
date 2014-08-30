/**
 * Created by Marc on 30/04/2014.
 */
//[TODO] Separar en diversos fitxers les vistes de Perfil, Tetxts, Imatges i Llibres
define([
    'jquery',
    'underscore',
    'backbone',
    'bean',
    'models/usuari',
    'collections/imatges',
    'collections/texts',
    'collections/llibres',
    'collections/tematica',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/usuari/profile.html',
    'text!/templates/usuari/dadespersonals.html',
    'text!/templates/usuari/password.html',
    'text!/templates/usuari/myImatges.html',
    'text!/templates/usuari/myTexts.html',
    'text!/templates/usuari/myLlibres.html',
    'text!/templates/usuari/editText.html',
    'text!/templates/usuari/editLlibre.html',
    'text!/templates/usuari/editImatge.html',
    'event'
], function($, _, Backbone, bean, UsuariModel, ImatgeCollection,TextCollection,LlibreCollection,TematicaCollection, profileTemplate, dadesTemplate, passwordTemplate, imatgesTemplate, textsTemplate, llibresTemplate, editText, editLlibre, editImatge, Event) {
    var ProfileView = Backbone.View.extend(function() {

        var user;
        var timer;
        var imatges = new ImatgeCollection();
        var texts = new TextCollection();
        var llibres = new LlibreCollection();

        var options = {
            page: 0,
            limit: 10,
            public: 0,
            esborrat: 0,
            reset: true
        };
        function marcarTematicas (obj) {
            var checkbox = $('input[name=tematica]').toArray().reverse(); //Les mostrem en ordre invers per pantalla [n..1]
            for(var i=0; i<obj.length; i++){
                var tematica = obj[i].TematicaId;
                $(checkbox[tematica-1]).prop('checked',true);
            }
        }

        return {
            events : {
                "click #updateDades": "updateDades",
                "click #updatePassword": "updatePassword",
                "click #saveImatge": "updateImatge",
                "click .delete": "deleteElement",
                "click .update": "updateElement",
                "click .back": "back"
            },

            initialize: function (params) {
                if(localStorage.getItem('usuari') !== null ) user = new UsuariModel(JSON.parse(localStorage.getItem('usuari')));
            },
            logout: function () {
                user = null;
            },
            reloadUser: function () {
                if(localStorage.getItem('usuari') !== null ) user = new UsuariModel(JSON.parse(localStorage.getItem('usuari')));
            },
            deleteElement: function() {
                var codi = $('input[name=codi]').val();
                if($('#editImatge').length!=0) {
                    var codi = $('#editImatge input[name=codi]').val();
                    var imatge = imatges.get(codi);
                    imatges.remove(codi);
                    imatge.destroy();
                    this.renderImatges(); //Forcem la renderitzacio
                } else  if($('#editLlibre').length!=0) {
                    var llibre = llibres.get(codi);
                    llibres.remove(codi);
                    llibre.destroy();
                    this.renderLlibres(); //Forcem la renderitzacio
                } else if($('#editText').length!=0) {
                    var text = texts.get(codi);
                    texts.remove(codi);
                    text.destroy();
                    this.renderTexts(); //Forcem la renderitzacio
                }
            },
            updateElement: function() {
                var codi = $('input[name=codi]').val();
                if ($('#editImatge').length != 0) {
                    var values = this.recollir('#editImatge');
                    values.descripcio = CKEDITOR.instances.descripcio.getData();
                    var that = this;
                    var model = imatges.get(codi);
                    model.save(values).done(function() {
                        that.back();
                        that.peticioImatges();
                    });
                }
                else if($('#editText').length != 0) {
                    var values = this.recollir('#editText');
                    var that = this;
                    var model = texts.get(codi);
                    model.save(values).done(function () {
                        that.back();
                        that.peticioTexts();
                    })
                }
                else if($('#editLlibre').length!=0) {
                    var values = this.recollir('#editLlibre');
                    var that = this;
                    var model = llibres.get(codi);
                    model.save(values).done(function (){
                        that.back();
                        that.peticioLlibres();
                    })
                }
            },
            editImatge: function (element) {
                var codi= $($(element.currentTarget).find('input').get(0)).val();
                var tematiques = new TematicaCollection();
                tematiques.fetch().done(function () {
                    //Amagem la llista de llibres
                    $('#llistaImatges').hide();

                    //Mostrem el panell d'edicio
                    var imatge = imatges.get(codi);
                    var compiledTemplate = _.template(editImatge,{imatge:imatge, tematiques:tematiques});
                    $('#options').append(compiledTemplate);
                    CKEDITOR.replace( "descripcio" );
                    var contingutTematicas = imatge.get('contingutTematicas');
                    marcarTematicas(contingutTematicas);
                })
            },

            editLlibre: function (element) {
                var codi= $($(element.currentTarget).find('input').get(0)).val();

                var tematiques = new TematicaCollection();
                tematiques.fetch().done(function () {
                    //Amagem la llista de llibres
                    $('#llistaLlibres').hide();

                    //Mostrem el panell d'edicio
                    var llibre = llibres.get(codi);
                    var compiledTemplate = _.template(editLlibre,{llibre:llibre, tematiques:tematiques});
                    $('#options').append(compiledTemplate);
                    CKEDITOR.replace( "descripcio" );
                    var contingutTematicas = llibre.get('contingutTematicas');
                    marcarTematicas(contingutTematicas);
                })
            },
            editText: function(element) {

                var codi= $($(element.currentTarget).find('input').get(0)).val();
                var tematiques = new TematicaCollection();
                tematiques.fetch().done(function () {
                    //Amagem la llista de llibres
                    $('#llistaText').hide();

                    //Mostrem el panell d'edicio
                    var text = texts.get(codi);
                    var compiledTemplate = _.template(editText,{text:text, tematiques:tematiques});
                    $('#options').append(compiledTemplate);
                    CKEDITOR.replace( "descripcio" );
                    var contingutTematicas = text.get('contingutTematicas');
                    marcarTematicas(contingutTematicas);
                })
            },
            menu : function (opcio) {
                var o = $('#opcio');
                o.find('.active').attr('class', 'list-group-item');
                var element = o.children().children().get(opcio);
                $(element).attr('class', 'list-group-item active');
            },

            render: function () {
                var mainTemplate = _.template(profileTemplate, {item: user});
                var opcioTriada = _.template(dadesTemplate, {item: user});
                this.$el.empty().append('<br><br>'+mainTemplate);
                $('#opcioTriada').append(opcioTriada);
                this.menu(0);
                this.delegateEvents();
            },

            renderPassword: function () {
                // Using Underscore we can compile our template with data
                var mainTemplate = _.template(profileTemplate, {item: user});
                var opcioTriada = _.template(passwordTemplate,{});
                // Append our compiled template to this Views "el"
                this.$el.empty().append('<br><br>'+mainTemplate);
                $('#opcioTriada').append(opcioTriada);
                this.menu(1);
                this.delegateEvents();
            },

            renderTexts: function () {
                var mainTemplate = _.template(profileTemplate, {item: user});
                var opcioTriada = _.template(textsTemplate,{items: texts});
                this.$el.empty().append('<br><br>'+mainTemplate);
                $('#opcioTriada').append(opcioTriada);
                this.menu(2);
                this.delegateEvents();
                $('.text').on("click",this.editText);
            },

            renderImatges: function () {
                var mainTemplate = _.template(profileTemplate, {item: user});
                var opcioTriada = _.template(imatgesTemplate, {items: imatges});
                this.$el.empty().append('<br><br>'+mainTemplate);
                $('#opcioTriada').append(opcioTriada);
                this.menu(3);
                this.delegateEvents();
                $('.imatge').on("click",this.editImatge);
            },

            renderLlibres: function () {
                var mainTemplate = _.template(profileTemplate, {item: user});
                var opcioTriada = _.template(llibresTemplate,{items: llibres});
                this.$el.empty().append('<br><br>'+mainTemplate);
                $('#opcioTriada').append(opcioTriada)
                this.menu(4);
                this.delegateEvents();
                $('.llibre').on("click",this.editLlibre);
            },

            update: function (options) {
                if (user) {
                    if (options == "texts") this.peticioTexts();
                    else if (options == "imatges") this.peticioImatges();
                    else if (options == "llibres") this.peticioLlibres();
                    else if (options == "password") this.renderPassword();
                    else this.render(); //cas per defecte, informacio generalç
                }
            },
            updateDades: function() {
                //recollim les dades personals
                var values = this.getInputsForm('#panelDades');
                //values.id=user.get('login');
                //Actualitzem
                user.update(values).done(function (data) {
                    bean.fire(Event, 'updateOK',data);
                }).fail(function (data) {
                    bean.fire(Event, 'updateKO', data);
                });
            },
            updatePassword: function() {//[TODO] Falta la part servidor, nova funcio?
                window.clearTimeout(timer);
                var id = '#panelPassword';
                var comprovacions = this.validInputsPassword(id,{password:4,passwordNew:4,passwordNewRep:4});
                if(Object.keys(comprovacions).length==0 || true) {//no errors
                    var values = this.getInputsForm(id);
                    values.contrassenya = true;
                    values.login = user.get('login');
                    $.ajax({
                        data: values,
                        type: "PUT",
                        url: "/usuaris/"+values.login,
                        success:
                            function (data) {
                                bean.fire(Event,"passwordOK", data);
                            },
                        error:
                            function (data) {
                                bean.fire(Event, "passwordKO", data);
                            }
                    })
                }
                else {
                    var msg = "";
                    for(var attr in comprovacions) {
                        if(comprovacions.hasOwnProperty(attr)) {
                            msg+=comprovacions[attr]+"<br>";
                        }
                    }
                    var id = $('#resultat');
                    $(id).empty().append(msg).addClass('missatge-error');
                    timer = setTimeout(function() {
                        $(id).removeClass('missatge-error').empty();
                    }, 5000)
                }
            },
            peticioImatges: function() {
                var that = this;
                $.ajax({
                    url:"usuaris/"+user.get('login')+'/imatges',
                    success:function(data) {
                        imatges = new ImatgeCollection();
                        for(var i = 0; i<data.length; i++) imatges.add(data[i]);
                        that.renderImatges();
                    },
                    error:function(data) {
                        var mainTemplate = _.template(profileTemplate, {item: user});
                        that.$el.empty().append('<br><br>'+mainTemplate);
                        $('#opcioTriada').append(data.responseText).addClass('missatge-error')
                        that.menu(3);
                        texts.reset();
                    }
                })
            },
            peticioTexts: function() {
                var that = this;
                $.ajax({
                    url:"usuaris/"+user.get('login')+'/texts',
                    success:function(data) {
                        texts = new TextCollection();
                        for(var i = 0; i<data.length; i++) texts.add(data[i]);
                        that.renderTexts();
                    },
                    error:function(data) {
                        var mainTemplate = _.template(profileTemplate, {item: user});
                        that.$el.empty().append('<br><br>'+mainTemplate);
                        $('#opcioTriada').append(data.responseText).addClass('missatge-error')
                        that.menu(2);
                        texts.reset();
                    }
                })
            },
            peticioLlibres: function() {
                var that = this;
                $.ajax({
                    url:"usuaris/"+user.get('login')+'/llibres',
                    success:function(data) {
                        llibres = new LlibreCollection();
                        for(var i = 0; i<data.length; i++) llibres.add(data[i]);
                        that.renderLlibres();
                    },
                    error:function(data) {
                        var mainTemplate = _.template(profileTemplate, {item: user});
                        that.$el.empty().append('<br><br>'+mainTemplate);
                        $('#opcioTriada').append(data.responseText).addClass('missatge-error')
                        that.menu(4);
                        llibres.reset();
                    }
                })
            },
            recollir: function(id) {
                var values = this.getInputsForm(id);
                var boxes = $('input[name=tematica]:checked');
                var tematica = [];
                $(boxes).each(function(){
                    tematica.push(this.value);
                });
                values.tematica = tematica.join(",");
                return values;
            },
            getInputsForm: function (id) {
                // get all the inputs into an array.
                var $inputs = $(id+' :input');

                // not sure if you wanted this, but I thought I'd add it.
                // get an associative array of just the values.
                var values = {};
                $inputs.each(function() {
                    values[this.name] = $(this).val();
                });
                return values;
            },
            validInputsPassword: function(id, camps) {
                var resposta = {};
                // get all the inputs into an array.
                var $inputs = $(id+' :input');

                $inputs.each(function() {
                    if(camps.hasOwnProperty(this.name)) {
                        var valor = camps[this.name];//agafem el valor
                        if(!isNaN(valor)) {
                            if($(this).val().length<valor) {
                                resposta[this.name] = "El camp " + this.name + " ha de ser superior a " + valor + " caràcters";
                                //Canvis d'estil per mantenir la cooncordança vista - text
                                resposta[this.name] = resposta[this.name].replace("passwordNewRep", "Confirma la nova contrassenya");
                                resposta[this.name] = resposta[this.name].replace("passwordNew", "Contrassenya nova");
                                resposta[this.name] = resposta[this.name].replace("password", "Contrassenya");
                            }
                        }
                    }
                });
                var passN= $(id+' :input[name=passwordNew]').val();
                var passR= $(id+' :input[name=passwordNewRep]').val();
                if(passN !== passR) resposta['match'] = "La nova contrassenya no coincideix en els dos camps";
                return resposta;
            },
            back: function() {
                if($('#llistaImatges').length!=0) {
                    //Tornem a posasr la vista per defecte
                    $('#options').empty();
                    $('#llistaImatges').show();
                    $('.pager.center-block').show();
                }
                else if($('#llistaLlibres').length!=0) {
                    $('#options').empty();
                    $('#llistaLlibres').show();
                }
                else if($('#llistaText').length!=0) {
                    $('#options').empty();
                    $('#llistaText').show();
                }
            }
        }
    }());

    // Our module now returns our view
    return ProfileView;
});