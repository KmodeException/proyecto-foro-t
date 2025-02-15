const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Nueva ruta para refrescar el token
router.post('/refreshToken', authController.refreshToken);

module.exports = router; 