/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');
    var util = require('../util');

    dao.getByLogin = function (login, t) {
        var df = W.defer();
        db.Comentari.findAll({where: {UsuariId: login}})
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.getByElementId = function (element, tipus, t) {
        var df = W.defer();
        if(tipus == 1)
            db.Comentari.findAll({where: {TextId: element, tipuId: tipus},order:'createdAt DESC'})
                .success(df.resolve).error(df.reject);
        else if(tipus == 2)
            db.Comentari.findAll({where: {ImatgeId: element, tipuId: tipus},order:'createdAt DESC'})
                .success(df.resolve).error(df.reject);
        else if( tipus == 3)
            db.Comentari.findAll({where: {LlibreId: element, tipuId: tipus},order:'createdAt DESC'})
                .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.create = function (comentari, t) {
        if (!comentari.text) throw {message: "Falta escriure el cos del comentari"};
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Comentari.create(comentari, options).success(df.resolve).error(df.reject);
        return df.promise;
    }

    return dao;
}