const express = require('express');
const router = express.Router();

const {
  getArtistas,
  getArtista,
  updateArtista
} = require('../controllers/artista');

router.route('/')
  .get(getArtistas)

router.route('/:id')
  .get(getArtista)
  .put(updateArtista)


module.exports = router;