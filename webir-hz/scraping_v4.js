var request = require("request"),
	cheerio = require("cheerio"),
    fs = require('fs'), //Para manejar archivos
	urls = [],
    sitios = ['http://www.elpais.com.uy/', 'http://ladiaria.com.uy/', 'http://www.clarin.com/', 'http://www.nytimes.com/'],
    arrayUrls = new Array(),
    existe=false;

    var diario= 'nytimes';

    //Si es true porque estoy laburando local sin internet, sino accediendo directamente de internet.
    if(true)
    {
        //Levanto el archivo .html que quiero analizar previamente bajado.
        var htmlString = fs.readFileSync('./Portales/' + diario + '.html').toString();
        var $ = cheerio.load(htmlString);
        //"a[id]" - Selecciona todos los elementos "a" que contengan el atributo id.
        //"a[href]" - Selecciona todos los elementos "a" que contengan el atributo href.
        //"div" - Selecciona todos los elementos div.
       
        /*
        //Obtengo los div que contiene un enlace "a".
        $('div:has(a[href])').each(function(){
            var url =  $(this);
            //var href = $("a[href]").attr("href");
            
            //urls.push(href);
            urls.push(url);
        });
        */
        //Obtengo el primer div que contiene un enlace "a".
        $('a[href]').each(function(){
            var $a =  $(this);
            var $div = $a.closest('div');
            var $href = $a.attr('href');
            
            //Verifico si la url pertenece al arreglo.
            for(var i=0; i<arrayUrls.length; i++)
            {
                if(arrayUrls[i] == $href)
                {
                    existe=true;
                    break;
                }
            }
            //Si no existe lo agrego
            if(!existe)
            {
                arrayUrls.push($href);
                //Si no existe lo agrego a la solucion.
                urls.push($div);
            }
            existe=false;
        });
        
        //console.log(urls);
        //console.log(urls[0]);
        //console.log(arrayUrls.length);
        console.log(urls.length);

        //Elimino el archivo si es que esta previamente creado
        //fs.unlinkSync(diario + '.txt');
        //console.log('Archivo borrado!');
        
        //Guardo el resultado obtenido en un archivo .txt.
        fs.writeFile(diario + '.txt', urls, function (err) {
          if (err) throw err;
            console.log('El resultado fue saved!');
        });

    }
    else
    {
        //Recorro para cada uno de los sitios.
        sitios.forEach(function(url){
            
            //Obtengo una pagina .html desde la web.
            request(url, function (error, response, body) {
                if (!error) {
                    //Cargo la pagina a la variable $ para analizarla.
                    var $ = cheerio.load(body);

                    //$("[class='news-title']")
                    //Obtiene todos los elementos que contengan "news-title" como class.
                    //$("[class*=news-title]")
                    $("a[href]").each(function(){
                        var link = $(this);
                        var text = link.text();
                        var href = link.attr("href");

                        urls.push(href);
                        //console.log(text + " -> " + href);
                     });
                    console.log(urls);
                    console.log(urls.length);

                    /*
                        //var noticias = $("[data-variable='temperature'] .wx-value").html();
                        //var noticias = $("[class='news-title page-link ']").html();
                        var noticias = $("[class='news-title page-link ']").each(function(){
                            //var url = this.attr('href');
                            urls.push(this);
                        });
                        //console.log("Url a noticias= " + noticias);
                        console.log(urls[1]);
                    */
                } else {
                    console.log("We’ve encountered an error: " + error);
                }
            });
            
        });            
    }
