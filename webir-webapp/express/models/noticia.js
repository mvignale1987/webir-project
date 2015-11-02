var mongoose = require('mongoose');

module.exports = mongoose.model('noticia', {
	titulo: String,
	URL: String,
	sitio: String
  // document: String,
	// fecha: Date
});
