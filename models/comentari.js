/**
 * New node file
 */


module.exports = function(sequelize, DataTypes) {	
	var Comentari = sequelize.define('Comentari', {
		codi : {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
		text : {type: DataTypes.TEXT, allowNull:false}
	}, {
		classMethods : {
			associate : function(models) {
                Comentari.belongsTo(models.Tipus)
                Comentari.belongsTo(models.Usuari)
                Comentari.belongsTo(models.Text)
                Comentari.belongsTo(models.Imatge)
                Comentari.belongsTo(models.Llibre)
			}
		}
	});
	
	return Comentari;
};