const express = require('express');
const router = express.Router();
const multer  = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join('public/images/users'));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
});
const upload = multer({ storage: storage })

const userController = require('../controllers/userController');
const validation = require('../middlewares/validation');
const Auth = require('../middlewares/Auth');
const Guest = require('../middlewares/Guest');

// Muestra la vista de registro
router.get('/register', Guest, userController.showRegister);

// Procesa la vista de registro
router.post('/register', Guest, upload.any(), validation.register, userController.processRegister);

// Muestra la vista de login
router.get('/login', Guest, userController.showLogin);

// Procesa la vista de login
router.post('/login', Guest, validation.login,  userController.processLogin);

// Muestra el perfil del usuario
router.get('/profile', Auth, userController.showProfile);

// Cierra la sesión
router.get('/logout', Auth, userController.logout);

module.exports = router;