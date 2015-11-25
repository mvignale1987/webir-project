var Noticia = require('./models/noticia');

// Obtiene todos los objetos Noticia de la base de datos
exports.getNoticias = function (req, res){
    var queryParams = {};
    if (req.query.sitio)
      queryParams.sitio = req.query.sitio;
    if (req.query.palabra && req.query.palabra.length > 0)
      queryParams.$text = { $search: '"'+req.query.palabra.replace(/ /g,"\" \"")+'"' };
    if (req.query.fechaDesde){
      queryParams.fecha = {};
      queryParams.fecha.$gte = new Date(req.query.fechaDesde);

    }if (req.query.fechaHasta) {
      if (!queryParams.fecha)
        queryParams.fecha =  {}
      queryParams.fecha.$lte = new Date(req.query.fechaHasta);
    }
    var queryAggregate = [];
    if (Object.keys(queryParams).length  > 0)
      queryAggregate.push({
        $match : queryParams
      });
    queryAggregate.push({
      $group: {
        _id : "$sitio",
        news: {
          $push:"$$ROOT"
        }
      }
    });
    console.log(queryAggregate);
    Noticia.aggregate(queryAggregate,
  		function(err, noticia) {
  			if (err) {
          res.send(err)
        }
  			res.json(noticia); // devuelve todas las Noticias en JSON
  		}
  	);

}
