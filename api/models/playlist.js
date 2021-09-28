const mongoose = require('mongoose');

const playListSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  musicas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Musica'
  }],
  public: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('PlayList', playListSchema);