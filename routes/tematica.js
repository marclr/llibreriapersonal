/*
 * GET users listing.
 */

module.exports = function(db) {

	var util = require('../util');
	var dao = require('../dao')(db);

	return {
        create: function (req, res) {
            var nom = req.body.nom
            if (!nom) {
                util.stdErr500("Missing 'nom' attribute in body");
                return;
            }
            var attribs = {
                nom : nom,
                descripcio: req.body.descripcio
            }

            attribs = dao.deleteUndefined(attribs);

            dao.Tematica.create(attribs)
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        },
        update : function (req, res) {
            var id = req.params.id
            if (!id) {
                util.stdErr500("Missing 'codi' attribute in body");
                return;
            }
            var attribs = {
                codi : id,
                descripcio: req.body.descripcio
            }

            attribs = dao.deleteUndefined(attribs);

            dao.Tematica.update(attribs)
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
            dao.Tematica.getById(codi)
                .then(function(element) {
                    if(!element) util.reject("No Tematica with 'codi' = " + element.codi);
                    else dao.Tipus.delete(element);
                    return;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getById: function (req,res) {
            dao.Tematica.getById(req.params.id)
                .then(util.stdSeqSuccess.genFuncLeft(res),
                util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getPage: function (req,res){
            var page = req.query.page || 0;
            var limit = req.query.size || 10;
            var offset = page * limit;
            dao.Tematica.getPage({ limit: limit, offset: offset})
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        },
        getByTematica : function (tipus, req, res) {
            if (!req.params.id) {
                util.stdErr500("Missing 'id' parameter");
                return;
            }

            var page = req.query.page || 0;
            var limit = req.query.limit || 10;
            var offset = page * limit;

            dao.ContingutTematica.getByElementId(req.params.id, tipus, {limit: limit, offset: offset})
                .then(function (elements) {
                    if (!elements) util.reject("There aren't elements");
                    else return elements;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        }
	}
}
