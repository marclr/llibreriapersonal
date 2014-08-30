/**
 * New node file
 */

//Dividir puntuacio http://stackoverflow.com/questions/2892705/how-do-i-model-product-ratings-in-the-database
module.exports = function(sequelize, DataTypes) {	
	var Puntuacio = sequelize.define('Puntuacio', {
		codi : {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        puntuacio	: { type : DataTypes.INTEGER}
	}, {
		classMethods : {
			associate : function(models) {
                Puntuacio.belongsTo(models.Tipus)
                Puntuacio.belongsTo(models.Usuari)
                Puntuacio.belongsTo(models.Text)
                Puntuacio.belongsTo(models.Imatge)
                Puntuacio.belongsTo(models.Llibre)
			}
		}
	});
	
	return Puntuacio;
};