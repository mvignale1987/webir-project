var Noticia = require('./models/noticia');
var Controller = require ('./controller');

module.exports = function(app) {

	// devolver todos los Personas
	app.get('/noticias', Controller.getNoticias);
	// // Crear una nueva Persona
	// app.post('/noticia', Controller.setNoticia);
	// // Modificar los datos de una Persona
	// app.put('/api/persona/:persona_id', Controller.updatePersona);
	// // Borrar una Persona
	// app.delete('/api/persona/:persona_id', Controller.removePersona);

  app.get('/', function(req, res){
  	res.sendfile('./public/index.html');
  });
};
