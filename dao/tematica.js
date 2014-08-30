/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');
    var util = require('../util');

    dao.create = function (tematica, t) {
        if (!tematica.nom) throw {message: "Missing 'titol' attribute when creating a Tematica"};
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Tematica.create(tematica, options).success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.update = function (tematica, t) {
        var df = W.defer();
        db.Tematica.find(util.addTrans(t, {where: {codi: tematica.codi}}))
            .success( function (u) {
                if(u) {
                    u.updateAttributes(tematica)
                }
                else throw {message: "Missing 'tematica' not found"};
            })
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.delete = function (tematica, t) {
        var df = W.defer();
        if(!tematica) throw {message: "Missing 'tematica' not found"};
        else tematica.destroy();
        return df.promise;
    }

    dao.getById = function (id, t) {
        var df = W.defer();
        db.Tematica.find(util.addTrans(t, {where: {codi: id}}))
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.getPage = function (options) {
        var df = W.defer();
        db.Tematica.findAll({
            attributes: ['codi', 'nom', 'descripcio'],
            limit: options.limit,
            offset: options.offset,
            order: 'createdAt DESC'})
            .success(df.resolve)
            .error(df.reject);
        return df.promise;
    };

    dao.getByElementId = function (element, tipus, t) {
        var df = W.defer();
        if(tipus == 1)
            db.Tematica.findAll({where: {TematicaId: element, tipuId: tipus}})
                .success(df.resolve).error(df.reject);
        else if(tipus == 2)
            db.Tematica.findAll({where: {TematicaId: element, tipuId: tipus}})
                .success(df.resolve).error(df.reject);
        else if( tipus == 3)
            db.Tematica.findAll({where: {TematicaId: element, tipuId: tipus}})
                .success(df.resolve).error(df.reject);
        return df.promise;
    }

    return dao;
}