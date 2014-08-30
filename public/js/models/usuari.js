/**
 * Created by Marc on 16/04/2014.
 */
define([
    'underscore',
    'backbone',
    'bean'
], function(_, Backbone, bean){
    var UsuariModel = Backbone.Model.extend({
        urlRoot: "/usuaris",
        idAttribute: 'login',
        defaults: {
            login:"",
            email:"",
            password:""
        },

        registrar: function() {
            this.urlRoot = "/registrar";
            var retorn = this.save(null);
            this.urlRoot = "/usuaris";
            return retorn;
        },

        login: function() {
            this.urlRoot = "/login";
            var retorn = this.save(null);
            this.urlRoot = "/usuaris";
            return retorn;
        },

        update: function(values) {
            return this.save(values);
        },

        getUser: function(obj) {
            return this.fetch();
        },

        getImatges: function() {
            $.ajax({
                url:"usuaris/"+this.login+'/imatges',
                success:function(data) {
                    imatges = new ImatgeCollection();
                    for(var i = 0; i<data.length; i++) imatges.add(data[i].imatge);
                    that.renderImatges();
                },
                fail:function(data) { imatges.reset();}
            })
            this.urlRoot = "/usuaris/:id/imatges";
            var retorn = this.fetch(null);
            this.urlRoot = "/usuaris";
            return retorn;
        }
    });
    // Return the model for the module
    return UsuariModel;
});