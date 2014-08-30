define('event', ['socketio'], function(io) {
    var socket;
    return {
        crearSocket: function() {
            if(!socket)
                socket = io.connect('http://localhost/');
        },
        obtenirSocket:function() {
            if(!socket) this.crearSocket();
            return socket;
        }
    };
});
