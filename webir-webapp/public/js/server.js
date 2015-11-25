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
	$scope.contentFiltro =
	{
		fecha : '',
		palabra : '',
	}
	
	$scope.filtro =
	{
		sitio:'Todos',
		fechaDesde : new Date(),
		fechaHasta : new Date(),
		palabra:'',
	}
	
	/*************************************** Inicializar ******************************/
	//Me indica que pagina será cargada para mostrar como cuerpo.
	$scope.contentUrl = 'pages/home.html';
	//Indica la Url que se visualizará de la noticia.
	$scope.noticiaUrl = ''; //$sce.trustAsResourceUrl('http://www.elpais.com.uy/informacion/no-le-podremos-vender-carne.html');
	
    //Inicializa variables y muestra las noticias de todos los sitios.
	$scope.inicializar = function () {
        //alert("Todos los sitios");
		$scope.contentUrl = 'pages/home.html';
		
		//Reseteo todos los campos
		$scope.filtro.sitio = 'Todos';
		$scope.filtro.fechaDesde=null;
		$scope.filtro.fechaHasta=null;
		$scope.filtro.palabra=null;
		
		$scope.contentFiltro.palabra ='';
		$scope.contentFiltro.fecha = '';
		//Invoco a la funcion que se comunica con la DB.
		aplicarConsulta();
    };
    /**********************************************************************************/
	
	/*************************************** Logica del cuerpo de la pagina ******************************/
	
	//Me indica que cuerpo quiero ver como contenido de la pagina, home y el detalle de una noticia.
    $scope.cambiarCuerpoPagina = function (step,url) {
		//Indico que pagina será la que se mostrara en el cuerpo de la pagina.
        $scope.contentUrl = 'pages/' + step + '.html';
		//Indico que confio en esta URL.
		$scope.noticiaUrl = $sce.trustAsResourceUrl(url);
    };
	
	//Funcion que devuelve que pagina mostrar entre home.html y noticias.html.
	$scope.mostrarCuerpoPagina = function () {
        return $scope.contentUrl;
    };
	
	//Funcion que permite obtener las noticias de un sitio en particular.
	$scope.mostrarSitio = function(nombSitio) {
		//alert("Mostrar Sitio");
		
		//Saco el filtro porque estoy consultando otras cosas.
		$scope.contentFiltro.palabra ='';
		$scope.contentFiltro.fecha = '';
		//Seteo home.html como pagina de inicio.
		$scope.contentUrl = 'pages/home.html';
		
		$scope.filtro.sitio = nombSitio;
		//Invoco a la funcion que se comunica con la DB.
		aplicarConsulta();		
    };
	
	/*************************************** Logica para los filtros ******************************/
	
	//Funcion que devuelve que filtro mostrar entre fechas y palabra.
	$scope.consultarFiltros = function (filtro) {
		//alert('filtro');
		if(filtro == 'fechas'){
			return $scope.contentFiltro.fecha;
		}
		if(filtro == 'palabra'){
			 return $scope.contentFiltro.palabra;
		}
    };
	
	//Funcion que modifica la variable para mostrar el filtro de fechas y palabras.
	$scope.mostrarFiltro = function (filtro) {
        //alert('filtro');
		if(filtro == 'fechas'){
			$scope.contentFiltro.fecha = 'pages/filtroFechas.html';
		}
		if(filtro == 'palabra'){
			$scope.contentFiltro.palabra = 'pages/filtroPalabras.html';
		}
    };
	
	//Funcion que es invocado luego de introducir filtros de fechas y palabra.
	$scope.aplicarFiltros = function () {
        //Invoco a la funcion que se comunica con la DB.
		aplicarConsulta();
    };
	
	/***********************************************************************************************/
	//var dateFormat = require('dateformat');
	//Funcion que se comunica con la DB y obtiene las noticias aplicando los filtros especificos.
	function aplicarConsulta()
	{
		
		//Hago la consulta a la BD a traves de la URL que le asignamos a la funcion de mostrar el sitio por el rango de fechas.
		$http({
            method: 'GET',
			url: '/noticias',
			params: {
				sitio: 		$scope.filtro.sitio,
				fechaDesde: $scope.filtro.fechaDesde,  //dateFormat($scope.filtro.fechaDesde, "yyyy-mm-dd"), //"yyyy-mm-dd h:MM:ss"
				fechaHasta: $scope.filtro.fechaHasta,  //dateFormat($scope.filtro.fechaHasta, "yyyy-mm-dd"),
				palabra: 	$scope.filtro.palabra,
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
	}
}])

/* ////////////////////////////////////////////Controlador mainController/////////////////////////////////////////////// */

aplicacion.controller("headerCtrl", function($scope) {
    //alert("headerController");
   
	//Momentaneo hasta que se consiga los datos de la base.
	$scope.portales = [{nombre: 'ElPais'},{nombre: 'ElObservador'},{nombre: 'Subrayado'}];
})

/* ////////////////////////////////////// Funciones auxiliares ///////////////////////////////////////////////////// */
/*
	//Invoco a la funcion que me trae los sitios por el rango de fechas.
	$scope.filtrarFechas = function () {
		//alert($scope.filtro.fechaDesde);
		//alert($scope.filtro.fechaHasta);
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
	*/

