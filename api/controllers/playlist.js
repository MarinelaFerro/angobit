const PlayList = require('../models/playlist');
const errorHandler = require('./../utils/errorHandler');
const mongoose = require('mongoose');

module.exports = {
  criarPlayList: async (req, res, next) => {
    try {
      const selfBody = {
        ...req.body,
        owner: req.params.id
      }

      const playlist = await PlayList.create(selfBody);

      res.status(200).json({
        status: 'Sucess',
        data: playlist
      })
    } catch (error) {
      if (error.name === 'ValidationError') return next(errorHandler(`Campos incompletos ou incorrectos`, 400));
      next(errorHandler(error.message, error.statusCode));
    }
  },
  getPlayList: async (req, res, next) => {
    try {
      const playLists = await PlayList.find({
        owner: req.params.id
      }, {
        owner: 0,
        musicas: 0
      }).populate({
        path: 'musicas',
        select: 'titulo descricao url cartaz'
      });

      res.status(200).json({
        status: 'Sucess',
        data: playLists
      })
    } catch (error) {
      next(errorHandler(error.message, error.statusCode));
    }
  },
  getPlayListByID: async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id))
        return next(errorHandler(`Tipo invalido para usuario`, 400));

      const playList = await PlayList.findById(req.params.listId).populate({
        path: 'musicas',
        select: 'titulo descricao url cartaz'
      });

      if (!playList) return next(errorHandler(`PlayList com id ${req.params.listId} não encontrada`, 404));
      if (!playList.owner.equals(req.params.id) && !playList.public)
        return next(errorHandler(`No Permission`, 403));

      res.status(200).json({
        status: 'Sucess',
        data: playList
      })
    } catch (error) {
      if (error.name === 'CastError') return next(errorHandler(`Id ${req.params.listId} inválido`, 400));
      next(errorHandler(error.message, error.statusCode));
    }
  },
  updatePlayList: async (req, res, next) => {
    try {
      const playList = await PlayList.findById(req.params.listId);

      if (!playList) return next(errorHandler(`PlayList com id ${req.params.listId} não encontrada`, 404));
      if (!playList.owner.equals(req.params.id))
        return next(errorHandler(`No Permission`, 403));

      playList.nome = req.body.nome || playList.nome;
      playList.public = req.body.public || playList.public;

      const updatePlayList = await playList.save()

      res.status(200).json({
        status: 'Sucess',
        data: updatePlayList
      })
    } catch (error) {
      if (error.name === 'CastError') return next(errorHandler(`Id ${req.params.listId} inválido`, 400));
      next(errorHandler(error.message, error.statusCode));
    }
  },
  deletePlayList: async (req, res, next) => {
    try {
      const deletePlayList = await PlayList.findOneAndDelete({
        _id: req.body.listId,
        owner: req.params.id
      })

      res.status(200).json({
        status: 'Sucess',
        data: deletePlayList
      })
    } catch (error) {
      if (error.name === 'CastError') return next(errorHandler(`Id ${req.params.id} inválido`, 400));
      next(errorHandler(error.message, error.statusCode));
    }
  },
  addMusicaPlayList: async (req, res, next) => {
    try {
      const playList = await PlayList.findById(req.params.listId);

      if (!playList) return next(errorHandler(`PlayList com id ${req.params.listId} não encontrada`, 404));
      if (!playList.owner.equals(req.params.id))
        return next(errorHandler(`No Permission`, 403));

      playList.musicas.push(req.body)
      const musicaAdd = await playList.save();
      res.status(200).json({
        status: 'Sucess',
        data: musicaAdd
      })
    } catch (error) {
      if (error.name === 'CastError') return next(errorHandler(`Id ${req.params.id} inválido`, 400));
      next(errorHandler(error.message, error.statusCode));
    }
  },
  deleteMusicaPlayList: async (req, res, next) => {
    try {
      const playList = await PlayList.findById(req.params.listId);

      if (!playList) return next(errorHandler(`PlayList com id ${req.params.listId} não encontrada`, 404));
      if (!playList.owner.equals(req.params.id))
        return next(errorHandler(`No Permission`, 403));

      playList.musicas.pull(req.body)
      const musicaAdd = await playList.save();
      res.status(200).json({
        status: 'Sucess',
        data: musicaAdd
      })
    } catch (error) {
      if (error.name === 'CastError') return next(errorHandler(`Id ${req.params.id} inválido`, 400));
      next(errorHandler(error.message, error.statusCode));
    }
  }
}