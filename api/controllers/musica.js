const path = require('path');
const fs = require('fs')

const errorHandler = require('../utils/errorHandler');
const Musicas = require('../models/musica');

module.exports = {
  addMusica: async (req, res, next) => {
    try {

      if (!req.files.foto || !req.files.audio) {
        req.files.foto ? fs.unlink(path.resolve(__dirname, `../../public/image/${req.files.foto[0].filename}`), (err) => {}) : fs.unlink(path.resolve(__dirname, `../../public/sons/${req.files.audio[0].filename}`), (err) => {})
        next(errorHandler('Campos incompletos...', 400));
      }

      const newMusica = await Musicas.create({
        ...req.body,
        url: `${req.protocol}://${req.headers.host}/sons/${req.files.audio[0].filename}`,
        cartaz: `${req.protocol}://${req.headers.host}/image/${req.files.foto[0].filename}`
      })

      // ou `${req.protocol}://${req.get('host')}/image/${req.files.foto[0].filename}`

      res.status(200).json({
        status: 'Sucess',
        data: newMusica
      })
    } catch (error) {
      if (error.name === 'ValidationError') return next(errorHandler(`Campos incompletos...`, 400));

      next(errorHandler(error.message, error.statusCode));
      fs.unlink(path.resolve(__dirname, `../../public/image/${req.files.foto[0].filename}`), (err) => {});
      fs.unlink(path.resolve(__dirname, `../../public/sons/${req.files.audio[0].filename}`), (err) => {});
    }
  },
  getMusicas: async (req, res, next) => {
    try {

      const musicas = await Musicas.find();

      res.status(200).json({
        status: 'Sucess',
        data: musicas
      })
    } catch (error) {
      next(errorHandler(error.message, error.statusCode))
    }
  },
  getMusica: async (req, res, next) => {
    try {

      const musica = await Musicas.findById(req.params.id);

      if (!musica)
        return next(errorHandler(`Musica com id ${req.params.id} não encontrada`, 404))

      res.status(200).json({
        status: 'Sucess',
        data: musica
      })
    } catch (error) {
      if (error.name === 'CastError') return next(errorHandler(`Id ${req.params.id} inválido`, 400));
      next(errorHandler(error.message, error.statusCode))
    }
  },
  updateMusicaDetails: async (req, res, next) => {
    try {
      const updateMusica = await Musicas.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, {
        new: true,
        runValidators: true
      });

      if (!updateMusica) return next(errorHandler(`Musica com id ${req.params.id} não encontrada`, 404))

      res.status(200).json({
        status: 'Sucess',
        data: updateMusica
      })
    } catch (error) {
      if (error.name === 'CastError') return next(errorHandler(`Id ${req.params.id} inválido`, 400));
      if (error.name === 'ValidationError') return next(errorHandler(`Campos incompletos...`, 400));
      next(errorHandler(error.message, error.statusCode));
    }
  },
  updateMusica: async (req, res, next) => {

  },
  updateCartaz: async (req, res, next) => {

  },
  deleteMusica: async (req, res, next) => {
    try {

      const result = await Musicas.findByIdAndDelete(req.params.id);

      if (!result)
        return next(errorHandler(`Musica com id ${req.params.id} não encontrada`, 404));

      res.status(204).json({
        status: 'Sucess'
      })

      fs.unlink(path.resolve(__dirname, `../../public/image/${result.cartaz.split('image/')[1]}`), (err) => {});
      fs.unlink(path.resolve(__dirname, `../../public/sons/${result.url.split('sons/')[1]}`), (err) => {});

    } catch (error) {
      if (error.name === 'CastError') return next(errorHandler(`Id ${req.params.id} inválido`, 400));
      next(errorHandler(error.message, error.statusCode))
    }
  }
}