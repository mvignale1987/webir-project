var Noticia = require('./models/noticia');

// Obtiene todos los objetos Persona de la base de datos
exports.getNoticias = function (req, res){
	Noticia.find(
		function(err, noticia) {
			if (err) {
        res.send(err)
        }
			res.json(noticia); // devuelve todas las Noticias en JSON
			}
		);
}
