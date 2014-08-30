/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');
    var util = require('../util');

    dao.getByLogin = function (login, t) {
        var df = W.defer();
        db.Usuari.find(util.addTrans(t, {where: {login: login}}))
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.getByEmail = function (email, t) {
        var df = W.defer();
        db.Usuari.find(util.addTrans(t, {where: {email: email}}))
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.getHash = function (login, t) {
        var df = W.defer();
        db.Usuari.find(util.addTrans(t, {
            attributes: ['hash'],
            where: {login: login}
        }))
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.update = function (usuari, t) {
        var df = W.defer();
        db.Usuari.find(util.addTrans(t, {
            //attributes: ['login', 'nom', 'cognom', 'email', 'pais', 'sexe', 'data_naixement'],
            where: {login: usuari.login}}))
            .success( function (u) {
                if(u) u.updateAttributes(usuari)
                else throw {message: "Missing 'usuari' not found"};
            })
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.delete = function (usuari, t) {
        var df = W.defer();
        if(!usuari) throw {message: "Missing 'usuari' not found"};
        else usuari.destroy();
        return df.promise;
    }

    dao.getPage = function (options) {
        var df = W.defer();
        db.Usuari.findAll({
            attributes: ['login', 'nom', 'cognom', 'email', 'pais', 'sexe', 'data_naixement'],
            limit: options.limit,
            offset: options.offset,
            order: 'createdAt DESC'})
            .success(df.resolve)
            .error(df.reject);
        return df.promise;
    };

    dao.search = function(text, t) {
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Usuari.findAll(util.addTrans(t, {where: ["login like ?", '%' + text + '%']}))
            .success(df.resolve).error(df.reject);
        return df.promise;
    }


    return dao;
}