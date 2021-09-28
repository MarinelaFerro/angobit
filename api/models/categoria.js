const mongoose = require('mongoose');

const categoriaSchema = mongoose.Schema({
  nome: String
});

module.exports = mongoose.model('Categoria', categoriaSchema);