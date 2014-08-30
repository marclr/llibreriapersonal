define([
    'jquery',
    'underscore',
    'backbone',
    'views/editor/list',
    'event'

], function ($, _, Backbone, editorListView, event) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            '' : 'showInici',
            'inici' : 'showInici',
            'editor': 'showEditor',
            'texts': 'showTexts',
            'imatges': 'showImatges',
            'llibres': 'showLlibres',
            'grup': 'showGrup',

            //Perfil de l'usuari
            'usuari/perfil':'userProfile',
            'usuari/contrassenya':'userPassword',
            'usuari/mytexts':'userText',
            'usuari/myimatges':'userImatges',
            'usuari/myllibres':'userLlibres',

            // Default
            '*actions': 'defaultAction'
        }
    });

    var app_router = new AppRouter();

    var initialize = function (Ui) {
        app_router.on('route:showInici', function () {
            Ui.showInici();
        });


        app_router.on('route:showEditor', function () {
            Ui.showEditor();
        });

        app_router.on('route:showTexts', function () {
            Ui.showTexts();
        });

        app_router.on('route:showImatges', function () {
            Ui.showImatges();
        });

        app_router.on('route:showLlibres', function () {
            Ui.showLlibres();
        });

        app_router.on('route:showGrup', function () {
            event.crearSocket();
            Ui.showGrup();
        });

        //Opcions relacionades amb el perfil de l'usuari
        app_router.on('route:userProfile', function () {
            Ui.userProfile("perfil");
        });

        app_router.on('route:userPassword', function () {
            Ui.userProfile("password");
        });

        app_router.on('route:userText', function () {
            Ui.userProfile("texts");
        });

        app_router.on('route:userImatges', function () {
            Ui.userProfile("imatges");
        });

        app_router.on('route:userLlibres', function () {
            Ui.userProfile("llibres");
        });

        //Fi opcions relacionades amb el perfil

        app_router.on('defaultAction', function (actions) {
            // We have no matching route, lets just log what the URL was
            //console.log('No route:', actions);
            editorListView.render();
        });

        Backbone.history.start();
    };

    return {
        initialize: initialize,
        navigate: function(hash) {
            app_router.navigate(hash, {trigger: true})
        }
    };
});