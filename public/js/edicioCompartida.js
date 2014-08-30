define('edicioCompartida', ['ckeditor', 'event'], function(ckeditor, event) {
    //Classe per detectar els canvis en l'editor de text

    //Atributs privat
    var timer = null;
    var canviEstat = false;
    var elements = [false,false,false,false,false]; //Titol, Descripcio, Text, Tematica, Public
    var socket = event.obtenirSocket();
    var nick = getNickname();

    //Elements de l'editor en cache
    /*var elTitol = $('input[name=titol]');
    var elDescripcio = $('textarea[name=descripcio]');
    var elText = $('input[name=text]');
    var elTematica = $('input[name=tematica]');
    var elPublic = $('select[name=public]');
*/
    //Metodes privats
    function setTimer(time) {
        timer = setInterval(function() {
            //console.log("Edicio compartida, Temps!")
            //console.log(canviEstat)
            //console.log(elements)
            if(canviEstat) {
                sendData(getData());
                removeCanviEstat();
            }
        }, time);
    }
    function getNickname() {
        if(localStorage.getItem('nick') !== null ){
            return localStorage.getItem('nick');
        }
    }
    function getTitol(obj) {
        if(elements[0]) {
            var titol = $('input[name=titol]').val();
            return obj.titol=titol;
        }
    }
    function getDescripcio(obj) {
        if(elements[1]) {
            var descripcio = $('textarea[name=descripcio]').val();
            return obj.descripcio=descripcio;
        }
    }
    function getText(obj) {
        if(elements[2]) {
            var text = CKEDITOR.instances.editor1.getData();
            return obj.text = text;
        }
    }
    function getTematica(obj) {
        if(elements[3]) {
            var marcats = $('input[name=tematica]:checked');
            var tematica = [];
            $(marcats).each(function(){
                tematica.push(this.value);
            });
            return obj.tematica = tematica.join(",");
        }
    }
    function getPublic(obj) {
        if(elements[4]) {
           return obj.public = $('select[name=public]').val();
        }
    }

    function getData() {
        var obj = {};
        getTitol(obj);
        getDescripcio(obj);
        getText(obj);
        getTematica(obj);
        getPublic(obj);
        return JSON.stringify(obj);
    }

    function sendData(data) {
        socket.emit("sendDataEditor",data);
    }

    socket.on('recieveDataEditorDiff', function(data) {
        var obj = JSON.parse(data);
        if(obj.descripcio) {
            var linies = JSON.parse(obj.descripcio)
            var descripcio = $('textarea[name=descripcio]').val();
            descripcio = descripcio.split('\n');
            for (var key in linies) {
                descripcio[key] = linies[key];
            }
            $('textarea[name=descripcio]').val(descripcio.join('\n'));
        }
        if(obj.text){
            var linies = JSON.parse(obj.text)
            var text = CKEDITOR.instances.editor1.getData();
            text = text.split('\n');
            for (var key in linies) {
                text[key] = linies[key];
            }
            CKEDITOR.instances.editor1.setData(text.join('\n'));
        }
    });

    socket.on('recieveDataEditor', function(data) {
        var obj = JSON.parse(data);
        if(obj.titol!==undefined) $('input[name=titol]').val(obj.titol);
        if(obj.descripcio!==undefined) $('textarea[name=descripcio]').val(obj.descripcio);
        if(obj.text!==undefined) CKEDITOR.instances.editor1.setData(obj.text);
        if(obj.tematica!==undefined) afegirTematiques(obj.tematica);
        if(obj.public!==undefined) $('select[name=public]').val(obj.public);
    });

    function afegirTematiques(t) {
       // console.log("tematica")
        var tematiques = t.split(',');
        var selector = $('input[name=tematica]')
        selector.prop('checked',false);
        selector = selector.toArray().reverse();
        for (var i = 0; i < tematiques.length; i++) {
            var codi = tematiques[i]-1;//Els codis son de 1 a n
            $(selector[codi]).prop('checked', true);
        }
    }

    //set and remove
    function setCanviEstat(pos) {
        elements[pos]=true;
        canviEstat = true;
    }
    function removeCanviEstat() {
        for(var i=0;i<elements.length;i++) elements[i]=false;
        canviEstat = false;
    }

    function sendMessage(text) {
        socket.emit('message',text)
        $('#xat-finestra').append('<p><b>'+nick+'</b>: '+text+'</p>')

    }

    socket.on('recieveMessage',function(data, nick){
        $('#xat-finestra').append('<p><b>'+nick+'</b>: '+data+'</p>')
    })

    return {
        initialize: function(isCreator) {
            if(!isCreator) $('.panell-butons').empty();
           // else $('#guardarText').after('<button id="leaveGroup" class="btn btn-danger">Sortir de la sala</button>');
            setTimer(3000);
            nick = getNickname();
            this.createEvents();
        },
        createEvents: function() {
            $('input[name=titol]').on('keyup', function() {
                setCanviEstat(0);
                //console.log("input[name=titol]")
            });

            $('textarea[name=descripcio]').on('keyup', function() {
                setCanviEstat(1);
                //console.log("textarea[name=descripcio]")
            });

            CKEDITOR.replace('editor1');
            CKEDITOR.instances['editor1'].on( 'contentDom', function() {
                var editable = CKEDITOR.instances['editor1'].editable();
                editable.attachListener( CKEDITOR.instances['editor1'].document, 'keyup', function() {
                    setCanviEstat(2);
                    //console.log("input[name=text]")
                } );
            } );

            $('input[name=tematica]').on('change', function() {
                setCanviEstat(3);
                //console.log("input[name=tematica]")
            });

            $('select[name=public]').on('change', function() {
                setCanviEstat(4);
                //console.log("select[name=public]")
            })

            $('.enviar').on('click', function () {
                var text = $('#xat-text').val();
                $('#xat-text').val('');
                sendMessage(text);
            })

        },
        getCanviEstat: function() {
            console.log(canviEstat)
        }
    };
});
