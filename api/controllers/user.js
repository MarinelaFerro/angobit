const bcrypt = require('bcryptjs');

const User = require('./../models/user');
const errorHandler = require('./../utils/errorHandler');


module.exports = {
  addUser: async (req, res, next) => {
    try {
      const selfUser = {
        ...req.body
      };

      if (req.body.password === undefined || req.body.password.trim() === '') {
        console.log();
        return next(errorHandler('Password é Obrigatorio', 400));
      }

      if (req.body.artista) {
        selfUser.produtora = req.body.produtora;
        selfUser.descricao = req.body.descricao;
        selfUser.nome_artistico = req.body.nome_artistico;
        selfUser.role = 'artista';
      }

      selfUser.password = bcrypt.hashSync(req.body.password, 10);

      const user = await User.create(selfUser);

      res.status(201).json({
        status: 'Sucess',
        data: user
      })
    } catch (error) {
      if (error.code === 11000) {
        return next(errorHandler('Email ja existe', 400));
      }

      next(errorHandler(error.message, error.statusCode));
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await User.find({
        role: 'user'
      });

      res.status(200).json({
        status: 'Sucess',
        data: users
      })

    } catch (error) {
      next(errorHandler(error.message, error.statusCode));
    }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await User.findOne({
        _id: req.params.id,
        role: 'user'
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

  updateUser: async (req, res, next) => {
    try {
      const user = await User.findOneAndUpdate({
        _id: req.params.id,
        role: 'user'
      }, {
        $set: {
          nome: req.body.nome,
          sexo: req.body.sexo
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
  },

  updateFotoUser: async (req, res, next) => {
    try {
      if (!req.file)
        return next(errorHandler(`Please send a file`, 400));

      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
          foto: `${req.protocol}://${req.headers.host}/image/${req.file.filename}`
        }
      }, {
        new: true,
        runValidators: true
      });

      if (!user) return next(errorHandler(`User ${req.params.id} not found`, 404));

      res.status(200).json({
        status: 'Sucess',
        data: user
      })
    } catch (error) {
      next(errorHandler(error.message, error.statusCode));
    }
  }

}