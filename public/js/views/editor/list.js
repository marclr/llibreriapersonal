/**
 * Created by Rachid on 18/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'views/tipus/panell',
    'views/editor/editor',
    'views/editor/upload',
    'views/editor/generateBook',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/editor/list.html'
], function($, _, Backbone, tipusListView, editorView, uploadView, generateBookView, editorListTemplate) {
    var EditorListView = Backbone.View.extend(function() {

        return {

            events: {
                'click .tipus': 'canviarTipus'
            },

            initialize: function (params) {
                var that = this;
            },


            render: function (codi) {
                var compiledTemplate = _.template(editorListTemplate, {nomPagina:"Crea nou contingut"});
                this.$el.empty().append('<br><br>'+compiledTemplate);

                var tipusView = new tipusListView({el:'#panell'});
                tipusView.update({},codi);

                var edView = null;
                if(codi==1) edView = new editorView({el:'#contingut'});
                else if(codi==2) edView = new uploadView({el:'#contingut'});
                else edView = new generateBookView({el:'#contingut'});
                edView.update();
            },

            canviarTipus : function(el) {
                $('#panell').find('.active').attr('class', 'list-group-item tipus');
                var element = el.target;
                var codi = $(element).children().get(0).value;
                $(element).attr('class', 'list-group-item tipus active');
                this.update(codi);
            },

            update: function (codi) {
                if(!codi) this.render(1);
                else this.render(codi);
            }
        }
    }());

    // Our module now returns our view
    return EditorListView;
});
