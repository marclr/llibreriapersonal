/*
 * GET users listing.
 */

module.exports = function(db) {

    var util = require('../util');
    var dao = require('../dao')(db);
    var W = require('when');



    return {
        create: function (req, res) {
            var puntuacio = req.body.puntuacio,
                tipus = req.body.tipus,
                login = req.body.login,
                llibre = req.body.llibre,
                imatge = req.body.imatge,
                text = req.body.text;
            if (!puntuacio || puntuacio > 5) {
                util.stdErr500(res,"La puntuacio no es correcta");
                return;
            }
            else if (!tipus) {
                util.stdErr500(res,"Falta el camp tipus");
                return;
            }
            else if (!login) {
                util.stdErr500(res,"Falta el login");
                return;
            }//[TODO] Acabar no es contemplen tots els casos
            else if (!llibre && !imatge && !text) {
                util.stdErr500(res,"Falta la referencia cap a l'element");
                return;
            }
            var attribs= {
                puntuacio: puntuacio,
                ImatgeId: req.params.ImatgeId,
                LlibreId: req.params.LlibreId,
                TipuId: req.params.TipuId,
                UsuariId: req.params.UsuariId,
                TextId: req.params.TextId
            }
            attribs = dao.deleteUndefined(attribs);
            dao.Puntuacio.create(attribs)
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        },
        update : function (req, res) {
            var puntuacio = req.body.puntuacio,
                tipus = req.body.tipus,
                login = req.body.login,
                llibre = req.body.llibre,
                imatge = req.body.imatge,
                text = req.body.text;

            var UsuariId =  req.session.user;
            if (!puntuacio || puntuacio > 5) {
                util.stdErr500(res,"La puntuacio no es correcta");
                return;
            }
            else if (!tipus) {
                util.stdErr500(res,"Falta el camp tipus");
                return;
            }
            else if (!UsuariId) {
                util.stdErr500(res,"Falta el login");
                return;
            }//[TODO] Acabar no es contemplen tots els casos
            else if (!llibre && !imatge && !text) {
                util.stdErr500(res,"Falta la referencia cap a l'element");
                return;
            }
// if string null si igual a null
            if(text == "") {text = null;}
            if(imatge == "") {imatge = null;}
            if(llibre == "") {llibre = null}
            var attribs= {
                puntuacio: puntuacio,
                TextId: text,
                ImatgeId: imatge,
                LlibreId: llibre,
                TipuId: tipus,
                UsuariId: UsuariId
            }

             dao.Puntuacio.update(attribs)
                 .then(util.stdSeqSuccess.genFuncLeft(res),
                 util.stdSeqError.genFuncLeft(res))
                 .done();
        },
        getByLogin : function (req, res) {
            if (!req.params.login) {
                util.stdErr500(res,"Missing 'login' parameter");
                return;
            }

            dao.Puntuacio.getByLogin(req.params.login)
                .then(function (puntuacions) {
                    if (!puntuacions) util.reject("The user hasn't opinions");
                    else return puntuacions;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        }
    }
}
