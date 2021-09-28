const mongoose = require('mongoose');

const comentario = mongoose.Schema({
  comentario: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: [true, 'Campo Categoria é obrigatorio']
  },
  musica: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Musica',
    // required: [true, 'Campo Artista é obrigatorio']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comentario', comentario);