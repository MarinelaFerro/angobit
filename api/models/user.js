const mongoose = require('mongoose');

const userShema = mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatorio'],
    lowercase: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password é obrigatorio'],
    select: false
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'artista'],
      message: '{VALUE} is not supported'
    },
    default: 'user'
  },
  sexo: {
    type: String,
    enum: {
      values: ['M', 'F'],
      message: '{VALUE} is not supported'
    }
  },
  produtora: String,
  nome_artistico: String,
  descricao: String,
  foto: String
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userShema);