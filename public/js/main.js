require.config({
    paths: {
        jquery: 'libs/jquery/jquery-min', //versio 1.11.0
        "jquery.bootstrap": "libs/bootstrap/bootstrap.min", //versio 3.1.1
        underscore: 'libs/underscore/underscore-min', //versio 1.6
        backbone: 'libs/backbone/backbone-min', //versio 1.1.2
        bean: 'libs/bean/bean.min', //versio 1.0.
        ckeditor: "libs/altres/ckeditor/ckeditor", //versio 4
        "fileupload" : "libs/jquery.fileupload",//9.5.7
        "jqueryui" : "libs/jqueryui/jquery-ui",//1.10.4
        "sessionsocket":'libs/sessionsocket/session.socket.io',
        "socketio":"../../socket.io/socket.io"//
    }
});

require([

    // Load our app module and pass it to our definition function
    'app'
], function(App){
    // The "app" dependency is passed in as "App"
    App.initialize();
    //App.navigate("shops")
});