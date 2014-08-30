/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');
    var util = require('../util');


    dao.getAverage = function (tipus, id, t) {
        var df = W.defer();
        if(tipus == 1) {
            db.Puntuacio.find({
                attributes: [db.sequelize.fn('AVG', db.sequelize.col('puntuacio'))],
                where: {tipuId: tipus, TextId: id}}).success(df.resolve).error(df.reject);
        }
        else if( tipus == 2)  {
            db.Puntuacio.find({
                attributes: [db.sequelize.fn('AVG', db.sequelize.col('puntuacio'))],
                where: {tipuId: tipus, ImatgeId: id}}).success(df.resolve).error(df.reject);
        }
        else if ( tipus == 3) {
            db.Puntuacio.find({
                attributes: [db.sequelize.fn('AVG', db.sequelize.col('puntuacio'))],
                where: {tipuId: tipus, LlibreId: id}}).success(df.resolve).error(df.reject);
        }
        return df.promise;
    }

    dao.create = function (puntuacio, t) {
        if (!puntuacio.puntuacio) throw {message: "Missing: No es pot avaluar sense escriure una puntuació"};
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Puntuacio.create(puntuacio, options).success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.update = function (puntuacio, t) {
        var df = W.defer();
        console.log(puntuacio)
        if(puntuacio.TextId !=null){
            db.Puntuacio.find(util.addTrans(t, {where: {TextId: puntuacio.TextId, UsuariId: puntuacio.UsuariId}}))
            .success( function (u) {
                if(u!==null) {
                    u.updateAttributes(puntuacio)
                }
                else dao.create(puntuacio,t);
            })
            .success(df.resolve).error(df.reject);
        }
        if(puntuacio.ImatgeId !=null){
            db.Puntuacio.find(util.addTrans(t, {where: {ImatgeId: puntuacio.ImatgeId, UsuariId: puntuacio.UsuariId}}))
            .success( function (u) {
                if(u!==null) {
                    u.updateAttributes(puntuacio)
                }
                else dao.create(puntuacio,t);
            })
            .success(df.resolve).error(df.reject);
        }
        if(puntuacio.LlibreId !=null){
            db.Puntuacio.find(util.addTrans(t, {where: {LlibreId: puntuacio.LlibreId, UsuariId: puntuacio.UsuariId}}))
            .success( function (u) {
                if(u!==null) {
                    u.updateAttributes(puntuacio)
                }
                else dao.create(puntuacio,t);
            })
            .success(df.resolve).error(df.reject);
        }
        return df.promise;
    }

    return dao;
}