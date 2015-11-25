var request = require("request"),
    cheerio = require("cheerio"),
    mongoose = require('mongoose');
    procesarLink = require("./procesarLink.js"),
    fs = require('fs'), //Para manejar archivos
    urls = [],urlsNoAgrego = [],
    sitios = ['http://www.elpais.com.uy', 'http://www.republica.com.uy', 'http://www.elobservador.com.uy', 'http://www.telam.com.ar'],
    arrayUrls = new Array(),
    arrayUrlsNoAgrego = new Array(),
    arrayUrlsTodos = new Array(),
    existe=false;

var primero = true;

function recorrerSitios(){
	//Recorro para cada uno de los sitios.
	sitios.forEach(function(url){
	    //Obtengo una pagina .html desde la web.
	    request(url, function (error, response, body) {
		if (!error) {
		    //Cargo la pagina a la variable $ para analizarla.
		    var $ = cheerio.load(body);
		    $("a[href]").each(function(){
		        var $link = $(this);
		        var $text = $link.text();
		        var $href = $link.attr("href");
			var $div  = $link.closest('div');

		        for(var i=0; i<arrayUrlsTodos.length; i++)
			{
				if(arrayUrlsTodos[i] == $href)
				{
				    existe=true;
				    break;
				}
	  		}
			//Si no existe lo agrego
			if(!existe)
			{
				arrayUrlsTodos.push($href);
				if (url == 'http://www.elpais.com.uy'){
					var match = $href.match(/(.+)\.html/g);
					var entro = false;
					for ( var m in match) {
						if ($href.substring(0,7)=='http://'){
							link = $href;
						}else{
							link = url + $href;
						}
						arrayUrls.push(link);
						entro = true;
						procesarLink.procesarLinkElPais(link);
						break;
					}
					if (!entro){
						arrayUrlsNoAgrego.push($href);
					}
				}else
				if (url == 'http://www.republica.com.uy'){
					var match = $href.match(/http\:\/\/www\.republica\.com\.uy\/(.+)\/([0-9]+)\//g);
					var entro = false;
					for ( var m in match) {
						link = $href;
						arrayUrls.push(link);
						entro = true;
						procesarLink.procesarLinkRepublica(link);
						break;
					}
					if (!entro){
						arrayUrlsNoAgrego.push($href);
					}
				}else
				if (url == 'http://www.elobservador.com.uy'){
					var match = $href.match(/(.+)-n([0-9]+)/g);
					var entro = false;
					for ( var m in match) {
						var link = 'http://'+$href.substring(2,$href.length);
						arrayUrls.push(link);
						entro = true;
						procesarLink.procesarLinkElObservador(link);
						break;
					}
					if (!entro){
						arrayUrlsNoAgrego.push($href);
					}
				}else
				if (url == 'http://www.telam.com.ar'){
					var match = $href.match(/(.+)\.telam\.com\.ar\/notas\/(.+)\.html/g);
					var entro = false;
					for ( var m in match) {
						link = $href;
						arrayUrls.push(link);
						entro = true;
						procesarLink.procesarLinkTelam(link);
						break;
					}
					if (!entro){
						arrayUrlsNoAgrego.push($href);
					}
				}
			 }
			 existe=false;
		     });
			fs.writeFile('HREF.txt', arrayUrls.join('\n'), function (err) {
			  if (err) throw err;
			    console.log('El resultado fue saved!');
			});

			fs.writeFile('HREFNOAGREGO.txt', arrayUrlsNoAgrego.join('\n'), function (err) {
			  if (err) throw err;
			    console.log('El resultado fue saved!');
			});

		} else {
		    console.log("We’ve encountered an error: " + error);
		}
	    });
	});
}
//Conexión a Mongoose.
mongoose.connect('mongodb://localhost:27017/noticias', function(error){
   if(error){
      throw error;
   }else{
      console.log('Conectado a MongoDB');
   }
});
recorrerSitios();
