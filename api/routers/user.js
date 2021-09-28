const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/image')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const {
  addUser,
  getUsers,
  getUser,
  updateUser,
  updateFotoUser
} = require('../controllers/user');
const playListRouter = require('./playlist');
const comentarioRouter = require('./comentario');

router.use('/:id/playlists', playListRouter);
router.use('/:id/comentarios', comentarioRouter);

router.route('/')
  .get(getUsers)
  .post(addUser)

router.put('/:id/image', multer({
  storage: storage
}).single('foto'), updateFotoUser)

router.route('/:id')
  .get(getUser)
  .put(updateUser)


module.exports = router;