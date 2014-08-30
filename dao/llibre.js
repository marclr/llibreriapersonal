/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');
    var util = require('../util');

    dao.getByLogin = function (login, t) {
        var df = W.defer();
        db.Llibre.findAll({where: {UsuariId: login, esborrat: 0}, include: [db.ContingutTematica]})
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.create = function (llibre, t) {
        if (!llibre.UsuariId) throw {message: "Missing 'login' attribute when creating a Book"};
        else if (!llibre.titol) throw {message: "Missing 'titol' attribute when creating a Book"};
        else if (!llibre.descripcio) throw {message: "Missing 'descripcio' attribute when creating a Book"};
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Llibre.create(llibre, options).success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.delete = function (llibre, t) {
        var df = W.defer();
        if(!llibre) throw {message: "Missing 'llibre' not found"};
        else llibre.updateAttributes({esborrat:1});
        return df.promise;
    }

    dao.getById = function (id, t) {
        var df = W.defer();
        db.Llibre.find({where: {codi: id}}) //[TODO] forcar un AVG del camp
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.update = function (llibre, t) {
        var df = W.defer();
        db.Llibre.find(util.addTrans(t, {where: {codi: llibre.codi, UsuariId: llibre.UsuariId}}))
            .success( function (u) {
                if(u) {
                    u.updateAttributes(llibre)
                    console.log(JSON.stringify(llibre));
                }
                else throw {message: "Missing 'llibre' not found"};
            })
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.getPage = function (options) {
        var df = W.defer();
        db.Llibre.findAll({
            attributes: ['codi', 'titol', 'descripcio', 'index', 'lang', 'ruta', 'UsuariId'],
            where: {public: options.public,  esborrat: options.esborrat},
            limit: options.limit,
            offset: options.offset,
            order: 'createdAt DESC'})
            .success(df.resolve)
            .error(df.reject);
        return df.promise;
    }

    dao.search = function(text, t) {
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Llibre.findAll(util.addTrans(t, {where: ["titol like ?", '%' + text + '%']}))
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    return dao;
}