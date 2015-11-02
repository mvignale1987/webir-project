var mongoose = require('mongoose');

module.exports = mongoose.model('Noticia', {
	titulo: String,
	URL: String,
	sitio: String,
  document: String,
	fecha: Date
});
