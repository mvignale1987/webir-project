
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
// app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

//Invoco al modulo que indica cual sera el archivo index de la app.
require('./express/routes.js')(app);

//Conexión a Mongoose.
mongoose.connect('mongodb://localhost:27017/noticias', function(error){
   if(error){
      throw error;
   }else{
      console.log('Conectado a MongoDB');
   }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Se creo el server express en el puerto: ' + app.get('port'));
});
