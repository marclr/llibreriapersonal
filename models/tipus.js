/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {	
	var Tipus = sequelize.define('Tipus', {
		codi : {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        descripcio : {type: DataTypes.TEXT, allowNull:false}
	}, {
		classMethods : {
			associate : function(models) {
				Tipus.hasMany(models.Comentari,{foreignKeyConstraint: true})
				Tipus.hasMany(models.Puntuacio,{foreignKeyConstraint: true})
                Tipus.hasMany(models.ContingutTematica,{foreignKeyConstraint: true})
                Tipus.hasMany(models.ContingutGrup,{foreignKeyConstraint: true})
			}
		}
	});
	
	return Tipus;
};