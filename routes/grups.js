/*
 * GET users listing.
 */

module.exports = function(db) {

    var util = require('../util');
    var dao = require('../dao')(db);
    var W = require('when');



    return {
        create: function (req, res) {
            var nom = req.body.nom
            if (!nom || nom.length == 0) {
                util.stdErr500("Falta el nom del grup");
                return;
            }
            var attribs= {
                codi: req.body.login,
                nom: req.body.nom,
                descripcio: req.body.descripcio
            }
            attribs = dao.deleteUndefined(attribs);
            dao.Grup.create(attribs)
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        },

        update : function (req, res) {
            var id = req.body.codi
            var login = req.body.login
            if (!id) {
                util.stdErr500("Missing 'id' attribute in body");
                return;
            }
            else if(!login) {
                util.stdErr500("Missing 'login' attribute in body");
                return;
            }
            var attribs= {
                codi: id,
                //nom: req.body.nom,
                descripcio: req.body.descripcio
            }
            attribs = dao.deleteUndefined(attribs);
            dao.Grup.update(attribs)
                .then(util.stdSeqSuccess(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },

        getByLogin : function (req, res) {
            if (!req.params.login) {
                util.stdErr500("Missing 'login' parameter");
                return;
            }

            dao.Grup.getByLogin(req.params.login)
                .then(function (grups) {
                    if (!grups) util.reject("The user hasn't opinions");
                    else return grups;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getByElementId : function (tipus, req, res) {
            if (!req.params.id) {
                util.stdErr500("Missing 'id' parameter");
                return;
            }

            dao.Grup.getByElementId(req.params.id, tipus)
                .then(function (grups) {
                    if (!grups) util.reject("The book hasn't opinions");
                    else return grups;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        }
    }
}
