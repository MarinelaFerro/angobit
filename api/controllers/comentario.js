const Comentario = require('./../models/comentario');
const errorHandler = require('./../utils/errorHandler');


module.exports = {
  addComentario: async (req, res, next) => {
    try {
      const selfComentario = {
        comentario: req.body.comentario,
        user: req.body.user,
        musica: req.body.musica
      }
      await Comentario.create(selfComentario)

      const eventEmitter = req.app.get('eventEmitter');
      eventEmitter.emit('addcomentario', {
        user: selfComentario.user,
        comentario: selfComentario.comentario
      })

      res.status(201).json({
        status: 'Sucess'
      })
    } catch (error) {
      next(errorHandler(error.message, error.statusCode));
    }
  },

  deleteComentario: async (req, res, next) => {
    try {
      await Comentario.findByIdAndDelete(req.params.id);

      res.status(200).json({
        status: 'Sucess'
      })
    } catch (error) {
      next(errorHandler(error.message, error.statusCode));
    }
  },

  getComentario: async () => {
    try {
      const comentarios = await Comentario.find();
      res.status(200).json({
        status: 'Sucess',
        data: comentarios
      })

    } catch (error) {
      next(errorHandler(error.message, error.statusCode));
    }
  }
}