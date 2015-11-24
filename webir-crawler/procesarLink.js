var request = require("request"),
    cheerio = require("cheerio");
    mongoose = require('mongoose');

var Noticia = mongoose.model('Noticia', {
    	titulo: String,
    	URL: String,
    	sitio: String,
      document: String,
    	fecha: Date
    });

function obtenerMes (mes){
	var ret = 0;
	switch (mes.toLowerCase()){
		case 'ene':	ret = 0;
				break;
		case 'feb':	ret = 1;
				break;
		case 'mar':	ret = 2;
				break;
		case 'abr':	ret = 3;
				break;
		case 'may':	ret = 4;
				break;
		case 'jun':	ret = 5;
				break;
		case 'jul':	ret = 6;
				break;
		case 'ago':	ret = 7;
				break;
		case 'set':	ret = 8;
				break;
		case 'oct':	ret = 9;
				break;
		case 'nov':	ret = 10;
				break;
		case 'dic':	ret = 11;
				break;

	}
	return ret;
}

function fechaElPais (fecha){
	//vie nov 20 2015 18:45    ----  13 nov 2015
	//console.log('fecha: '+ fecha);
	var rfec = null;
	if (isNaN(fecha.substring(0,1))){
		var afec = fecha.split(" ");
		var mes = obtenerMes(afec[1]);
		var dia = afec[2];
		var anio = afec[3];
		var ahora = afec[4].split(":");
		var hora = ahora[0];
		var minutos = ahora[1];
		var segundos = 00;
		//console.log('fecha: '+ dia + '/' + mes + '/' + anio + ' ' + hora + ':' + minutos + ':' + segundos);
		rfec = new Date(anio,mes,dia,hora,minutos,segundos);
	}else{
		var afec = fecha.split(" ");
		if (afec.length > 1){
			var mes = obtenerMes(afec[1]);
			var dia = afec[0];
			var anio = afec[2];
			var segundos = 00;
			//console.log('fecha: '+ dia + '/' + mes + '/' + anio);
			rfec = new Date(anio,mes,dia);
		}else{
			//console.log('fecha es null');
		}
	}

	return rfec;
}

function fechaRepublica (fecha){
	//Jueves 19 noviembre de 2015 , 11:34pm
	//console.log('fecha: '+ fecha);
	var rfec = null;
	var afec = fecha.split(" ");
	if (afec.length > 1){
		var mes = obtenerMes(afec[2].substring(0,3));
		var dia = afec[1];
		var anio = afec[4];
		var ahora = afec[6].split(":");
		var hora = parseInt(ahora[0]);
		var minutos = ahora[1].substring(0,2);
		var ampm = ahora[1].substring(2,5);
		if (ampm == 'pm'){
			hora += 12;
		}
		var segundos = 00;
		//console.log('fecha: '+ dia + '/' + mes + '/' + anio + ' ' + hora + ':' + minutos + ':' + segundos + ' ampm: ' + ampm);
		rfec = new Date(anio,mes,dia,hora,minutos,segundos);
	}else{
		//console.log('fecha es null');
	}

	return rfec;
}

function fechaElObservador (fecha){
	//Noviembre 20, 2015 12:04
	//console.log('fecha: '+ fecha);
	var rfec = null;
	//console.log(fechase);
	var afec = fecha.split(" ");
	//console.log(afec.length);
	if (afec.length > 1){
		var mes = obtenerMes(afec[0].substring(0,3));
		var dia = afec[1].substring(0,afec[1].length-1);
		var anio = afec[2];
		var ahora = afec[3].split(":");
		var hora = parseInt(ahora[0]);
		var minutos = ahora[1];
		var segundos = 00;
		//console.log('fecha: '+ dia + '/' + mes + '/' + anio + ' ' + hora + ':' + minutos + ':' + segundos);
		rfec = new Date(anio,mes,dia,hora,minutos,segundos);
	}else{
		//console.log('fecha es null');
	}

	return rfec;
}

