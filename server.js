var express = require('express')
    , http = require('http')
    , path = require('path')
    , _ = require('underscore')
var cors = require('cors');


var app = express()

app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.bodyParser({keepExtensions:true})) //per agafar els fitxers que ens envien els clients
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())

var cookieParser = express.cookieParser('1234567890QWERTY')
var sessionStore = new express.session.MemoryStore({reapInterval: 500000});
app.use(cookieParser);
app.use(express.session({store:sessionStore}));
app.use(cors());
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))

Function.prototype.genFuncLeft = function () {
    var fn = this, args = Array.prototype.slice.call(arguments);
    return function () {
        return fn.apply(null, args.concat(Array.prototype.slice.call(arguments)));
    }
}

Function.prototype.genFuncRight = function () {
    var fn = this, args = Array.prototype.slice.call(arguments);
    return function () {
        return fn.apply(null, Array.prototype.slice.call(arguments).concat(args));
    }
}

var db = require('./models')(app);
function restrict(req, res, next) {
    if (req.session.user && req.session.loggedIn) {
        next();
    } else {
        res.send(500,"Acces denegat. Torna a fer el login.")
        return;
    }
}
db.initPromise
    .then(function () {
        //Practica ADA
        var usuaris = require('./routes/usuaris')(db)
        var registrar = require('./routes/registrar')(db)
        var login = require('./routes/login')(db)
        var logout = require('./routes/logout')(db)
        var llibres = require('./routes/llibres')(db)
        var imatges = require('./routes/imatges')(db)
        var texts = require('./routes/texts')(db)
        var comentaris = require('./routes/comentaris')(db)
        var grups = require('./routes/grups')(db)
        var usuarigrups = require('./routes/usuariGrups')(db)
        var tipus = require('./routes/tipus')(db)
        var tematica = require('./routes/tematica')(db)
        var puntuacions = require('./routes/puntuacions')(db)

        //Creacio
        app.post('/registrar', registrar.create)
        app.post('/login', login.login)
        app.post('/logout', logout.logout)
        app.post('/texts', restrict, texts.create)
        app.post('/imatges', restrict, imatges.create)
        app.post('/llibres', restrict, llibres.create)
        app.post('/tipus', tipus.create)
        app.post('/tematica', tematica.create)
        app.post('/comentaris', restrict, comentaris.create)
        app.post('/grups', grups.create)
        app.post('/puntuacions', puntuacions.create)

        //Actualitzacio
        app.put('/usuaris/:login', restrict, usuaris.update)
        app.put('/texts/:id', restrict, texts.update)
        app.put('/imatges/:id', restrict, imatges.update)
        app.put('/llibres/:id', restrict, llibres.update)
        app.put('/tipus/:id', tipus.update)
        app.put('/tematica/:id', tematica.update)
        //app.put('/grups', grups.update)
        app.put('/puntuacions/:id', puntuacions.update)//[TODO] fer

        //Delete
        app.delete('/usuaris/:id', restrict, usuaris.delete)
        app.delete('/texts/:id', restrict, texts.delete)
        app.delete('/imatges/:id', restrict, imatges.delete)
        app.delete('/llibres/:id', restrict, llibres.delete)
        app.delete('/tipus/:id', tipus.delete)
        //app.delete('/tematica', tematica.delete)//[TODO] fer
        //app.delete('/grups', grups.update)//[TODO] fer

        //Consultes getPage de la bdb
        app.get('/usuaris',usuaris.getPage)
        app.get('/texts',texts.getPage)
        app.get('/imatges',imatges.getPage)
        app.get('/llibres',llibres.getPage)
        app.get('/tipus', tipus.getPage)
        app.get('/tematica', tematica.getPage)


        //Consultes usuaris
        app.get('/usuaris/:login',restrict,usuaris.getByLogin)
        app.get('/usuaris/:login/elements',restrict,usuaris.getAllElements)
        app.get('/usuaris/:login/llibres',restrict,llibres.getByLogin)
        app.get('/usuaris/:login/imatges',restrict,imatges.getByLogin)
        app.get('/usuaris/:login/texts',restrict,texts.getByLogin)
        app.get('/usuaris/:login/grups',restrict,usuarigrups.getByLogin)
        app.get('/usuaris/:login/comentaris',restrict,comentaris.getByLogin)

        //Consultes d'elements
        app.get('/texts/:id',texts.getById)
        app.get('/comentaris/texts/:id',_.partial(comentaris.getByElementId,1))

        app.get('/imatges/:id',imatges.getById)
        app.get('/comentaris/imatges/:id',_.partial(comentaris.getByElementId,2))

        app.get('/llibres/:id',llibres.getById)
        app.get('/comentaris/llibres/:id', _.partial(comentaris.getByElementId,3))

        //Consulta de tematica o tipus
        app.get('/tipus/:id', tipus.getById)
        app.get('/tematica/:id', tematica.getById)
        app.get('/tematica/:id/texts',  _.partial(tematica.getByTematica,1))
        app.get('/tematica/:id/imatges',  _.partial(tematica.getByTematica,2))
        app.get('/tematica/:id/llibres',  _.partial(tematica.getByTematica,3))

        //Cercar elements
        app.get('/search/usuaris/:text',usuaris.search) //No utilitzat
        app.get('/search/texts/:text',texts.search)
        app.get('/search/imatges/:text',imatges.search)
        app.get('/search/llibres/:text',llibres.search)

        var port = process.env.OPENSHIFT_NODEJS_PORT || app.get('port');
        var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

        var server = http.createServer(app).listen(port, ip, function () {
            console.log("Express server listening on " + ip + ":" + port);
        })

        function Room(own) {
            this.owner = own;
            this.people  = [];
            this.socketsPeople = [];
            this.titol = "";
            this.descripcio = new Array();
            this.descripcioDiff = {}
            this.text = new Array();
            this.textDiff = {}
            this.tematica = "";
            this.public = 1;
        }
        Room.prototype.saveDataEditor = function(data) {
            this.textDiff = {}
            this.descripcioDiff = {}
            var obj = JSON.parse(data);
            //titol i tematica ultim
            if(obj.titol!==undefined) this.titol = obj.titol;
            if(obj.descripcio!==undefined) this.matchAndSave('descripcio',obj.descripcio);
            if(obj.text!==undefined) this.matchAndSave('text',obj.text);
            if(obj.tematica!==undefined) this.tematica = obj.tematica;
            if(obj.public!==undefined) this.public = obj.public;
        };
        Room.prototype.matchAndSave = function(key, data) {
            var clauDiff = key+"Diff";
            var linies = data.split('\n');
            var midaObjecte = this[key].length;

            for(var i=0; i<linies.length;i++) {
                if(midaObjecte<=i || this[key][i]!==linies[i]) {
                    this[key][i] = linies[i];
                    this[clauDiff][i] = linies[i];//Guardes la linia a enviar
                }
            }

            this[key].splice(i,this[key].length);
            console.log(this['textDiff'])
        };
        Room.prototype.getObject = function() {
            return JSON.stringify(
                {
                    titol: this.titol,
                    descripcio: this.descripcio.join('\n'),
                    text: this.text.join('\n'),
                    tematica: this.tematica,
                    public: this.public
                }
            );
        };
        Room.prototype.getDiff = function() {
            var obj = {};
            if(Object.keys(this.textDiff).length>0)obj.text = JSON.stringify(this.textDiff);
            if(Object.keys(this.descripcioDiff).length>0) obj.descripcio = JSON.stringify(this.descripcioDiff);
            console.log(obj);
            return JSON.stringify(obj);
        };

        Room.prototype.isOwner = function(nick) {
            if (this.owner === nick) return true;
            else return false;
        };

        Room.prototype.addPerson = function(nick,id) {
            this.people.push(nick);
            this.socketsPeople.push(id);
        };

        Room.prototype.setNewOwner = function() {
            var newOwner = this.people.shift();
            var id = this.socketsPeople.shift();
            this.owner = newOwner;
            return [newOwner,id];
        };

        Room.prototype.havePeople = function() {
            return this.people.length>0;
        };

        var rooms={};

        var  io = require('socket.io').listen(server);
        var sessionSockets = require('session.socket.io');
        sessionSockets = new sessionSockets(io,sessionStore,cookieParser);
        sessionSockets.on('connection', function(err,socket,session) {

            var joinedRoom = null;
            var nick = null;

            socket.on('create', function (room,nickname) {
                var creator = false;
                if(!rooms[room]) {
                   creator=true;
                   rooms[room] = new Room(nickname)
                }
                socket.join(room);
                joinedRoom = room;
                nick = nickname;
                //console.log(socket.manager.rooms["/"+room]);
                //var a = socket.manager.rooms["/"+room].length;
                //console.log("A la sala "+room+" hi ha "+a+" persones. Nick:"+nick)
                socket.emit('createSuccess',room, creator)
                socket.broadcast.to(joinedRoom).emit('recieveMessage', "<em>S'ha unit a l'edició en grup</em>", nick);
                if(!creator) {
                    var data = rooms[room].getObject();
                    rooms[room].addPerson(nick, socket.id);
                    setTimeout(function() {
                        socket.emit('recieveDataEditor', data)
                    }, 2000);
                }
            });

            socket.on('getRooms', function (){
               // console.log(socket.manager.rooms)
                var sales = JSON.stringify(socket.manager.rooms);
                socket.emit('rooms',sales)
            });

            socket.on('message', function(data) {
                //console.log("Nick:"+nick+" send: "+data)
                socket.broadcast.to(joinedRoom).emit('recieveMessage', data, nick);
            });

            socket.on('sendDataEditor', function(data) {
                //console.log("Server, sendDataEditor: "+data)
                //console.log("Enviant a "+joinedRoom)

                //Emmagatzemar la info que canvia a la sala
                rooms[joinedRoom].saveDataEditor(data);

                if(hasDiff(data)) {
                    data = rooms[joinedRoom].getDiff();
                    socket.broadcast.to(joinedRoom).emit('recieveDataEditorDiff',data)
                }
                else socket.broadcast.to(joinedRoom).emit('recieveDataEditor',data)
            });

            function hasDiff(data) {
                var obj = JSON.parse(data)
                if(obj.text || obj.descripcio)return true;
                else return false;
            }

            socket.on("exit", function() {
                if(joinedRoom!==null) {
                    socket.broadcast.to(joinedRoom).emit('recieveMessage', "<em>Ha sortit de l'edició en grup</em>", nick)
                    if(rooms[joinedRoom].isOwner(nick)) {
                        if(rooms[joinedRoom].havePeople()) {
                            //Reassignar el propietari de la sala
                            var infoOwner = rooms[joinedRoom].setNewOwner();
                            var newOwner = infoOwner[0];
                            var idOwner = infoOwner[1];
                            socket.broadcast.to(joinedRoom).emit('recieveMessage', "<em>L'usuari <b>'" + newOwner + "'</b> és ara l'administrador</em>", 'Sistema')
                            io.sockets.socket(idOwner).emit('newOwner');//Sense io.sockets.socket donava problemes...
                        }
                        else delete rooms[joinedRoom];
                    }
                    socket.leave(joinedRoom);
                    joinedRoom = null;

                }
            });
        })

    }, function (err) {
        console.log("Error initializing database: " + err);
    })
    .done();
