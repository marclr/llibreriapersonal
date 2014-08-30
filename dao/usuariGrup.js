/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');
    var util = require('../util');

    dao.getByLogin = function (login, t) {
        var df = W.defer();
        db.UsuariGrup.findAll({include: [ db.Grup ], where: {UsuariId: login}})
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    return dao;
}