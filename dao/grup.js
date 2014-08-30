/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');
    var util = require('../util');


    dao.create = function (grup, t) {
        // else if (!grup.nom) throw {message: "Missing 'login' attribute when creating a User"};
        if (!grup.nom) throw {message: "Missing: No es pot crear un grup sense nom."};
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Grup.create(grup, options).success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.update = function (grup, t) {
        var df = W.defer();
        db.Grup.find(util.addTrans(t, {where: {codi: grup.codi, login: grup.login}}))
            .success( function (u) {
                if(u) {//[TODO] Remove login
                    u.updateAttributes(grup)
                }
                else throw {message: "Missing 'imatge' not found"};
            })
            .success(df.resolve).error(df.reject);
        return df.promise;
    }
    return dao;
}