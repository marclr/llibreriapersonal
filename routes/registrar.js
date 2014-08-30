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
        create: function (req, res) {
            var shasum = crypto.createHash('sha1');
            shasum.update(req.body.password);
            var login = req.body.login
            var password = req.body.password;
            var passwordHash = shasum.digest('hex');
            var email= req.body.email

            var strError="";
            if (!login || login.length<4) {
                strError+="El camp Usuari ha de ser superior a 4 caràcters.<br>";
            }
            if(!password || password.length<4) {
                strError+="El camp Contrassenya ha de ser superior a 4 caràcters.<br>";
            }
            if(!email || !dao.isEmail(email)) {
                strError+="El camp Correu electrònic no te una adreça vàlida.";
            }

            if(strError.length>0) {
                util.stdErr500(res,strError);
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
                email:  email,
                telefon: req.body.telefon,
                hash:  passwordHash
            }

            attribs = dao.deleteUndefined(attribs);
            dao.Usuari.getByLogin(login)
                .then(function (usuari) {
                    if (usuari) util.reject("Already exist a user with login = " + req.body.login);
                    return dao.Usuari.getByEmail(email);
                })
                .then(function(usuari) {
                    if(usuari) util.reject("Already exist a user with login = " + req.body.email);
                    return dao.Registrar.create(attribs);
                })
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        }
    }

}
