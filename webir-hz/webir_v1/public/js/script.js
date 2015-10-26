var aplicacion = angular.module('appHz', []);
var portales=[];
aplicacion.controller('CtrlPortales',['$scope', function($scope) {
	//Momentaneo hasta que se consiga los datos de la base.
	//Variable que se carga de la base con todos los portales y sus noticias
	portales = [
			{nombre: 'ElPais',
			news: [
				{
				//titulo: "Noticia Pais 1",
				//resumen: "Resumen Pais 1",
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 1</h2> <p>Resumen Pais 1</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 2</h2> <p>Resumen Pais 2</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 3</h2> <p>Resumen Pais 3</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 4</h2> <p>Resumen Pais 4</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 5</h2> <p>Resumen Pais 5</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Pais 6</h2> <p>Resumen Pais 6</p></div>',
				}
			]},
			{nombre: 'ElObservador',
			news: [
				{
				//titulo: "Noticia Observador 1",
				//resumen: "Resumen Observador 1",
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 1</h2> <p>Resumen Observador 1</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 2</h2> <p>Resumen Observador 2</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 3</h2> <p>Resumen Observador 3</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 4</h2> <p>Resumen Observador 4</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 5</h2> <p>Resumen Observador 5</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 6</h2> <p>Resumen Observador 6</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Observador 7</h2> <p>Resumen Observador 7</p></div>',
				}
			]},
			{nombre: 'Subrayado',
			news: [
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Subrayado 1</h2> <p>Resumen Subrayado 1</p></div>',
				},
				{
				resumen: '<div class="col-xs-6 col-lg-4"> <h2>Noticia Subrayado 2</h2> <p>Resumen Subrayado 2</p></div>',
				}
			]}
		];
	//Variable que contiene las noticias del sitio que se esta viendo.
	$scope.sitios = portales;	
	
	//Funcion que obtiene las noticias de todos los sitios.
	$scope.todosSitios = function() {
        alert("Todos los sitios");
		/*
		Consumir api rest para buscar todos los sitios
		*/
    }
	$scope.mostrarSitio = function(index) {
		//index es la posicion de la lista generada.
        alert("Sitio index");
		/*
		 Consumir api rest para buscar el sitio en la posicion index.
		*/
    }	
	$scope.irOrigenNoticia = function(index) {
		//index es la posicion de la lista generada.
        alert(index);
    }

}]);


/*
NO ME ANDUVO LA DIRECTIVA PARA SUSITITUIR EL ELEMENTO =(
//Implemento la directiva que mostrará las noticias en el div.
aplicacion.directive('preview_noticia', function() {
  return {
		  restrict: 'E',
		  scope: {
			resumenNoticia: '='
		  },
		  replace:false,
		  template: 'resumenNoticia',
		  link: function ($scope, $element, $attrs) {
			var template = resumenNoticia;
            var compiled = angular.element($compile(resumenNoticia));
            $element.append(compiled);
			
        }
	};
});
*/
