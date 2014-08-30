/**
 * New node file
 */

module.exports = function(db) {
	var dao = {};
	var W = require('when');

    dao.Usuari = require('./usuari')(db);
    dao.Registrar = require('./registrar')(db);
    dao.Llibre = require('./llibre')(db);
    dao.Imatge = require('./imatge')(db);
    dao.Text = require('./text')(db);
    dao.Comentari = require('./comentari')(db);
    dao.Grup = require('./grup')(db);
    dao.UsuariGrup = require('./usuariGrup')(db);
    dao.Puntuacio = require('./puntuacio')(db);
    dao.Tipus = require('./tipus')(db);
    dao.Tematica = require('./tematica')(db);
    dao.ContingutTematica = require('./contingutTematica')(db);

    dao.create = function(Model, data) {
		var df = W.defer();
		Model.create(data).success(df.resolve).error(df.reject);
		return df.promise;
	}
    /**
     * Metode general per mostrar objectes per consola
     * @param o objecte a mostrar
     */
    dao.printObject = function (o) {
        var out = '';
        for (var p in o) {
            out += p + ': ' + o[p] + '\n';
        }
        console.log(out);
    }
	
    /**
     * Metode general per eliminar atributs amb el valor 'undefined' o 'null'
     * @param obj que conte valors undefined o null
     * @returns obj sense els atributs amb el valor undefined o null
     */
    dao.deleteUndefined = function(obj) {
        for(var o in obj) {
            if ( obj[o] === undefined || obj[o] === null) delete obj[o];
        }
        return obj;
    }

    /* Metode per comprovar si una adreça electronica te el format correcte o no
    * @param email string a comprovar
    * @returns boolea, cert si esta ben construit altrament fals
     */
    dao.isEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

	return dao;
}