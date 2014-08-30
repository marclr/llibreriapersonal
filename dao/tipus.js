/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');
    var util = require('../util');

    dao.create = function (tipus, t) {
        if (!tipus.descripcio) throw {message: "Missing 'descripcio' attribute when creating a Tipus"};
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Tipus.create(tipus, options).success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.update = function (tipus, t) {
        var df = W.defer();
        db.Tipus.find(util.addTrans(t, {where: {codi: tipus.codi}}))
            .success( function (u) {
                if(u) {
                    u.updateAttributes(tipus)
                }
                else throw {message: "Missing 'tipus' not found"};
            })
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.delete = function (tipus, t) {
        var df = W.defer();
        if(!tipus) throw {message: "Missing 'tipus' not found"};
        else tipus.destroy();
        return df.promise;
    }

    dao.getById = function (id, t) {
        var df = W.defer();
        db.Tipus.find(util.addTrans(t, {where: {codi: id}}))
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.getPage = function (options) {
        var df = W.defer();
        db.Tipus.findAll({
            attributes: ['codi', 'descripcio'],
            limit: options.limit,
            offset: options.offset,
            order: 'codi'})
            .success(df.resolve)
            .error(df.reject);
        return df.promise;
    };

    return dao;
}