define('ui',
    [
        'jquery',
        'backbone',
        'jquery.bootstrap',
        'bean',
        'ckeditor',
        'models/usuari',
        'collections/texts',
        'collections/imatges',
        'collections/llibres',
        'collections/tematica',

        'views/llibres/list',
        'views/imatges/list',
        'views/general/carrusel',
        'views/usuaris/profile',
        'views/texts/list',
        'views/editor/list',
        'views/tematica/list',
        'views/grup/list',

        'text!/templates/usuari/editImatge.html',
        'event'
    ], function($, Backbone, Bootstrap, bean, ckeditor,
                UsuariModel,
                TextCollection, ImatgeCollection, LlibreCollection, TematicaCollection,
                llibresListView, imatgesListView, carruselView, userView, textsListView, editorListView, tematicaListView, grupView,
                editImatge,
                Event) {

        var Ui = {};
        var $el = $('#page');

        var llibresView = new llibresListView({el: $el});
        var textsView = new textsListView({el: $el});
        var editorView = new editorListView({el: $el});
        var imatgesView = new imatgesListView({el: $el});
        var carruselView = new carruselView({el: $el});
        var userView = new userView({el: $el});
        var grupView2 = new grupView({el: $el});

        Ui.initialize = function() {
        };

        Ui.clean = function () {
            $el.empty();
        };

        Ui.desmarcar= function () {
            $('#general').find('.active').attr('class','');
        };

        Ui.marcar = function (ref) {
            $('#general').find('a[href="#'+ref+'"]').parent().attr('class','active');
        }

        Ui.showInici = function() {/** Funcio executada al inici */
            Ui.clean();
            Ui.desmarcar();
            Ui.marcar("inici");
            carruselView.update({query : {limit:2}})
        };

        Ui.showLlibres = function() {
            Ui.clean();
            Ui.desmarcar();
            Ui.marcar("llibres");
            llibresView.update(true);
        };

        Ui.showTexts = function() {
            Ui.clean();
            Ui.desmarcar();
            Ui.marcar("texts");
            textsView.update(true);
        };


        Ui.showEditor = function() {
            Ui.clean();
            Ui.desmarcar();
            Ui.marcar("editor");
           editorView.update()
        };

        Ui.showImatges = function() {
            Ui.clean();
            Ui.desmarcar();
            Ui.marcar("imatges");
            imatgesView.update(true);
        }


        Ui.showGrup = function() {
            Ui.clean();
            Ui.desmarcar();
            Ui.marcar("grup");
            grupView2.update();
        };

        Ui.userProfile = function(element) {
            Ui.clean();
            Ui.desmarcar();
            Ui.marcar("usuari/perfil");
            userView.update(element);
        }

        //Events UI
        // S'utilitza la llibreria bean, permet generar events, amb els mètodes bean.fire i bean.on, s'actua sobre un objecte global
        // estructura: Objecte, Nom de l'event, Funcio

        //Events de views/general/carrusel.js: Events disparats en cas que el registre funcioni bé o no:
        /*
            Event que elimina el formulari i mostra un text de benvinguda
             @param data - no utilitzat
         */
        bean.on(Event, "registrarOK", function(data) {
            $('#registrat').empty().append("Benvingut");
        })

        /*
            Event que es dispara en cas que el registre hagi tingut algun error, es mostren els errors a sobre del formulari
            @param data disposa dels errors formatejats en HTML
         */
        bean.on(Event, "registrarKO", function(data) {
            var msg = '<strong class="missatge-error">'+data.responseText+'</strong>';
            var fieldShowErrors = $('#errors');
            if(fieldShowErrors.length==0) {
                $('#registrar').prepend('<div id="errors">'+msg+'</div>');
            }
            else fieldShowErrors.empty().append(msg);
        })

        //Events disparats en cas que el login funcioni bé o no
        /*
            Event que es dispara en cas que el login funcioni correctament, s'encarrega d'amagar el formulari de registre
            i amagar el formulari del login, reemplaçant el contingut per l'accés al perfil.
            També afegim les dades de l'usuari al localStorage
         */
        bean.on(Event, "loginOK", function(data) {
            var panell_usuari = $('#panell_usuari');
            var grup = $('#general ul.nav.navbar-nav');

            //Amagem el formulari de login i canviem el contingut
            $('#loginform').empty();

            if(panell_usuari.length==0) {
                $('#loginform').parent().append('<ul class="nav navbar-nav navbar-right" id="panell_usuari">' +
                    '<li><a href="#usuari/perfil">Perfil</a></li>' +
                    '<li><a href="" id="sortir">Sortir</a></li>' +
                    '</ul>');
                grup.append('<li><a href="#grup">Crea contingut en grup</a></li>')
            }
            else {
                panell_usuari.append('<li><a href="#usuari/perfil">Perfil</a></li>' +
                    '<li><a href="" id="sortir">Sortir</a></li>')
                grup.not(":last").remove();
            }

            //Al estar loguejats ja no ens cal registrar-nos
            $('#registrat').empty().append("Benvingut");

            //Reemplacem les dades del localStorage
           if(!data['localStorage']) {
               localStorage.setItem('usuari',JSON.stringify(data));
               userView.reloadUser();
           }
        })

        /*
         Event que es dispara en cas que el login no s'efectui, es a dir tenim un error al fer el login
         */
        var timer;
        bean.on(Event, "loginKO", function(data) {
            window.clearTimeout(timer);
            var msg = data.responseText;
            var element = $('#loginError');
            element.empty().append(msg);
            //Donem 5 segons per veure l'error, cal eliminar el text, sino desquadrem
            timer = setTimeout(function() {
                element.empty();
            }, 5000);
        })

        /*
            Event que es dispara quan fas el logout
         */
        bean.on(Event, "logoutOK", function(data) {
            //Tornem a mostrar el formulari de login
            $('#panell_usuari').empty();
            $('#loginform').append('<div class="form-group">' +
                    '<input type="text" placeholder="Usuari" name="login" class="form-control">' +
                '                 </div>' +
                '<div class="form-group">'+
                '       <input type="password" placeholder="Contrassenya" name="password" class="form-control">'+
                '      </div>'+
                '     <button id="login" class="btn btn-success">Log in</button>');
            userView.logout();
            //Mostrem el formulari de registrar-se
            $('#registrat').empty().append('<h3>Apunta\'t</h3>' +
                            '<form id="registrar">' +
                            '     <div class="form-group">' +
                            '     <input type="text" class="form-control" name="login" placeholder="Usuari">' +
                            '       <input type="text" class="form-control" name="password" placeholder="Contrassenya">' +
                            '       <input type="text" class="form-control" name="email" placeholder="Correu electrònic">' +
                            '  </div>' +
                            '</form>' +
                            '<button id = "signin" class="btn btn-success">Sign in</button>');
        })

        //Events de views/general/profile.js
        /*
            Event que es dis
         */
        bean.on(Event, "updateOK", function(data) {
            localStorage.setItem('usuari',JSON.stringify(data));
            userView.update("perfil");
            var id = $('#resultat');
            id.append("<br>S'ha actualitzat correctament");
            id.addClass("missatge-success")
            timer = setTimeout(function() {
                id.removeClass("missatge-success").empty();
            }, 5000);
        })

        bean.on(Event, "updateKO", function(data) {
            var id = $('#resultat');
            var msg = data.responseText;
            id.append(msg);
            id.addClass("missatge-error")
            timer = setTimeout(function() {
                id.removeClass("missatge-error").empty();
            }, 5000);
        })

        bean.on(Event, "passwordOK", function(data) {
            window.clearTimeout(timer);
            var id = $('#resultat');
            id.empty().append("S'ha actualitzat correctament").addClass("missatge-success")
            timer = setTimeout(function() {
                id.removeClass("missatge-success").empty();
            }, 5000);
        })

        bean.on(Event, "passwordKO", function(data) {
            window.clearTimeout(timer);
            var id = $('#resultat');
            var msg = data.responseText;
            id.empty().append(msg).addClass("missatge-error")
            timer = setTimeout(function() {
                id.removeClass("missatge-error").empty();
            }, 5000);
        })


        bean.on(Event, "canviarTematica",function(codiTematica) {
            //Com que fem un canvi de tematica definim les opcions predeterminades
            var options = {
                page: 0,
                limit: 5,
                public: 1,
                esborrat: 0,
                reset: true
            };
            //Determinem el tipus de l'element
            var tipus = $('#general').find('.active').text().toLowerCase();
            // i el creem
            var elements, t;
            if(tipus=="texts"){ elements = new TextCollection();t=1;}
            else if (tipus=="imatges"){ elements = new ImatgeCollection();t=2;}
            else if(tipus=="llibres"){ elements = new LlibreCollection();t=3;}

            //a continuació realitzem una acció en funció de si es tracta de totes les tematiques o una en concreta
            // en ambods casos es realitzen les mateixes accions
            if(codiTematica==-1) {
                $.ajax({
                    url: tipus,
                    data: options,
                    success: function (data) {
                        for (var i = 0; i < data.length; i++)
                            elements.add(data[i]);
                        if(t==1)textsView.update(true,elements);
                        else if(t==2)imatgesView.update(true,elements);
                        else if(t==3)llibresView.update(true,elements);
                    },
                    fail: function (data) {
                    }
                })
            }
            else {
                $.ajax({
                    url: "tematica/" + codiTematica + '/' + tipus,
                    data:options,
                    success: function (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (t == 1)elements.add(data[i].text);
                            else if (t == 2)elements.add(data[i].imatge);
                            else if (t == 3)elements.add(data[i].llibre);
                        }
                        if(t==1)textsView.update(true,elements);
                        else if(t==2)imatgesView.update(true,elements);
                        else if(t==3)llibresView.update(true,elements);
                    },
                    fail: function (data) {
                    }
                })
            }

        })


        bean.on(Event, "resultatCercaOK", function (obj) {
            //Determinem el tipus d'element que estem cercant
            var tipus = obj.tipus;
            var elements;
            // i l'inicialitzem
            if (tipus == "texts") {
                elements = new TextCollection();
            }
            else if (tipus == "imatges") {
                elements = new ImatgeCollection();
            }
            else if (tipus == "llibres") {
                elements = new LlibreCollection();
            }

            //Recollim els elements de l'objecte
            var data = obj.data;
            for (var i = 0; i < data.length; i++) {
                elements.add(data[i]);
            }

            //i els mostrem elements
            if (tipus == "texts") {
                textsView.update(true, elements);
            }
            else if (tipus == "imatges") {
                imatgesView.update(true, elements);
            }
            else if (tipus == "llibres") {
                llibresView.update(true, elements);
            }

            //Detalls cosmètics
            $('#contingut').prepend("<h4>Resultat de la cerca:</h4>");
            $('#panellTematica').find('.active').attr('class', 'list-group-item tematica');
            $('button.more').hide();
        })

        bean.on(Event, "mesPagines", function (obj) {
            var html="";
            var elements = obj.elements;
            var tag = obj.el;
            var tipus = obj.tipus;
            var coleccio = obj.coleccio;
            for(var i=0;i<elements.length;i++) {
                var item = elements.at(i);
                if(tipus=="texts") {
                    html = '<div class="panel panel-default">'+
                                '<div class="panel-body text">'+
                                    '<strong>Titol: </strong><input type="hidden" value="'+item.get('codi')+'" name="codi">'+item.get('titol')+
                                    '<div class="form">'+
                                    '   <div class="rating">'+
                                    '       <input name="puntuacio" value="0" checked="" type="radio"><span class="hide"></span>'+
                                    '       <input name="puntuacio" value="1" type="radio"><span></span>'+
                                    '       <input name="puntuacio" value="2" type="radio"><span></span>'+
                                    '       <input name="puntuacio" value="3" type="radio"><span></span>'+
                                    '       <input name="puntuacio" value="4" type="radio"><span></span>'+
                                    '       <input name="puntuacio" value="5" type="radio"><span></span>'+
                                    '   </div>'+
                                    '</div>'+
                                    '<br>'+
                                    '<strong>Descripció: </strong>'+item.get('descripcio')+
                                '</div>'+
                            '</div>';
                    coleccio.add(item);
                }
                else if(tipus=="imatges") {
                    html = '<div class="col-lg-3 col-sm-4 col-xs-6">' +
                        '<a title="' + item.get('titol') + '" alt="' + item.get('descripcio') + '">' +
                        '<img class="thumbnail img-responsive llistaImatges imatge" src="' + item.get('ruta') + '">' +
                        '<input type="hidden" value="'+item.get('codi')+'">'+
                        '</a>' +
                        '</div>';
                    coleccio.add(item);
                }
                else if(tipus=="llibres") {
                    html = '<div class="panel panel-default">'+
                                '<div class="panel-body llibre">'+
                                '   <div class="col-sm-3">'+
                                '        <img src="'+item.get('ruta')+'" alt="'+ item.get('titol')+'">'+
                                '   </div>'+
                                '   <div>'+
                                '       <input type="hidden" value="'+item.get('codi')+'" name="codi">'+
                                '    <strong>Titol: </strong><div id="titol">'+item.get('titol')+
                                '   </div>'+
                                '<div class="form">'+
                                '   <div class="rating">'+
                                '       <input name="puntuacio" value="0" checked="" type="radio"><span class="hide"></span>'+
                                '       <input name="puntuacio" value="1" type="radio"><span></span>'+
                                '       <input name="puntuacio" value="2" type="radio"><span></span>'+
                                '       <input name="puntuacio" value="3" type="radio"><span></span>'+
                                '       <input name="puntuacio" value="4" type="radio"><span></span>'+
                                '       <input name="puntuacio" value="5" type="radio"><span></span>'+
                                '   </div>'+
                                '</div>'+
                                '<br>'+
                                '<strong>Autor: </strong><div id="autor">'+ item.get('UsuariId')+'</div>'+
                                '<br>'+
                                '<strong>Argument: </strong><div id="descripcio">'+ item.get('descripcio')+'</div>'+
                                '</div>'+
                            '</div>';
                    coleccio.add(item);
                }
                $(tag).append(html);
            }
        })

        //Events editor text
        bean.on(Event, "createOK", function(data) {
            $($('#panell').find('.active').get(0)).removeClass('active');
            $('#crearText').empty().append('<strong class="missatge-success">El text s\'ha creat correctament. ' +
                'Pots editar les seves característiques des del perfil.</strong>');
        })

        bean.on(Event, "createKO", function(data) {
            $('#feedback').append(data.responseText);
        })

        //Events editor Imatge
       bean.on(Event, "imatgeOK", function(data) {
           $($('#panell').find('.active').get(0)).removeClass('active');
           $('#fileupload').empty().append('<strong class="missatge-success">La imatge s\'ha creat correctament. ' +
               'Pots editar les seves característiques des del perfil.</strong>');
        })

        bean.on(Event, "imatgeKO", function(data) {
            $('#feedback').append(data.responseText);
        })

        //Events editor llibre
        bean.on(Event, "llibreOK", function(data) {
            $($('#panell').find('.active').get(0)).removeClass('active');
            $('#contingut').empty().append('<strong class="missatge-success">El llibre s\'ha creat correctament. ' +
                'Pots editar les seves característiques des del perfil.</strong>');
        })

        bean.on(Event, "llibreKO", function(data) {
            $('#feedback').append(data.responseText);
        })

        //Profile
        bean.on(Event, "editImatge", function(data) {
            var tematiques = new TematicaCollection();
            //Amagem el formulari anterior
            $('.image_picker_selector').hide();
            $('.pager.center-block').hide();

            tematiques.fetch().done(function () {
                //Mostrem el panell d'edicio
                var imatge = data.imatge;


                var compiledTemplate = _.template(editImatge,{imatge:imatge, tematiques:tematiques});
                $('#options').append(compiledTemplate);
                CKEDITOR.replace( "descripcio" );
            })
        })

        // Obtenir Tematiques
        bean.on(Event, "ObtTematicaOK", function(data) {
            //[TODO] Afegir algun contingut interessant a l'espai buit
            //$('#SelTematiques').empty().append("Tematiques");
            //localStorage.setItem('tematica',JSON.stringify(data));
            console.log(data);
            //tematicaView.getTematicas();
        })

        bean.on(Event, "ObtTematicaKO", function(data) {
            console.log(data.responseText);
        })

        //Events puntuacio
        bean.on(Event, "puntuacioOK", function(data) {
            //[TODO] Actualitzar la puntuacio que es mostra per pantalla
        })

        bean.on(Event, "puntuacioKO", function(data) {
            //[TODO] Afegir pop-up indicant KO + error
            console.log(data.responseText);
        })

        bean.on(Event, "puntuacioLlibreOK", function(data) {
            //[TODO] Actualitzar la puntuacio que es mostra per pantalla
        })

        bean.on(Event, "puntuacioLlibreKO", function(data) {
            //[TODO] Afegir pop-up indicant KO + error
            console.log(data.responseText);
        })

        bean.on(Event, "puntuacioImatgeOK", function(data) {
            //[TODO] Actualitzar la puntuacio que es mostra per pantalla
        })

        bean.on(Event, "puntuacioImatgeKO", function(data) {
            //[TODO] Afegir pop-up indicant KO + error
            console.log(data.responseText);
        })

        return Ui;
});
