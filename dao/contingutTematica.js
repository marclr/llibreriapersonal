/**
 * New node file
 */


module.exports = function (db) {
    var dao = {};
    var W = require('when');

    var util = require('../util');

    dao.create = function (codi, tipus, tematiques, t) {
        var df = W.defer();
        if (!codi) throw {message: "Missing 'codi' attribute when creating a ContingutTematica"};
        else if (!tipus) throw {message: "Missing 'tipus' attribute when creating a ContingutTematica"};
        else if (!tematiques || tematiques.length<1) throw {message: "Missing 'tematica' attribute when creating a ContingutTematica"};
        var options = util.addTrans(t, {});

        var contingutTematica = {};
        contingutTematica.TipuId = tipus;
        if(tipus == 1) {
            contingutTematica.TextId = codi;
            contingutTematica.ImatgeId = null;
            contingutTematica.LlibreId = null;
        }
        else if(tipus == 2) {
            contingutTematica.TextId =null ;
            contingutTematica.ImatgeId = codi;
            contingutTematica.LlibreId = null;
        }
        else if(tipus==3) {
            contingutTematica.TextId = null;
            contingutTematica.ImatgeId = null;
            contingutTematica.LlibreId = codi;
        }

        var tematica = tematiques.split(',');
        for(var i=0; i<tematica.length;i++) {
            contingutTematica.TematicaId = tematica[i];
            db.ContingutTematica.create(contingutTematica, options).success(df.resolve).error(df.reject);
        }
        return df.promise;
    }

    dao.getById = function (codi, tipus) {
        var df = W.defer();
        if(tipus==1) {
            db.ContingutTematica.findAll({where: {TextId: codi}})
                .success(df.resolve).error(df.reject);
        }
        else if (tipus==2) {
            db.ContingutTematica.findAll({where: {ImatgeId: codi}})
                .success(df.resolve).error(df.reject);
        }
        else if (tipus==3){
            db.ContingutTematica.findAll({where: {LlibreId: codi}})
                .success(df.resolve).error(df.reject);
        }

        return df.promise;
    }

    dao.getByElementId = function (element, tipus, options, t) {
        var df = W.defer();
        if(tipus == 1)
            db.ContingutTematica.findAll({
                where: {TematicaId: element, tipuId: tipus},
                include: [{
                    model: db.Text,
                    where: {esborrat:0, public:1}
                    }],
                limit: options.limit,
                offset: options.offset
                })
                .success(df.resolve).error(df.reject);
        else if(tipus == 2)
            db.ContingutTematica.findAll({
                where: {TematicaId: element, tipuId: tipus},
                include: [{
                    model: db.Imatge,
                    where: {esborrat:0, public:1}
                    }],
                limit: options.limit,
                offset: options.offset
                })
                .success(df.resolve).error(df.reject);
        else if( tipus == 3)
            db.ContingutTematica.findAll({
                where: {TematicaId: element, tipuId: tipus},
                include: [{
                    model: db.Llibre,
                    where: {esborrat:0, public:1}
                    }],
                limit: options.limit,
                offset: options.offset
                })
                .success(df.resolve).error(df.reject);
        return df.promise;
    }

    return dao;
}