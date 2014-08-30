/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {	
	var Llibre = sequelize.define('Llibre', {
		codi : {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        titol : {type:DataTypes.STRING(255),allowNull:false},
		descripcio : DataTypes.TEXT,
		index : DataTypes.STRING,
        public: {type: DataTypes.BOOLEAN, defaultValue:false},
        esborrat: {type: DataTypes.BOOLEAN, defaultValue:false},
        data	: { type : DataTypes.DATE, allowNull:true,validate : {isDate : true}},
        lang	: DataTypes.STRING(3),
        ruta : DataTypes.STRING
	}, {
		classMethods : {
			associate : function(models) {
                Llibre.belongsTo(models.Usuari)
                Llibre.hasMany(models.Comentari,{foreignKeyConstraint: true, allowNull:true})
                Llibre.hasMany(models.Puntuacio,{foreignKeyConstraint: true, allowNull:true})
                Llibre.hasMany(models.ContingutTematica,{foreignKeyConstraint: true, allowNull:true})
                Llibre.hasMany(models.ContingutGrup,{foreignKeyConstraint: true, allowNull:true})
			}
		}
	});
	
	return Llibre;
};