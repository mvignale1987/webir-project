var Noticia = require('./models/noticia');

// Obtiene todos los objetos Persona de la base de datos
exports.getNoticias = function (req, res){
	Noticia.find(
		function(err, noticias) {
			if (err) {
        res.send(err)
        }
			res.json(noticias); // devuelve todas las Noticias en JSON
			}
		);
}
