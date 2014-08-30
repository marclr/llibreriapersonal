/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {	
	var Grup = sequelize.define('Grup', {
		codi : {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        nom : {type: DataTypes.STRING(255), allowNull:false},
        descripcio : DataTypes.STRING(255)
	}, {
		classMethods : {
			associate : function(models) {
                Grup.hasMany(models.UsuariGrup,{foreignKeyConstraint: true})
                Grup.hasMany(models.ContingutGrup,{foreignKeyConstraint: true})
			}
		}
	});
	
	return Grup;
};