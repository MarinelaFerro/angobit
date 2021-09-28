const express = require('express');

const playListRouter = express.Router({
  mergeParams: true
});

const {
  criarPlayList,
  getPlayList,
  getPlayListByID,
  updatePlayList,
  deletePlayList,
  addMusicaPlayList,
  deleteMusicaPlayList
} = require('../controllers/playlist');

playListRouter.route('/')
  .get(getPlayList)
  .post(criarPlayList)
  .delete(deletePlayList)

playListRouter.route('/:listId')
  .get(getPlayListByID)
  .post(addMusicaPlayList)
  .put(updatePlayList)
  .delete(deleteMusicaPlayList)

module.exports = playListRouter;