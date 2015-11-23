var Noticia = require('./models/noticia');

exports.consultar_TodosSitios = function (req, res){
	//Devuelve todas las noticias de todos los sitios.
	sitios = [{
					nombre: 'ElPais',
					id:'1',
					news: [
						{
						titulo: "Noticia Pais 1",
						fecha: "27-10-15",
						url:'http://axelhzf.com/js-training-doc/angular.html',
						resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 1</h2> <p>Resumen Pais 1</p></div>',
						},
						{
						titulo: "Noticia Pais 2",
						fecha: "27-10-15",
						url:'http://axelhzf.com/js-training-doc/angular.html',
						resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 2</h2> <p>Resumen Pais 2</p></div>',
						},
						{
						titulo: "Noticia Pais 3",
						fecha: "27-10-15",
						url:'http://www.elpais.com.uy/informacion/no-le-podremos-vender-carne.html',
						resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 3</h2> <p>Resumen Pais 3</p></div>',
						},
						{
						titulo: "Noticia Pais 4",
						fecha: "27-10-15",
						url:'http://axelhzf.com/js-training-doc/angular.html',
						resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 4</h2> <p>Resumen Pais 4</p></div>',
						},
						{
						titulo: "Noticia Pais 5",
						fecha: "27-10-15",
						url:'http://axelhzf.com/js-training-doc/angular.html',
						resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 5</h2> <p>Resumen Pais 5</p></div>',
						},
						{
						titulo: "Noticia Pais 6",
						fecha: "27-10-15",
						url:'http://axelhzf.com/js-training-doc/angular.html',
						resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 6</h2> <p>Resumen Pais 6</p></div>',
						}
					]},
					{
						nombre: 'ElObservador',
						id:'2',
						news: [
							{
							titulo: "Noticia Observador 1",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 1</h2> <p>Resumen Observador 1</p></div>',
							},
							{
							titulo: "Noticia Observador 2",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 2</h2> <p>Resumen Observador 2</p></div>',
							},
							{
							titulo: "Noticia Observador 3",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 3</h2> <p>Resumen Observador 3</p></div>',
							},
							{
							titulo: "Noticia Observador 4",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 4</h2> <p>Resumen Observador 4</p></div>',
							},
							{
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 5</h2> <p>Resumen Observador 5</p></div>',
							},
							{
							titulo: "Noticia Observador 6",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 6</h2> <p>Resumen Observador 6</p></div>',
							},
							{
							titulo: "Noticia Observador 7",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 7</h2> <p>Resumen Observador 7</p></div>',
							}
						]
					},
					{
						nombre: 'Subrayado',
						id:'3',
						news: [
							{
							titulo: "Noticia Subrayado 1",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Subrayado 1</h2> <p>Resumen Subrayado 1</p></div>',
							},
							{
							titulo: "Noticia Subrayado 2",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Subrayado 2</h2> <p>Resumen Subrayado 2</p></div>',
							}
						]
					}
				];
	//Envia un JSon con el resultado.
	res.json(sitios);
};


