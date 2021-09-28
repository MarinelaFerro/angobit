const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const tiposImagem = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype === 'audio/mpeg')
        cb(null, './public/sons')
      else if (tiposImagem.includes(file.mimetype))
        cb(null, './public/image')
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
  }),
  fileFilter: (req, file, cb) => {

    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/) && file.fieldname === 'foto')
      return cb(new Error("Invalid file type to image."));
    else if (!file.originalname.match(/\.(mp3)$/) && file.fieldname === 'audio')
      return cb(new Error("Invalid file type to musica."));

    cb(null, true);
  }
})

const {
  addMusica,
  getMusica,
  getMusicas,
  updateCartaz,
  updateMusica,
  updateMusicaDetails,
  deleteMusica
} = require('../controllers/musica');

router.route('/')
  .get(getMusicas)
  .post(upload.fields([{
    name: 'foto',
    maxCount: 1
  }, {
    name: 'audio',
    maxCount: 1
  }]), addMusica)

// router.put('/:id/image', multer({
//   storage: storage
// }).single('foto'), updateFotoUser)

router.route('/:id')
  .get(getMusica)
  .put(updateMusicaDetails)
  .delete(deleteMusica)


module.exports = router;