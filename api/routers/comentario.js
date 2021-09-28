const express = require('express');

const comentarioRouter = express.Router({
  mergeParams: true
});

const {
  addComentario,
  deleteComentario,
  getComentario
} = require('../controllers/comentario');

comentarioRouter.route('/').post(addComentario).get(getComentario);
comentarioRouter.delete('/:id', deleteComentario);

module.exports = comentarioRouter;