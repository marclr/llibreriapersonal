/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {	
	var ContingutTematica = sequelize.define('ContingutTematica', {
	}, {
		classMethods : {
			associate : function(models) {
                ContingutTematica.belongsTo(models.Tipus)
                ContingutTematica.belongsTo(models.Text)
                ContingutTematica.belongsTo(models.Imatge)
                ContingutTematica.belongsTo(models.Llibre)
                ContingutTematica.belongsTo(models.Tematica)
			}
		}
	});
	
	return ContingutTematica;
};