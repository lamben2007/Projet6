const { body, validationResult } = require('express-validator');

/**
 * @function validateSignup
 * @description Middleware de validation des données d'inscription.
 * @param {Object} req - L'objet de requête Express
 * @param {Object} res - L'objet de réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 * @returns {void} - En cas d'erreur, une réponse JSON avec les messages d'erreur est envoyée.
 */
const validateSignup = [
    // Validation de l'email
    body('email')
        .isEmail().withMessage('Email invalide') // Vérifie si l'email est valide
        .normalizeEmail() // Normalise l'email (suppression des espaces, mise en minuscule, etc.)
        .isLength({ max: 255 }).withMessage('Votre email doit contenir au maximum 255 caractères '), // Vérifie la longueur max

    // Validation du mot de passe
    body('password')
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W]).+$/)
        .withMessage('Votre mot de passe dont contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial')
        .isLength({ min: 8, max: 64 }).withMessage('Le mot de passe doit contenir entre 8 et 64 caractères'),

    // Middleware pour gérer les erreurs de validation
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Retourne les erreurs en JSON
        }
        next(); // Passe au middleware suivant si aucune erreur
    }
];


/**
 * @function validateLogin
 * @description Middleware de validation des informations de connexion.
 * @returns Renvoie un message d'erreur générique en cas d'échec.
 */
const validateLogin = [
    // Validation de l'email
    body('email')
        .isEmail().withMessage('Email ou mot de passe incorrect') // Vérifie si l'email est valide
        .normalizeEmail(), // Normalise l'email (ex. suppression des espaces, conversion en minuscule, etc.)

    // Validation du mot de passe
    body('password')
        .notEmpty().withMessage('Email ou mot de passe incorrect'), // Vérifie seulement si le champ n'est pas vide

    // Gestion des erreurs
    (req, res, next) => {
        const errors = validationResult(req);
        // SI des erreurs ont été trouvées ALORS
        if (!errors.isEmpty()) {
            // Renvoyer erreur 400 avec message générique 'Email ou mot de passe incorrect'
            return res.status(400).json({ errors: [{ msg: 'Email ou mot de passe incorrect' }] });
        }
        // SINON passer au middleware suivant si la validation est réussie
        next();
    }
];

module.exports = { validateSignup, validateLogin };
