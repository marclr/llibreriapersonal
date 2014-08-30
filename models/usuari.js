/**
 * New node file
 */
//Taula de tipus d'usuari
//Taula de administració grup
module.exports = function(sequelize, DataTypes) {
	var Usuari = sequelize.define('Usuari', {
		login : {type: DataTypes.STRING(50), primaryKey:true},
        nom : DataTypes.STRING(255),
		cognom : DataTypes.STRING(255),
		adreca : DataTypes.STRING(512),
		ciutat: DataTypes.STRING(512),
		codi_postal: DataTypes.STRING(10), //http://www.barnesandnoble.com/help/cds2.asp?PID=8134
		pais: DataTypes.STRING(255),
		data_naixement : { type : DataTypes.DATE, allowNull:true,validate : {isDate : true}},
		sexe : DataTypes.BOOLEAN,
		email : {type: DataTypes.STRING(255), unique: true, allowNull:false, validate : {isEmail : true}},
		telefon : DataTypes.INTEGER(13),
        hash:DataTypes.STRING
	}, {
		classMethods : {
			associate : function(models) {
				Usuari.hasMany(models.Imatge, {keyType: DataTypes.STRING, foreignKeyConstraint: true, allowNull:false})
				Usuari.hasMany(models.Text, { keyType: DataTypes.STRING, foreignKeyConstraint: true, allowNull:false})
                Usuari.hasMany(models.Llibre, {keyType: DataTypes.STRING, foreignKeyConstraint: true, allowNull:false})
                Usuari.hasMany(models.Comentari, {keyType: DataTypes.STRING, foreignKeyConstraint: true, allowNull:false})
                Usuari.hasMany(models.Puntuacio, {keyType: DataTypes.STRING, foreignKeyConstraint: true, allowNull:false})
                Usuari.hasMany(models.UsuariGrup,{keyType: DataTypes.STRING, foreignKeyConstraint: true, allowNull:false, onDelete:'cascade'})
            }
		}
	});

	return Usuari;
};