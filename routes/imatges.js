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
    var fs = require('fs');

    return {
        create: function (req, res) {//fs.readFile
            if(!req.files.files[0].path) {
                util.stdErr500(res,"No s'ha afegit cap imatge");
                return;
            }

            var titol = req.body.titol;
            if(!titol || titol.length<1) {
                util.stdErr500(res,"No s'ha afegit el titol de la imatge");
                return;
            }

            fs.readFile(req.files.files[0].path, function (err, data) {
                var name = req.files.files[0].name;
                //if (err) throw err;
                if(!name) {
                    util.stdErr500(res,"No es detecta el nom de la imatge. Torna a enviar-la");
                    return;
                }
                else {
                    var extensio = name.split('.').pop();
                    //Consultem a la DB quin es l'identificador maxim i l'augmentem en 1
                    dao.Imatge.getMaxId()
                        .then(function(element) {
                            var c = element.dataValues['MAX(`codi`)'] + 1;
                            var dir = 'public/img/imatges/'+c+'.'+extensio;
                            fs.writeFile(dir, data, function() {
                                dir = 'img/imatges/'+c+'.'+extensio;
                                var login = req.session.user;
                                var attribs= {
                                    titol: titol,
                                    descripcio: req.body.descripcio,
                                    public: req.body.public,
                                    esborrat: req.body.esborrat,
                                    data_creacio: req.body.data_creacio,
                                    height: req.body.height,
                                    width: req.body.width,
                                    ruta:dir,
                                    UsuariId: login
                                }
                                attribs = dao.deleteUndefined(attribs);
                                dao.Imatge.create(attribs)
                                    .then(function(imatge) {
                                        dao.ContingutTematica.create(imatge.codi, 2, req.body.tematica);
                                    })
                            })
                            return;
                        })
                        .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                        .done();
                    //var dir = 'public/img/imatges/'
                    //fs.writeFile()
                }
            })
        },
        update : function (req, res) {
            var id = req.body.codi
            var UsuariId = req.session.user;
            if (!id) {
                util.stdErr500("Missing 'id' attribute in body");
                return;
            }
            else if(!UsuariId) {
                util.stdErr500("Missing 'login' attribute in body");
                return;
            }
            var attribs= {
                codi: id,
                titol: req.body.titol,
                descripcio: req.body.descripcio,
                public: req.body.public,
                esborrat: req.body.esborrat,
                data_creacio: req.body.data_creacio,
                height: req.body.height,
                width: req.body.width,
                ruta: req.body.ruta,
                UsuariId: UsuariId
            }
            attribs = dao.deleteUndefined(attribs);
            dao.Imatge.update(attribs)
                .then(function(imatge) {
                    //Busquem les tematiques associades a l'element, les eliminem i afegim les noves
                    //  Caldria veure la millor manera de fer un S&D
                    dao.ContingutTematica.getById(imatge.codi, 2)
                        .then(function(tematiques) {
                            for(var i=0;i<tematiques.length;i++) {
                                tematiques[i].destroy();
                            }
                            dao.ContingutTematica.create(imatge.codi, 2, req.body.tematica);
                        })

                })
                .then(util.stdSeqSuccess(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        delete : function (req, res) {
            var codi = req.params.id
            var UsuariId = req.session.user;
            if(!codi) {
                util.stdErr500(res,"No s'ha rebut el codi de la imatge");
                return;
            }

            dao.Imatge.getById(codi)
                .then(function(element) {
                    if(!element) util.reject("No existeix cap imatge amb el 'codi' = " + element.codi);
                    else dao.Imatge.delete(element);
                    return;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getPage: function (req,res){
            var page = req.query.page || 0;
            var limit = req.query.limit || 10;
            var offset = page * limit;
            var esborrat = req.query.esborrat || 0;
            var public= req.query.public || 1;

            dao.Imatge.getPage({ limit: limit, offset: offset, esborrat:esborrat, public:public})
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getByLogin: function (req, res) {
            if (!req.params.login) {
                util.stdErr500("Missing 'login' parameter");
                return;
            }

            dao.Imatge.getByLogin(req.params.login)
                .then(function (imatges) {
                    if (!imatges) util.reject("The user hasn't images");
                    else return imatges;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getById: function (req, res) {
            if (!req.params.id) {
                util.stdErr500("Missing 'id' parameter");
                return;
            }
            W.all([dao.Imatge.getById(req.params.id), dao.Puntuacio.getAverage(2,req.params.id)])
                .spread( function (obj,puntuacio)  {
                    return {imatge: obj, puntuacio: puntuacio.dataValues['AVG(`puntuacio`)']}
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        search: function (req,res) {
            dao.Imatge.search(req.params.text)
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        }
    }

}
