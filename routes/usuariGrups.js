/*
 * GET users listing.
 */

module.exports = function(db) {

	var util = require('../util');
	var dao = require('../dao')(db);

	return {
		getByLogin : function (req, res) {
            if (!req.params.login) {
                util.stdErr500("Missing 'login' parameter");
                return;
            }

            dao.UsuariGrup.getByLogin(req.params.login)
                .then(function (grups) {
                    if (!grups) util.reject("The user hasn't joined any grup");
                    else return grups;
                })
                .then(util.stdSeqSuccess.genFuncLeft(res), util.stdSeqError.genFuncLeft(res))
                .done();
        }
	}
}
