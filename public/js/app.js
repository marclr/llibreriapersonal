define('app', ['jquery', 'backbone', 'bean', 'router', 'ui',
    'models/usuari', 'event','util'], function($, Bb, bean, Router, Ui, UsuariModel, Event, util) {
    var App = {};

    $(document).on('click','#login',function() {
        var values = util.getInputsForm('#loginform');
        $.ajax({
            data : values,
            type: "POST",
            url:"/login",
            success:function(data) {
                bean.fire(Event, 'loginOK',data);
            },
            error:function(data) {
                bean.fire(Event, 'loginKO',data);
            }
        })
    })

    $(document).on('click','#sortir',function() {
        localStorage.removeItem('usuari');
        bean.fire(Event, 'logoutOK');
        Router.navigate('inici',{trigger: true, replace: true});
    })

    App.initialize = function() {
        Ui.initialize();
        Router.initialize(Ui);
        //Comprovem si hem de canviar les interficies o no
        if(localStorage.usuari) {//[TODO] Simular el login
            bean.fire(Event, 'registrarOK');
            var data = {};
            data = JSON.parse(localStorage.getItem('usuari'));
            data['localStorage']=true;
            bean.fire(Event, 'loginOK',data);
        }
    };

    App.navigate = function(hash) {
        Router.navigate(hash)
    }

    return App;
});
