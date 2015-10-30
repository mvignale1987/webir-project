/**
* Tarea WebIr - 2015
* Version 1.0
* Fecha = 27-10-15
*/

var aplicacion = angular.module('appHz', [] );/*["ngRoute"]*/

/*
// Configuración de las rutas para el sitio.
aplicacion.config(['$routeProvider',function($routeProvider) {

 /*
  $routeProvider.when('/', {
    templateUrl: "pages/home.html", //Las rutas son relativas al index.
    controller: "CtrlPortales"
  });
 
  $routeProvider.when('/sitio', {
    templateUrl: "pages/home.html", //Las rutas son relativas al index.
    controller: "CtrlSitio"
  });
  /
  
  $routeProvider.when('/noticias', {
    templateUrl: "pages/noticias.html",
    controller: "CtrlNoticias"
  });
   
  $routeProvider.otherwise({
        redirectTo: '/'
  });

}]);
*/



/* ////////////////////////////////////////////Singleton UrlVerNoticia/////////////////////////////////////////////// */
//Uno de los 3 tipos de servicios
//aplicacion.value('UrlVerNoticia', 'http://localhost:3000/');

aplicacion.factory('UrlVerNoticia', function (){
    return {
            url:'http://www.elpais.com.uy/informacion/seis-meses-dieron-baja-cuidacoches.html',
    }
});

/* ////////////////////////////////////////////Controlador CtrlPortales/////////////////////////////////////////////// */

aplicacion.controller('CtrlPortales', function($scope, UrlVerNoticia) {
	//Guardo url a la noticia que estoy viendo
	$scope.urlnoticia = UrlVerNoticia.url;
	$scope.UrlVerNoticia = UrlVerNoticia;
        
	//Variable que se carga de la base con todos los portales y sus noticias
	$scope.sitios = devolverSitio("Todos");
	
	//Momentaneo hasta que se consiga los datos de la base.
	$scope.portales = [{nombre: 'ElPais'},{nombre: 'ElObservador'},{nombre: 'Subrayado'}];
	
	/*
		Consumir api rest para buscar todos los sitios
	*/
	//Funcion que obtiene las noticias de todos los sitios.
	$scope.todosSitios = function() {
        //alert("Todos los sitios");
		
		$scope.sitios = devolverSitio("Todos");
    }
	$scope.mostrarSitio = function(nombSitio) {
		//index es la posicion de la lista generada.
        //alert("Sitio nombre=" + nombSitio );
		
		$scope.sitios = devolverSitio(nombSitio);

    }	
	$scope.irOrigenNoticia = function(url) {
		//index es la posicion de la lista generada.
        //alert(url);
        $scope.UrlVerNoticia.url = url;
        
		//$scope.urlnoticia = url;
        //alert($scope.urlnoticia);
    }

});

/* ////////////////////////////////////////////Controlador CtrlNoticias/////////////////////////////////////////////// */

/*Me andaba pero si ingresaba a una noticia dejaba de funcionar.
aplicacion.config(['$sceDelegateProvider', function($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist(['http://elpais.com.uy/']);
}]);
*/

//Controlador para una noticia.
aplicacion.controller('CtrlNoticias', function($scope, UrlVerNoticia, $sce) {
	//Guardo url a la noticia que estoy viendo
	$scope.dataUrl = UrlVerNoticia.url;
    //alert($scope.dataUrl);
    $scope.noticiaUrl = $sce.trustAsResourceUrl($scope.dataUrl);
});

/* //////////////////////////////////////Directiva preview_noticia///////////////////////////////////////////////////// */

/*
NO ME ANDUVO LA DIRECTIVA PARA SUSITITUIR EL ELEMENTO =(

//Implemento la directiva que mostrará las noticias en el div.
aplicacion.directive('preview_noticia', function() {
  return {
			restrict: 'E',
			scope: {
				resumen_noticia: '='
			},
			transclude : true,
			templateUrl : "pages/directiva_noticia.html",
			link: function ($scope, $element, $attrs) {
				var template = resumenNoticia;
				var compiled = angular.element($compile(resumenNoticia));
				$element = compiled;			
			}
	};
});
*/
//Implemento la directiva que mostrará las noticias en el div.
aplicacion.directive('preview_noticia', function() {
  return {
			restrict: 'E',
			scope: {},
			templateUrl : "<p></p>",
            replace:true,
			link: function ($scope, $element, $attrs) {
				var resumen = attrs.resumen_noticia;
				$scope.p=resumen;
			}
	}
});

/*
//Controlador para una noticia.
aplicacion.controller('CtrlSitio', function($scope, UrlVerNoticia, CtrlPortales) {
	//Guardo url a la noticia que estoy viendo
	$scope.sitios = UrlVerNoticia.sitios;
	
	alert("CtrlSitio - ");

});
*/

/*
NO ME ANDUVO LA DIRECTIVA PARA SUSITITUIR EL ELEMENTO =(

//Implemento la directiva que mostrará las noticias en el div.
aplicacion.directive('preview_noticia', function() {
  return {
			restrict: 'E',
			scope: {
				resumen_noticia: '='
			},
			transclude : true,
			templateUrl : "pages/directiva_noticia.html",
			link: function ($scope, $element, $attrs) {
				var template = resumenNoticia;
				var compiled = angular.element($compile(resumenNoticia));
				$element = compiled;			
			}
	};
});
*/

function devolverSitio(sitio) {
	//alert("devolverSitio=" + sitio);
	/*
	Consumir api rest para buscar todos los sitios
	*/
	var sitios = [];
	if(sitio == "Todos")
	{
		sitios = [{
					nombre: 'ElPais',
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
						url:'http://axelhzf.com/js-training-doc/angular.html',
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
							titulo: "Noticia Observador 5",
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
	}
	else if(sitio == 'ElPais')
		{
			sitios = [{
						nombre: 'ElPais',
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
							url:'http://axelhzf.com/js-training-doc/angular.html',
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
						]
					}];
		}
		else if(sitio == 'ElObservador')
		{
			sitios = [{
						nombre: 'ElObservador',
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
							titulo: "Noticia Observador 5",
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
					}];
			
		}else if(sitio == 'Subrayado')
		{
			sitios = [{
						nombre: 'Subrayado',
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
					}];
		}
	return sitios;
}

