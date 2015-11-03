var Noticia = require('./models/noticia');

// Obtiene todos los objetos Persona de la base de datos
exports.getNoticias = function (req, res){
    var queryParams = {};
    if (req.query.sitio)
      queryParams.sitio = req.query.sitio;
    if (req.query.palabra)
      queryParams.$text = { $search: req.query.palabra.replace(/ /g,"\" \"") };
    queryParams.fecha = {};
    if (req.query.fechaDesde){
      var fechaDesde = req.query.fechaDesde.split("-");
      queryParams.fecha.$gte = new Date(fechaDesde[0], fechaDesde[1], fechaDesde[2]);

    }if (req.query.fechaHasta) {
      var fechaHasta = req.query.fechaHasta.split("-");
      queryParams.fecha.$lte = new Date(fechaHasta[0], fechaHasta[1], fechaHasta[2]);
    }

    Noticia.find(queryParams,
  		function(err, noticia) {
  			if (err) {
          res.send(err)
        }
  			res.json(noticia); // devuelve todas las Noticias en JSON
  		}
  	);

}
