/*
 * GET users listing.
 */

module.exports = function(db) {

	var util = require('../util');
	var dao = require('../dao')(db);
    var W = require('when');

	return {
        create: function (req, res) {
            var descripcio = req.body.descripcio
            if (!descripcio) {
                util.stdErr500("Missing 'descripcio' attribute in body");
                return;
            }
            var attribs = {
                descripcio: descripcio
            }

            attribs = dao.deleteUndefined(attribs); //No faria falta però per si s'expandeix en el futur

            dao.Tipus.create(attribs)
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getById: function (req,res) {
            dao.Tipus.getById(req.params.id)
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        },
        update : function (req, res) {
            var id = req.params.id
            if (!id) {
                util.stdErr500("Missing 'id' attribute in body");
                return;
            }
            var attribs = {
                codi: id,
                descripcio: req.body.descripcio
            }

            attribs = dao.deleteUndefined(attribs); //No faria falta però per si s'expandeix en el futur
            dao.Tipus.update(attribs)
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        },
        delete : function (req, res) {
            var codi = req.body.codi
            if(!codi) {
                util.stdErr500("Missing 'codi' parameter");
                return;
            }
            dao.Tipus.getById(codi)
                .then(function(element) {
                    if(!element) util.reject("No Tipus with 'codi' = " + element.codi);
                    else dao.Tipus.delete(element);
                    return;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getPage: function (req,res){
            var page = req.query.page || 0;
            var limit = req.query.size || 10;
            var offset = page * limit;
            dao.Tipus.getPage({ limit: limit, offset: offset})
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        }
	}
}
