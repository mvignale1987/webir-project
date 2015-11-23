/**
* Tarea WebIr - 2015
* Version 1.0
* Fecha = 27-10-15
*/

var aplicacion = angular.module('appHz', [] );               /*["ngRoute"]*/
//Para que se ejecute cuando arranca la app.

//Cuando utilizamos el ['$scope', function($scope){...}] es para tener visivilidad global dentro de las funciones,
//sino los cambios de variables globales dentro de las funciones no tienen efecto fuera de ella o dentro de otra funcion.
aplicacion.controller("mainCtrl", ['$scope', '$sce', '$http', function($scope, $sce, $http) {
    //Me indica que pagina será cargada para aplicar los filtros.
	$scope.contentFiltros = 'pages/';
	$scope.filtro=
	{
		fechaDesde : new Date(),
		fechaHasta : new Date(),
		palabra:'',
	}
	
	//Me indica que pagina será cargada para mostrar como cuerpo.
	$scope.contentUrl = 'pages/home.html';
	//Indica la Url que se visualizará de la noticia.
	$scope.noticiaUrl = $sce.trustAsResourceUrl('http://www.elpais.com.uy/informacion/no-le-podremos-vender-carne.html');
	
	//
    $scope.cambiarCuerpoPagina = function (step,url) {
		//Indico que pagina será la que se mostrara en el cuerpo de la pagina.
        $scope.contentUrl = 'pages/' + step + '.html';
		//Indico que confio en esta URL.
		$scope.noticiaUrl = $sce.trustAsResourceUrl(url);
        //alert($scope.contentUrl);
        //alert($scope.noticiaUrl);
    };
	
	//Funcion que devuelve que pagina mostrar entre home.html y noticias.html.
	$scope.mostrarfiltrosPagina = function () {
        return $scope.contentFiltros;
    };
	
    //Funcion que devuelve que pagina mostrar entre home.html y noticias.html.
	$scope.mostrarCuerpoPagina = function () {
		//alert(this.contentUrl);
        return $scope.contentUrl;
    };
	
	//Funcion que devuelve que pagina mostrar entre home.html y noticias.html.
	$scope.consultarFiltros = function (filtro) {
		//alert('filtro');
		if(filtro == 'fechas'){
			$scope.contentFiltros = 'pages/filtroFechas.html';
		}
		if(filtro == 'palabra'){
			$scope.contentFiltros = 'pages/filtroPalabras.html';
		}
    };
	
	//Invoco a la funcion que me trae los sitios por el rango de fechas.
	$scope.filtrarFechas = function () {
		alert($scope.filtro.fechaDesde);
		alert($scope.filtro.fechaHasta);
		//Hago la consulta a la BD a traves de la URL que le asignamos a la funcion de mostrar el sitio por el rango de fechas.
		$http({
            method: 'GET',
			url: '/consultarSitio_Fechas',
			params: {
				fechaDesde: $scope.filtro.fechaDesde,
				fechaHasta: $scope.filtro.fechaHasta,
			}
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.sitios = data;
            }else{
                alert('Error, no se recibio un objeto.');
            }
        }).
        error(function() {
            alert('Error, al intentar recuperar los Sitios de noticias.');
        });
    };
	
	//Invoco a la funcion que me trae los sitios por una palabra.
	$scope.filtrarPalabras = function () {
       alert($scope.filtro.palabra);
	   
	   //Invoco a la funcion que de proporciona la BD.
	   $http({
            method: 'GET',
			url: '/consultarSitio_Palabra',
			params: {
				palabra: $scope.filtro.palabra,
			}
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.sitios = data;
            }else{
                alert('Error, no se recibio un objeto.');
            }
        }).
        error(function() {
            alert('Error, al intentar recuperar los Sitios de noticias.');
        });
    };
	
    //Funcion que obtiene las noticias de todos los sitios.
	$scope.mostrarTodosSitios = function () {
        //alert("Todos los sitios");
		$scope.contentUrl = 'pages/home.html';
		//Saco el filtro porque estoy consultando otras cosas.
		$scope.contentFiltros = 'pages/';
		
		//Hago la consulta a la BD a traves de la URL que le asignamos a la funcion de mostrar todos los sitios.
		$http({
            method: 'GET',
			url: '/consultar_TodosSitios'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.sitios = data;
            }else{
                alert('Error, no se recibio un objeto.');
            }
        }).
        error(function() {
            alert('Error, al intentar recuperar los Sitios de noticias.');
        });
    };
    
	$scope.mostrarSitio = function(nombSitio) {
		//alert("Mostrar Sitio");
		
		//Saco el filtro porque estoy consultando otras cosas.
		$scope.contentFiltros = 'pages/';
		//Seteo home.html como pagina de inicio.
		$scope.contentUrl = 'pages/home.html';
		
		//Hago la consulta a la BD a traves de la URL que le asignamos a la funcion de mostrar todos los sitios.
		$http({
            method: 'GET',
			url: '/consultarSitio_Nombre',
			params: {
				_nombreSitio: nombSitio
			}
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.sitios = data;
            }else{
                alert('Error, no se recibio un objeto.');
            }
        }).
        error(function() {
            alert('Error, al intentar recuperar los Sitios de noticias.');
        });
		
    };
}])

/* ////////////////////////////////////////////Controlador mainController/////////////////////////////////////////////// */

aplicacion.controller("headerCtrl", function($scope) {
    //alert("headerController");
   
	//Momentaneo hasta que se consiga los datos de la base.
	$scope.portales = [{nombre: 'ElPais'},{nombre: 'ElObservador'},{nombre: 'Subrayado'}];
})

/* ////////////////////////////////////// Funciones auxiliares ///////////////////////////////////////////////////// */


