/*
 * GET users listing.
 */

module.exports = function(db) {

	var util = require('../util');
	var dao = require('../dao')(db);
    var W = require('when');



	return {
        create: function (req, res) {
            var text= req.body.text
            var tipus = req.body.tipus;
            var codi = req.body.idElement;
            if(!text || text.length==0) {
                util.stdErr500(res,"El comentari no te contingut");
                return;
            } else if(!tipus) {
                util.stdErr500(res,"No es disposa del tipus de l'element");
                return;
            } else  if(!codi){
                util.stdErr500(res,"No es disposa del codi de l'element");
                return;
            }

            var attribs= {
                UsuariId: req.session.user,
                text: text,
                TipuId:tipus
            };

            if(tipus==1) attribs.TextId = codi;
            else if(tipus==2) attribs.ImatgeId = codi;
            else if(tipus==3) attribs.LlibreId = codi;

            dao.Comentari.create(attribs)
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        },

        getByLogin : function (req, res) {
            if (!req.params.login) {
                util.stdErr500("Missing 'login' parameter");
                return;
            }

            dao.Comentari.getByLogin(req.params.login)
                .then(function (comentaris) {
                    if (!comentaris) util.reject("The user hasn't opinions");
                    else return comentaris;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getByElementId : function (tipus, req, res) {
            if (!req.params.id) {
                util.stdErr500("Missing 'id' parameter");
                return;
            }

            dao.Comentari.getByElementId(req.params.id, tipus)
                .then(function (comentaris) {
                if (!comentaris) util.reject("The book hasn't opinions");
                else return comentaris;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        }
	}
}
