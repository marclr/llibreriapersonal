/**
 * Created by Rachid on 18/04/2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'bean',
    'fileupload',
    'models/imatge',
    'collections/imatges',
    'collections/tematica',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!/templates/editor/upload.html',
    'event',
    'util'
], function($, _, Backbone, bean, fileupload, ModelImatge, ImatgeCollection, TematicaCollection, uploadListTemplate, Event, util) {
    var EditorView = Backbone.View.extend(function() {

        var imatge=new ModelImatge();
        var tematica = new TematicaCollection();


        return {

            events: {
                "click #cargarImatge" : "cargarImatge"
            },
            initialize: function() {
                this.imgdata = null;
            },

            cargarImatge: function() {
                if (this.imgdata) {
                    this.imgdata.formData = util.recollir('#fileupload');
                    var aux = util.checkValues(this.imgdata.formData);
                    if(Object.keys(aux).length) {
                        util.showErrors(this.$el,aux);
                    }
                    else {
                        util.removeErrors()
                        this.imgdata.submit();
                    }
                }
                else {
                    $('#feedback.missatge-error').empty().append("Falta seleccionar la imatge");//Per consens sempre es mostren les errades a: strong.missatge-error
                }
            },
            render: function (camp) {
                // Using Underscore we can compile our template with data
                var compiledTemplate = _.template(uploadListTemplate, {tematiques: tematica});
                var that = this;
                // Append our compiled template to this Views "el"
                this.$el.empty().append(compiledTemplate);
                /** https://github.com/blueimp/jQuery-File-Upload/blob/master/basic-plus.html*/
                $('#file').fileupload({
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    maxFileSize: 5000000, // 5 MB
                    dataType: 'json',
                    formData: util.getInputsForm('#fileupload'),
                    add: function (e, data) {
                        that.imgdata = data;
                        $.each(data.files, function (index, file) {
                            var node = $('<p/>')
                                .append($('<span/>').text(file.name));
                            $('#files').empty().append(node)
                        })
                    },
                    error: function (error) {
                        bean.fire(Event, 'imatgeKO', error);
                    },
                    done: function (e, data) {
                        bean.fire(Event, 'imatgeOK', data);
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#progress .progress-bar').css(
                            'width',
                                progress + '%'
                        );
                    }
                })
            },

            update: function () {
                var op = {reset: true}

                var that = this;
                tematica.fetch(op).success(function() {
                    that.render();
                });
            }
        }
    }());

    // Our module now returns our view
    return EditorView;
});