/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');
    var util = require('../util');

    dao.create = function (usuari, t) {
        if (!usuari.login) throw {message: "Missing 'login' attribute when creating a User"};
        else if (!usuari.hash) throw {message: "Missing 'hash' attribute when creating a User"};
        else if (!usuari.email) throw {message: "Missing 'email' attribute when creating a User"};
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Usuari.create(usuari, options).success(df.resolve).error(df.reject);
        return df.promise;
    }

    return dao;
}