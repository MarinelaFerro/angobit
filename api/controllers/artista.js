const bcrypt = require('bcryptjs');

const User = require('./../models/user');
const errorHandler = require('./../utils/errorHandler');


module.exports = {
  getArtistas: async (req, res, next) => {
    try {
      const users = await User.find({
        role: 'artista'
      });

      res.status(200).json({
        status: 'Sucess',
        data: users
      })

    } catch (error) {
      next(errorHandler(error.message, error.statusCode));
    }
  },

  getArtista: async (req, res, next) => {
    try {
      const user = await User.findOne({
        _id: req.params.id,
        role: 'artista'
      });

      if (!user) return next(errorHandler(`User ${req.params.id} not found`, 404));

      res.status(200).json({
        status: 'Sucess',
        data: user
      })
    } catch (error) {
      if (error.name === 'CastError') return next(errorHandler(`Id ${req.params.id} inválido`, 400));

      next(errorHandler(error.message, error.statusCode));
    }
  },

  updateArtista: async (req, res, next) => {
    try {
      const user = await User.findOneAndUpdate({
        _id: req.params.id,
        role: 'artista'
      }, {
        $set: {
          nome: req.body.nome,
          produtora: req.body.produtora,
          nome_artistico: req.body.nome_artistico,
          descricao: req.body.descricao,
        }
      }, {
        new: true
      });

      if (!user) return next(errorHandler(`User ${req.params.id} not found`, 404));

      delete user['password'];

      res.status(200).json({
        status: 'Sucess',
        data: user
      })
    } catch (error) {
      if (error.code === 11000) {
        return next(errorHandler('Email ja existe', 400));
      }

      next(errorHandler(error.message, error.statusCode));
    }
  }

}