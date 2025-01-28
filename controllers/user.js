require('dotenv').config();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @function signup
 * @description Permet l'inscription d'un utilisateur
 * @param {Object} req - Objet de requête contenant les informations de l'utilisateur
 * @param {Object} res - Objet de réponse permettant d'envoyer une réponse au client
 */
exports.signup = async (req, res) => {
    try {
        // Hachage du mot de passe avec un facteur de coût de 10
        const hash = await bcrypt.hash(req.body.password, 10);

        // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
        const user = new User({
            email: req.body.email,
            password: hash
        });

        try {
            // Sauvegarde de l'utilisateur dans la base de données
            await user.save();
            // Renvoyer le status 201 avec le message "User created"
            res.status(201).json({ message: 'User created !' });
        } catch (error) {
            // Renvoyer status 400 et le message d'erreur
            res.status(400).json({ error });
        }
    } catch (error) {
        // Erreur lors du hachage du mot de passe
        res.status(500).json({ error });
    }
};



/**
 * @function login
 * @description Fonction de connexion des utilisateurs.
 * @param {Object} req - L'objet de requête HTTP contenant l'email et le mot de passe.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {JSON} Réponse avec le token d'authentification ou un message d'erreur.
 */
exports.login = async (req, res) => {
    try {
        // Recherche de l'utilisateur dans la base de données avec l'email fourni
        const user = await User.findOne({ email: req.body.email });
        
        // SI l'utilisateur n'existe pas ALORS
        if (!user) {
            // Renvoyer status 401 et le message "User not found"
            return res.status(401).json({ error: 'User not found' });
        }

        try {
            // Vérification de la validité du mot de passe
            const valid = await bcrypt.compare(req.body.password, user.password);
            // SI mot de passe non valide ALORS
            if (!valid) {
                // Renvoyer le status 401 et le message 'Error password !'
                return res.status(401).json({ error: 'Error password !' });
            }

            // Génération du token JWT avec un délai d'expiration de 24h
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.SECRET_KEY,
                    { expiresIn: '24h' }
                )
            });

        } catch (error) {
            // Gestion des erreurs liées à la vérification du mot de passe
            res.status(500).json({ error });
        }

    } catch (error) {
        // Renvoyer le status 500 et le message d'erreur
        res.status(500).json({ error });
    }
};