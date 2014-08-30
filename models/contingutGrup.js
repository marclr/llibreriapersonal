/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {	
	var ContingutGrup = sequelize.define('ContingutGrup', {
	}, {
		classMethods : {
			associate : function(models) {
                ContingutGrup.belongsTo(models.Tipus)
                ContingutGrup.belongsTo(models.Text)
                ContingutGrup.belongsTo(models.Imatge)
                ContingutGrup.belongsTo(models.Llibre)
                ContingutGrup.belongsTo(models.Grup)
			}
		}
	});
	
	return ContingutGrup;
};