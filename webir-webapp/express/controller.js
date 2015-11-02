var Noticia = require('./models/noticia');

// Obtiene todos los objetos Persona de la base de datos
exports.getNoticias = function (req, res){
  // Aca hay que fijarse solamente en los query.parameters y ver
  // si existen, para ver que find hacemos, una papita: EXAMPLE
  // res.send("tagId is set to " + req.query.tagId);

  Noticia.find(
		function(err, noticia) {
			if (err) {
        res.send(err)
      }
			res.json(noticia); // devuelve todas las Noticias en JSON
		}
	);
}
