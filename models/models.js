var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar la factoría de ORM que se va a usar
var Sequelize = require('sequelize');

// Crear el objeto ORM e indicarle que use la BBDD SQLite
var sequelize = new Sequelize(DB_name, user, pwd,
	{ dialect: protocol,
	  protocol: protocol,
	  port: port,
	  host: host,
	  storage: storage, //solo SQLite (.env)
	  omitNull: true    // solo Postgres
	}
);

// Importar la definición de la tabla Quiz desde quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportar definición de tabla Quiz para utilizarla en otras partes de la aplicación
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa la tabla de preguntas en BBDD
// y then(..) ejecuta el manejador una vez creada la tabla
sequelize.sync().then(function() {
	Quiz.count().then(function (count){
		if (count === 0) { // la tabla se inicializa solo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia', respuesta: 'Roma'});
			Quiz.create({ pregunta: 'Capital de Portugal', respuesta: 'Lisboa'})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});