/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');
    var util = require('../util');

    dao.getByLogin = function (login, t) {
        var df = W.defer();
        db.Text.findAll({where: {UsuariId: login, esborrat: 0}, include: [db.ContingutTematica]})
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.getById = function (id, t) {
        var df = W.defer();
        db.Text.find({where: {codi: id}}).success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.create = function (text, t) {
        if (!text.UsuariId) throw {message: "Missing 'login' attribute when creating a Text"};
        else if (!text.titol) throw {message: "Missing 'titol' attribute when creating a Text"};
        else if (!text.descripcio) throw {message: "Missing 'descripcio' attribute when creating a Text"};
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Text.create(text, options).success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.update = function (text, t) {
        var df = W.defer();
        db.Text.find(util.addTrans(t, {where: {codi: text.codi, UsuariId: text.UsuariId}}))
            .success( function (u) {
                if(u) {
                    u.updateAttributes(text)
                }
                else throw {message: "Missing 'text' not found"};
            })
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.delete = function (text, t) {
        var df = W.defer();
        if(!text) throw {message: "Missing 'text' not found"};
        else text.updateAttributes({esborrat:1});
        return df.promise;
    }

    dao.getPage = function (options) {
        var df = W.defer();
        db.Text.findAll({
            attributes: ['codi', 'titol', 'descripcio', 'text','lang', 'usuariId'],
            where: {public: options.public,  esborrat: options.esborrat},
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
        db.Text.findAll(util.addTrans(t, {where: ["titol like ?", '%' + text + '%']}))
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    return dao;
}