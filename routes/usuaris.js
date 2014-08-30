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
    var crypto = require('crypto');

    return {
        update : function (req, res) {
            var login = req.session.user;
            var canviContrassenya = req.body.contrassenya;

            if(!req.body.password===undefined) {
                util.stdErr500(res,"No s'ha introduït la contrassenya");
                return;
            }

            if(canviContrassenya) {
                var shasum = crypto.createHash('sha1');
                shasum.update(req.body.password);
                var password = shasum.digest('hex');
                if(!login) {
                    util.stdErr500(res,"Falta el login");
                    return;
                }
                dao.Usuari.getHash(login)
                    .then(function(p) {
                        if(p.hash == password) {
                            //Comprovar mida, minim 4
                            var passwordNew = req.body.passwordNew;
                            var passwordNewRep= req.body.passwordNewRep;
                            if(passwordNew.length < 4 || passwordNewRep.length<4) {
                                util.reject("La mida de la contrassenya ha de ser >= 4");
                                return;
                            }
                            else if(passwordNew != passwordNewRep) {
                                util.reject("La contrassenya nova no coincideix en els dos camps");
                                return;
                            }
                            else {
                                var shasum = crypto.createHash('sha1');
                                shasum.update(passwordNew);
                                var hash = shasum.digest('hex');
                                var attribs = {
                                    login : login,
                                    hash:  hash
                                };
                                dao.Usuari.update(attribs)
                                    .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                                    .done();
                                return;
                            }

                        }
                        else {
                            util.reject("La contrassenya introduida és errònia");
                            return;
                        }
                    })
                    .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                    .done();

            }
            else {
                if (!login) {
                    util.stdErr500(res, "Missing 'login' attribute in body");
                    return;
                }
                var attribs = {
                    login: login,
                    nom: req.body.nom,
                    cognom: req.body.cognom,
                    adreca: req.body.adreca,
                    ciutat: req.body.ciutat,
                    codi_postal: req.body.codi_postal,
                    pais: req.body.pais,
                    data_naixement: req.body.data_naixement,
                    sexe: req.body.sexe,
                    email: req.body.email,
                    telefon: req.body.telefon,
                    hash: req.body.hash
                };
                if (!attribs.telefon || attribs.telefon.length == 0)attribs.telefon = null;
                if (!attribs.codi_postal || attribs.codi_postal.length == 0)attribs.codi_postal = null;
                if (!attribs.sexe || attribs.sexe == "true")attribs.sexe = true;
                else attribs.sexe = false;
                //[Explicacio] No podem afegir aquesta linia ja que sino els camps numerics sempre tindran valor
                // attribs = dao.deleteUndefined(attribs);

                dao.Usuari.update(attribs)
                    .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                    .done();
            }
        },
        delete: function(req,res) {
            if(!req.body.login) {
                util.stdErr500(res,"Missing 'login' parameter");
                  return;
            }

            dao.Usuari.getByLogin(req.body.login)
                .then(function(u) {
                    if(!u) util.reject("No User with 'login' = " + u.login);
                    else dao.Usuari.delete(u);
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

            dao.Usuari.getByLogin(req.params.login)
                .then(function (usuari) {
                    if (!usuari) util.reject("No User with 'login' = " + req.params.login);
                    else return usuari;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getByEmail: function (req, res) {
            if (!req.params.email) {
                util.stdErr500(res,"Missing 'email' parameter");
                return;
            }
            dao.Usuari.getByEmail(req.params.email)
                .then(function (usuari) {
                    if (!usuari) util.reject("No User with 'email' = " + req.params.email);
                    else return usuari;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getAllElements: function(req,res) {
            var login = req.params.login;
            if (!login) {
                util.stdErr500(res,"Missing 'login' parameter");
                return;
            }
            W.all([dao.Text.getByLogin(login),dao.Llibre.getByLogin(login),dao.Imatge.getByLogin(login)])
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getPage: function (req,res){
            var page = req.query.page || 0;
            var limit = req.query.size || 10;
            var offset = page * limit;
            dao.Usuari.getPage({ limit: limit, offset: offset})
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        search: function (req,res) {

            dao.Usuari.search(req.params.text)
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        }
    }

}
