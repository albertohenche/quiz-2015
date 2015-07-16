var path = require('path');

// Cargar la factoría de ORM que se va a usar
var Sequelize = require('sequelize');

// Crear el objeto ORM e indicarle que use la BBDD SQLite
var sequelize = new Sequelize(null, null, null, {dialect: "sqlite", storage: "quiz.sqlite"});

// Importar la definición de la tabla Quiz desde quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportar definición de tabla Quiz para utilizarla en otras partes de la aplicación
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa la tabla de preguntas en BBDD
// y success(..) ejecuta el manejador una vez creada la tabla
sequelize.sync().success(function() {
	Quiz.count().success(function (count){
		if (count === 0) { // la tabla se inicializa solo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia', respuesta: 'Roma'})
			.success(function(){console.log('Base de datos inicializada')});
		};
	});
});