const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const { validateSignup, validateLogin } = require('../middleware/validateSignupLogin');
const { authLimiter } = require('../middleware/express-rate-limit')

// Route de création d'un nouvel utilisateur (inscription)
//  authLimiter : Limite le nombre de requêtes pour éviter les abus.
//  validateSignup : Valide les données envoyées (email, mot de passe)
router.post('/signup', authLimiter, validateSignup, userCtrl.signup);


// Route de connexion d'un utilisateur existant
//  authLimiter : Limite le nombre de requêtes pour éviter les abus.
//  validateLogin : Valide les données envoyées (email, mot de passe)
router.post('/login', authLimiter, validateLogin, userCtrl.login);

module.exports = router;