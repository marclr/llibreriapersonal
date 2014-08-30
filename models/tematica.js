/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {	
	var Tematica = sequelize.define('Tematica', {
		codi : {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        nom : {type: DataTypes.STRING(255), allowNull:false},
        descripcio : DataTypes.TEXT
	}, {
		classMethods : {
			associate : function(models) {
                Tematica.hasMany(models.ContingutTematica,{foreignKeyConstraint: true})
			}
		}
	});
	
	return Tematica;
};