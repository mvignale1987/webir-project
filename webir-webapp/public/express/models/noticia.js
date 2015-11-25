var mongoose = require('mongoose');

module.exports = mongoose.model('Noticia', {
	nombre: String,
	id:String,
	news: [
			{
				titulo:String,
				fecha: Date,
				url:String,
				resumen: String,
				documento: String,
			}
		]
});
