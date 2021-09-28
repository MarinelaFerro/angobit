const mongoose = require('mongoose');

const musicaSchema = mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Campo Titulo é obrigatorio']
  },
  descricao: String,
  duracao: {
    type: String,
    required: [true, 'Campo Duração é obrigatorio']
  },
  url: String,
  cartaz: String,
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    // required: [true, 'Campo Categoria é obrigatorio']
  },
  artista: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: [true, 'Campo Artista é obrigatorio']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Musica', musicaSchema);