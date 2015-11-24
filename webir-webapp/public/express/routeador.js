var Noticia = require('./models/noticia');
var Controller = require ('./controller');

module.exports = function(app) {

  // devolver todos los Personas
  app.get('/noticias', Controller.getNoticias);

  app.get('/', function(req, res){
	res.sendfile('./public/index.html');
  });

  //Defino las url por las cual se tendrá acceso a las funciones de la BD.
  app.get('/consultar_TodosSitios', Controller.consultar_TodosSitios);
  app.get('/consultarSitio_Nombre', Controller.consultarSitio_Nombre);
  app.get('/consultarSitio_Fechas', Controller.consultarSitio_Fechas);
  app.get('/consultarSitio_Palabra', Controller.consultarSitio_Palabra);

};
