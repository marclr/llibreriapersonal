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
        login: function (req, res) {
            var shasum = crypto.createHash('sha1');
            shasum.update(req.body.password);
            var login = req.body.login
            var password = shasum.digest('hex');
            if (!login) {
                util.stdErr500(res, "Introdueix l'usuari");
                return;
            }
            else if(!password) {
                util.stdErr500(res, "Introdueix la contrassenya");
                return;
            }

            dao.Usuari.getByLogin(login)
                .then(function (usuari) {
                    if (!usuari) util.reject("No existeix cap usuari amb el login = " + req.body.login);
                    else if(usuari.login == login && usuari.hash == password){
                       req.session.user = login;
                       req.session.loggedIn  = true;
                       return usuari;
                    }
                    else util.reject("La contrassenya és invalida");
                })
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        }
    }

}
