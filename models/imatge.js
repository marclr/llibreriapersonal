/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {	
	var Imatge = sequelize.define('Imatge', {
		codi : {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        titol : {type: DataTypes.STRING(255), allowNull:false},
		descripcio : DataTypes.TEXT,
        public: {type: DataTypes.BOOLEAN, defaultValue:false},
        esborrat: {type: DataTypes.BOOLEAN, defaultValue:false},
		data_creacio : { type : DataTypes.DATE, allowNull:true,validate : {isDate : true}},
		height : DataTypes.INTEGER,
		width : DataTypes.INTEGER,
		ruta : {type: DataTypes.STRING, allowNull:false}
	}, {
		classMethods : {
			associate : function(models) {
                Imatge.belongsTo(models.Usuari)
				Imatge.hasMany(models.Comentari,{foreignKeyConstraint: true, allowNull:true})
				Imatge.hasMany(models.Puntuacio,{foreignKeyConstraint: true, allowNull:true})
                Imatge.hasMany(models.ContingutTematica,{foreignKeyConstraint: true, allowNull:true})
                Imatge.hasMany(models.ContingutGrup,{foreignKeyConstraint: true, allowNull:true})
			}
		}
	});
	
	return Imatge;
};