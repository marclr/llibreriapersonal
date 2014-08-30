/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');
    var util = require('../util');

    dao.getByLogin = function (login, t) {
        var df = W.defer();
        db.Imatge.findAll({where: {UsuariId: login, esborrat: 0}, include: [db.ContingutTematica]})
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.getById = function (id, t) {
        var df = W.defer();
        db.Imatge.find({where: {codi: id}})
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.create = function (imatge, t) {
       if (!imatge.UsuariId) throw {message: "Missing 'login' attribute when creating a Imatge"};
       else if (!imatge.ruta) throw {message: "Missing 'ruta' attribute when creating a Imatge"};
       else if (!imatge.titol) throw {message: "Missing 'titol' attribute when creating a Imatge"};
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Imatge.create(imatge, options).success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.update = function (imatge, t) {
        var df = W.defer();
        db.Imatge.find(util.addTrans(t, {where: {codi: imatge.codi, UsuariId: imatge.UsuariId}}))
            .success( function (u) {
                if(u) {
                    u.updateAttributes(imatge)
                }
                else throw {message: "Missing 'imatge' not found"};
            })
            .error(function () {throw {message: "Missing 'imatge' not found"}; })
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.delete = function (imatge, t) {
        var df = W.defer();
        if(!imatge) throw {message: "Missing 'imatge' not found"};
        else imatge.updateAttributes({esborrat:1});
        return df.promise;
    }

    dao.getPage = function (options) {
        var df = W.defer();
        db.Imatge.findAll({
            attributes: ['codi', 'titol', 'descripcio', 'usuariId', 'ruta'],
            where: {esborrat:options.esborrat,public:options.public},
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
        db.Imatge.findAll(util.addTrans(t, {where: ["titol like ?", '%' + text + '%']}))
            .success(df.resolve).error(df.reject);
        return df.promise;
    }

    dao.getMaxId = function(t) {
        var df = W.defer();
        var options = util.addTrans(t, {});
        db.Imatge.find({
            attributes: [ db.sequelize.fn('MAX', db.sequelize.col('codi'))],
        }).success(df.resolve).error(df.reject);
        return df.promise;
    }

    return dao;
}