/**
 * New node file
 */


/*
 * GET users listing.
 */

module.exports = function (db) {

    var util = require('../util');
    var dao = require('../dao')(db);
    var W = require('when');

    return {
        create: function (req, res) {
            var titol = req.body.titol
            var descripcio= req.body.descripcio
            var UsuariId = req.session.user;

            if (!titol || titol.length == 0) {
                util.stdErr500("Missing 'titol' attribute in body");
                return;
            }
            else if(!descripcio || descripcio.length == 0) {
                util.stdErr500("Missing 'descripcio' attribute in body");
                return;
            }
            var attribs= {
                titol: titol,
                descripcio: descripcio,
                text: req.body.text,
                public: req.body.public,
                esborrat: req.body.esborrat,
                data: req.body.data,
                lang: req.body.lang,
                UsuariId: UsuariId
            }
            attribs = dao.deleteUndefined(attribs);
            dao.Text.create(attribs)
                .then(function(text){
                    dao.ContingutTematica.create(text.codi, 1, req.body.tematica);
                })
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        },

        update : function (req, res) {
            var codi = req.body.codi
            var UsuariId =  req.session.user;
            if (!codi) {
                util.stdErr500("Missing 'codi' attribute in body");
                return;
            }
            else if (!UsuariId) {
                util.stdErr500("Missing 'login' attribute in body");
                return;
            }

            var attribs= {
                codi: codi,
                titol: req.body.titol,
                descripcio: req.body.descripcio,
                text: req.body.text,
                public: req.body.public,
                esborrat: req.body.esborrat,
                data: req.body.data,
                lang: req.body.lang,
                UsuariId : UsuariId
            }
            attribs = dao.deleteUndefined(attribs);
            dao.Text.update(attribs)
                .then(function(text) {
                    //Busquem les tematiques associades a l'element, les eliminem i afegim les noves
                    //  Caldria veure la millor manera de fer un S&D
                    dao.ContingutTematica.getById(text.codi, 1)
                        .then(function(tematiques) {
                            for(var i=0;i<tematiques.length;i++) {
                                tematiques[i].destroy();
                            }
                            dao.ContingutTematica.create(text.codi, 1, req.body.tematica);
                        })
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        delete : function (req, res) {
            var codi = req.params.id;
            var UsuariId =  req.session.user;
            if(!codi) {
                util.stdErr500("Missing 'codi' parameter");
                return;
            }
            else if(!UsuariId){
                util.stdErr500("Missing 'codi' parameter");
                return;
            }
            dao.Text.getById(codi)
                .then(function(element) {
                    if(!element) util.reject("No Text with 'codi' = " + element.codi);
                    else dao.Text.delete(element);
                    return;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getByLogin: function (req, res) {
            if (!req.params.login) {
                util.stdErr500("Missing 'login' parameter");
                return;
            }

            dao.Text.getByLogin(req.params.login)
                .then(function (texts) {
                    if (!texts) util.reject("The user hasn't texts");
                    else return texts;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getById: function (req, res) {
            if (!req.params.id) {
                util.stdErr500("Missing 'id' parameter");
                return;
            }
            W.all([dao.Text.getById(req.params.id), dao.Puntuacio.getAverage(1,req.params.id)])
                .spread( function (obj,puntuacio)  {
                    return {text: obj, puntuacio: puntuacio.dataValues['AVG(`puntuacio`)']}
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getPage: function (req,res){
            var page = req.query.page || 0;
            var limit = req.query.limit || 10;
            var offset = page * limit;
            var public = req.query.public|| 1;
            var esborrat = req.query.esborrat || 0;
            dao.Text.getPage({ limit: limit, offset: offset, public:public, esborrat:esborrat})
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        search: function (req,res) {
            dao.Text.search(req.params.text)//[TODO]Abstreure cap a la classe dao.
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        }
    }

}
