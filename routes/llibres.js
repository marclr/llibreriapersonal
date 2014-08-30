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
            var cover= req.body.ruta
            var UsuariId = req.session.user;
            if (!titol || titol.length == 0) {
                util.stdErr500(res,"Missing 'titol' attribute in body");
                return;
            }
            else if(!descripcio || descripcio.length == 0) {
                util.stdErr500(res,"Missing 'descripcio' attribute in body");
                return;
            }
            if(!cover || cover.length == 0) {
                cover = 'img/llibres/cover.jpg';
            }
            var attribs= {
                titol : titol,
                descripcio : descripcio,
                index : req.body.index,
                public : req.body.public,
                esborrat : req.body.esborrat,
                data : req.body.data,
                lang : req.body.lang,
                ruta : cover,
                UsuariId : UsuariId
            }

            attribs = dao.deleteUndefined(attribs);

            dao.Llibre.create(attribs)
                .then(function(llibre){
                    dao.ContingutTematica.create(llibre.codi, 3, req.body.tematica);
                })
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        },

        update : function (req, res) {
            var id = req.params.id
            var UsuariId = req.session.user;
            if (!id) {
                util.stdErr500(res,"Missing 'id' attribute in body");
                return;
            }
            else if(!UsuariId) {
                util.stdErr500(res,"Missing 'login' attribute in body");
                return;
            }
            var attribs= {
                codi: id,
                titol : req.body.titol,
                descripcio : req.body.descripcio,
                index : req.body.index,
                public : req.body.public,
                esborrat : req.body.esborrat,
                data : req.body.data,
                lang : req.body.lang,
                ruta : req.body.ruta,
                UsuariId : UsuariId
            }
            attribs = dao.deleteUndefined(attribs);
            dao.Llibre.update(attribs)
                .then(function(llibre) {
                //Busquem les tematiques associades a l'element, les eliminem i afegim les noves
                //  Caldria veure la millor manera de fer un S&D
                dao.ContingutTematica.getById(llibre.codi, 3)
                    .then(function(tematiques) {
                        for(var i=0;i<tematiques.length;i++) {
                            tematiques[i].destroy();
                        }
                        dao.ContingutTematica.create(llibre.codi, 3, req.body.tematica);
                    })
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        delete : function (req, res) {
            var codi = req.params.id
            var UsuariId = req.session.user;
            if(!codi) {
                util.stdErr500(res,"Missing 'codi' parameter");
                return;
            }
            else if(!UsuariId){
                util.stdErr500(res,"Missing 'codi' parameter");
                return;
            }
            dao.Llibre.getById(codi)
                .then(function(element) {
                    if(!element) util.reject("No Text with 'codi' = " + element.codi);
                    else dao.Llibre.delete(element);
                    return;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getByLogin: function (req, res) {
            if (!req.params.login) {
                util.stdErr500(res,"Missing 'login' parameter");
                return;
            }

            dao.Llibre.getByLogin(req.params.login)
                .then(function (llibres) {
                    if (!llibres) util.reject("The user hasn't books");
                    else return llibres;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getById: function (req, res) {
            if (!req.params.id) {
                util.stdErr500(res,"Missing 'id' parameter");
                return;
            }

            W.all([dao.Llibre.getById(req.params.id), dao.Puntuacio.getAverage(3,req.params.id)])
                .spread( function (obj,puntuacio)  {
                    return {llibre: obj, puntuacio: puntuacio.dataValues['AVG(`puntuacio`)']}
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
            dao.Llibre.getPage({ limit: limit, offset: offset, public:public, esborrat:esborrat })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        search: function (req,res) {
            dao.Llibre.search(req.params.text)
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        }
    }

}
