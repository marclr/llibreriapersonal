/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {	
	var Text = sequelize.define('Text', {
		codi : {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        titol : {type: DataTypes.STRING(255), allowNull:false},
		descripcio : DataTypes.TEXT,
		text : DataTypes.TEXT,
        public: {type: DataTypes.BOOLEAN, defaultValue:false},
        esborrat: {type: DataTypes.BOOLEAN, defaultValue:false},
        data	: { type : DataTypes.DATE, allowNull:true,validate : {isDate : true}},
        lang	: DataTypes.STRING(3)
	}, {
		classMethods : {
			associate : function(models) {
                Text.belongsTo(models.Usuari)
                Text.hasMany(models.Comentari,{foreignKeyConstraint: true, allowNull:true})
                Text.hasMany(models.Puntuacio,{foreignKeyConstraint: true, allowNull:true})
                Text.hasMany(models.ContingutTematica,{foreignKeyConstraint: true, allowNull:true})
                Text.hasMany(models.ContingutGrup,{foreignKeyConstraint: true, allowNull:true})
			}
		}
	});
	
	return Text;
};