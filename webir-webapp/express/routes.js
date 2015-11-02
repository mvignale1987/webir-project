var Noticia = require('./models/noticia');
var Controller = require ('./controller');

module.exports = function(app) {

	// devolver todos los Personas
	app.get('/noticias', Controller.getNoticias);
	
  app.get('/', function(req, res){
  	res.sendfile('./public/index.html');
  });
};