exports.consultarSitio_Nombre = function (req, res){
	/*
		var queryParams = {};
		if (req.query.sitio){
			queryParams.sitio = req.query._nombreSitio;
		}
		
		Noticia.find(queryParams, //Paso el parametro previamente cargado en el if anterior.
			function(err, sitio) { //decia noticia
				if (err) {
				  res.send(err)
				}
				res.json(sitio); // devuelve todas las Noticias en JSON
			}
		);

	*/
	var sitios = [];
	
	if(req.query._nombreSitio == 'ElPais')
		{
			sitios = [{
						nombre: 'ElPais',
						id:'1',
						news: [
							{
							id: 'ElPais_n_1',
							titulo: "Noticia Pais 1",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 1</h2> <p>Resumen Pais 1</p></div>',
							},
							{
							id:'ElPais_n_2',
							titulo: "Noticia Pais 2",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 2</h2> <p>Resumen Pais 2</p></div>',
							},
							{
							id: 'ElPais_n_3',
							titulo: "Noticia Pais 3",
							fecha: "27-10-15",
							url:'http://www.elpais.com.uy/informacion/no-le-podremos-vender-carne.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 3</h2> <p>Resumen Pais 3</p></div>',
							},
							{
							id: 'ElPais_n_4',
							titulo: "Noticia Pais 4",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 4</h2> <p>Resumen Pais 4</p></div>',
							},
							{
							id: 'ElPais_n_5',
							titulo: "Noticia Pais 5",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 5</h2> <p>Resumen Pais 5</p></div>',
							},
							{
							id: 'ElPais_n_6',
							titulo: "Noticia Pais 6",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 6</h2> <p>Resumen Pais 6</p></div>',
							}
						]
					}];
		}
		else if(req.query._nombreSitio == 'ElObservador')
		{
			sitios = [{
						nombre: 'ElObservador',
						id:'2',
						news: [
							{
							id: 'ElObservador_n_1',
							titulo: "Noticia Observador 1",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 1</h2> <p>Resumen Observador 1</p></div>',
							},
							{
							id: 'ElObservador_n_2',
							titulo: "Noticia Observador 2",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 2</h2> <p>Resumen Observador 2</p></div>',
							},
							{
							id: 'ElObservador_n_3',
							titulo: "Noticia Observador 3",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 3</h2> <p>Resumen Observador 3</p></div>',
							},
							{
							id: 'ElObservador_n_4',
							titulo: "Noticia Observador 4",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 4</h2> <p>Resumen Observador 4</p></div>',
							},
							{
							id: 'ElObservador_n_5',
							titulo: "Noticia Observador 5",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 5</h2> <p>Resumen Observador 5</p></div>',
							},
							{
							id: 'ElObservador_n_6',
							titulo: "Noticia Observador 6",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 6</h2> <p>Resumen Observador 6</p></div>',
							},
							{
							id: 'ElObservador_n_7',
							titulo: "Noticia Observador 7",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 7</h2> <p>Resumen Observador 7</p></div>',
							}
						]
					}];
			
		}else if(req.query._nombreSitio == 'Subrayado')
		{
			sitios = [{
						nombre: 'Subrayado',
						id:'3',
						news: [
							{
							id: 'Subrayado_n_1',
							titulo: "Noticia Subrayado 1",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Subrayado 1</h2> <p>Resumen Subrayado 1</p></div>',
							},
							{
							id: 'Subrayado_n_2',
							titulo: "Noticia Subrayado 2",
							fecha: "27-10-15",
							url:'http://axelhzf.com/js-training-doc/angular.html',
							resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Subrayado 2</h2> <p>Resumen Subrayado 2</p></div>',
							}
						]
					}];
		}
	//Envia un JSon con el resultado.
	res.json(sitios);
}

exports.consultarSitio_Fechas = function (req, res){
	/*
		var queryParams = {};
		queryParams.fecha = {};
		if (req.query.fechaDesde){
		  var fechaDesde = req.query.fechaDesde.split("-");
		  queryParams.fecha.$gte = new Date(fechaDesde[0], fechaDesde[1], fechaDesde[2]);

		}if (req.query.fechaHasta) {
		  var fechaHasta = req.query.fechaHasta.split("-");
		  queryParams.fecha.$lte = new Date(fechaHasta[0], fechaHasta[1], fechaHasta[2]);
		}
		
		Noticia.find(queryParams, //Paso el parametro previamente cargado en el if anterior.
			function(err, sitio) { //decia noticia
				if (err) {
				  res.send(err)
				}
				res.json(sitio); // devuelve todas las Noticias en JSON
			}
		);

	*/
}

exports.consultarSitio_Palabra = function (req, res){
	/*
		var queryParams = {};
		if (req.query.palabra)
			queryParams.$text = { $search: req.query.palabra.replace(/ /g,"\" \"") };
		
		Noticia.find(queryParams, //Paso el parametro previamente cargado en el if anterior.
			function(err, sitio) { //decia noticia
				if (err) {
				  res.send(err)
				}
				res.json(sitio); // devuelve todas las Noticias en JSON
			}
		);

	*/
}

/*
Lo de Mauricio.

// Obtiene todos los objetos Noticia de la base de datos
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
*/