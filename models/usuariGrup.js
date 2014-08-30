/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {	
	var UsuariGrup = sequelize.define('UsuariGrup', {
	}, {
		classMethods : {
			associate : function(models) {
                UsuariGrup.belongsTo(models.Usuari)
                UsuariGrup.belongsTo(models.Grup)
			}
		}
	});
	
	return UsuariGrup;
};