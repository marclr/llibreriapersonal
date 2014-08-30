/**
 * Created by Rachid on 18/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'bean',
    'ckeditor',
    'models/text',
    'collections/tematica',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/editor/editor.html',
    'event',
    'util'
], function($, _, Backbone, socketio, bean, ckeditor, ModelText, TematicaCollection, editorTemplate, Event, util) {
    var EditorView = Backbone.View.extend(function() {
        var text=new ModelText();
        var tematica = new TematicaCollection();
        return {
            events: {
                // "click #guardarText": "submit"
            },

            initialize: function (params) {
            },
            submit: function() {
                var values = util.recollir('#crearText');
                values.text = CKEDITOR.instances.editor1.getData();
                var aux = util.checkValues(values);
                if(Object.keys(aux).length) {
                    util.showErrors(this.$el,aux);
                }
                else {
                    util.removeErrors()
                    text.update(values).done(function (data) {
                        bean.fire(Event, 'createOK', data);
                    }).fail(function (data) {
                        bean.fire(Event, 'createKO', data);
                    });
                }
            },
            render: function () {
                var compiledTemplate = _.template(editorTemplate, {tematiques:tematica});
                this.$el.empty().append(compiledTemplate);
                CKEDITOR.replace('editor1');
                $('#guardarText').on('click', this.submit);
            },

            update: function () {
                var op = {reset: true}

                var that = this;
                tematica.fetch(op).success(function() {
                    that.render(0);
                });
            }
        }
    }());

    // Our module now returns our view
    return EditorView;
});