function fechaTelam (fecha){
	//20/11/2015  14:23  ---- 20.11.2015
	//console.log('fecha: '+ fecha);
	var rfec = null;
	//console.log(fechase);
	var afec = fecha.split(" ");
	//console.log(afec.length);
	if (afec.length > 1){
		var afecha = afec[0].split("/");
		var mes = parseInt(afecha[1])-1;
		var dia = afecha[0];
		var anio = afecha[2];
		var ahora = afec[1].split(":");
		var hora = ahora[0];
		var minutos = ahora[1];
		var segundos = 00;
		//console.log('fecha: '+ dia + '/' + mes + '/' + anio + ' ' + hora + ':' + minutos + ':' + segundos);
		rfec = new Date(anio,mes,dia,hora,minutos,segundos);
	}else if (afec.length == 1){
		var afecha = afec[0].split(".");
		var mes = parseInt(afecha[1])-1;
		var dia = afecha[0];
		var anio = afecha[2];
		rfec = new Date(anio,mes,dia);
	}else{
		//console.log('fecha es null');
	}

	return rfec;
}

function quitarTabs (texto){
	return texto.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
}

var procesarLinkElPais = function(link){
	request(link, function (error, response, body) {
		console.log(link);
		if (body!=null){
			var $1 = cheerio.load(body);

      var noticia = new Noticia({
          sitio : 'ElPais',
          titulo : quitarTabs($1('.title').children().text()),
          URL : link,
          document : quitarTabs($1('.pc').children().first().text()),
          fecha: fechaElPais(quitarTabs ($1('.published').text()))
      });
      noticia.save(function (err, data) {
          if (err)
              console.log(err);
          else
              console.log('salve noticia EL Pais');
      });
		}else{
			//console.log('FALLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
			setTimeout(procesarLinkElPais(link),10000);
		}
		console.log('---------------------------------------------------');
	});
};

var procesarLinkElObservador = function(link){
	request(link, function (error, response, body) {
		console.log(link);
		if (body!=null){

			var $1 = cheerio.load(body);

      var noticia = new Noticia({
          sitio : 'Observa',
          titulo : quitarTabs($1('.detail-title').text()),
          URL : link,
          document : quitarTabs($1('.detail-preview').first().text()),
          fecha: fechaElObservador(quitarTabs ($1('.date-wrapper').text()))
        });

      noticia.save(function (err, data) {
          if (err)
              console.log(err);
          else
              console.log('salve noticia Observa');
      });
		}else{
			setTimeout(procesarLinkElObservador(link),10000);
		}
		console.log('---------------------------------------------------');
	});
}

var procesarLinkRepublica = function(link){
	request(link, function (error, response, body) {
		console.log(link);
		if (body!=null){

			var $1 = cheerio.load(body);

      var noticia = new Noticia({
          sitio : 'Republica',
          titulo : quitarTabs($1('.entry-title').text()),
          URL : link,
          document : quitarTabs ($1('.excerpt_single').children().first().text()),
          fecha: fechaRepublica(quitarTabs ($1('.updated').text()))
        });
        noticia.save(function (err, data) {
          if (err)
              console.log(err);
          else
              console.log('salve noticia Republica');
        });
      }else{
			//console.log('FALLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
			setTimeout(procesarLinkRepublica(link),10000);
		}
		console.log('---------------------------------------------------');
	});
}

var procesarLinkTelam = function(link){
	request(link, function (error, response, body) {
		console.log(link);
		if (body!=null){
			//console.log('llegoooooo1111 '+body+'\n');
			//console.log('llegoooooo222 '+response+'\n');
			var $1 = cheerio.load(body);
			//console.log('EMPIEZA-TITULO-TE\n');
			console.log(quitarTabs($1('.title').text()));
			//console.log('TERMINA-TITULO-TE\n');
			//console.log('EMPIEZA-DESCRIPCION-TE\n');
			console.log(quitarTabs ($1('.copete').text()));
			//console.log('TERMINA-DESCRIPCION-TE\n');
			//console.log('EMPIEZA-FECHA-TE\n');
			var tfec = quitarTabs ($1('.date').first().text());
			console.log(tfec);
			var fec = fechaTelam (tfec);
			console.log('fecha devuelta: ' + fec);
			//console.log('TERMINA-FECHA-TE\n');
		}else{
			//console.log('FALLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
			// setTimeout(procesarLinkTelam(link),10000);
		}
		console.log('---------------------------------------------------');
	});
}

module.exports.procesarLinkElPais = procesarLinkElPais;
module.exports.procesarLinkElObservador = procesarLinkElObservador;
module.exports.procesarLinkRepublica = procesarLinkRepublica;
module.exports.procesarLinkTelam = procesarLinkTelam;
