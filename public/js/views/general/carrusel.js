/**
 * Created by Marc on 16/04/2014.
 */
/**
 * Created by Marc on 16/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'bean',
    'jquery.bootstrap',
    'models/usuari',
    'collections/texts',
    'collections/imatges',
    'collections/llibres',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/general/carrusel.html',
    'event',
    'util'
], function($, _, Backbone, bean, Bootstrap, UsuariModel, TextCollection, ImatgeCollection, LlibreCollection, carruselListTemplate, Event, util) {
    var ProjectListView = Backbone.View.extend(function() {
        var texts = new TextCollection();
        var imatges = new ImatgeCollection();
        var llibres = new LlibreCollection();

        return {
            events : {
                "click #signin": "registrar"
            },
            initialize: function (params) {
                var that = this;
            },

            render: function () {
                // Using Underscore we can compile our template with data
                var compiledTemplate = _.template(carruselListTemplate, {textItems: texts, imatgeItems: imatges, llibreItems: llibres});
                // Append our compiled template to this Views "el"
                this.$el.empty().append('<br><br>'+compiledTemplate);
            },

            update: function (options) {
                var op = {limit:2} || {reset: true}
                var that = this;
                texts.fetch(op).done(function(){
                    imatges.fetch(op).done(function(){
                        llibres.fetch(op).done(function(){
                            that.render();
                            if(localStorage.usuari) {
                                bean.fire(Event, 'registrarOK');
                            }
                        })
                    })
                });
            },
            validInputs: function(id, camps) {
                var resposta = {};
                // get all the inputs into an array.
                var $inputs = $(id+' :input');

                $inputs.each(function() {
                    if(camps.hasOwnProperty(this.name)) {
                        var valor = camps[this.name];//agafem el valor
                        if(!isNaN(valor)) {
                            if($(this).val().length<valor) {
                                resposta[this.name] = "El camp " + this.name + " ha de ser superior a " + valor + " caràcters.";
                                //Canvis d'estil per mantenir la cooncordança vista - text
                                resposta[this.name] = resposta[this.name].replace("login", "Usuari");
                                resposta[this.name] = resposta[this.name].replace("password", "Contrassenya");
                            }
                        }
                        else if(valor == "email") {
                            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if(!re.test($(this).val())) {
                                resposta[this.name] = "El camp " + this.name + " no és una adreça vàlida.";
                                //Canvis d'estil per mantenir la cooncordança vista - text
                                resposta[this.name] = resposta[this.name].replace("email", "Correu electrònic");
                            }
                        }
                    }
                });
                return resposta;
            },
            showErrors: function(id, msg) {
                var text = "";
                var fieldShowErrors = $('#errors');
                for(var key in msg) {
                    text+= '<strong class="missatge-error">'+msg[key]+'</strong>';
                }
                text+='<br>';

                if(fieldShowErrors.length==0) {
                    $(id).prepend('<div id="errors">'+text+'</div>');
                }
                else fieldShowErrors.empty().append(text);
            },
            registrar: function () {
                var id = '#registrar';
                //Comprovem les mides dels camps
                var comprovacions = this.validInputs(id, {login:4,password:4,email:"email"} )//Passem l'id a comprovar i un objecte amb els camps on hi ha la mida minima
                if(Object.keys(comprovacions).length==0) {//no errors
                    //Llegir els valors de la vista
                    var values = util.getInputsForm(id);
                    $.ajax({
                        data : values,
                        type: "POST",
                        url:"/registrar",
                        success:function(data) {
                            bean.fire(Event, 'registrarOK');
                        },
                        error:function(data) {
                            bean.fire(Event, 'registrarKO',data);
                        }
                    })
                }
                else { //mostrar errors
                    this.showErrors(id,comprovacions);
                }
            }
        }
    }());

    // Our module now returns our view
    return ProjectListView;
});