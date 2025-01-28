require('dotenv').config();
const jwt = require('jsonwebtoken');


/**
 * @description Middleware d'authentification pour vérifier le token JWT.
 * @param {Object} req - Objet représentant la requête HTTP.
 * @param {Object} res - Objet représentant la réponse HTTP.
 * @param {Function} next - Fonction permettant de passer au middleware suivant.
 */
module.exports = (req, res, next) => {
    try {
        // Extraction du token depuis l'en-tête "Authorization"
        const token = req.headers.authorization.split(' ')[1];

        // Vérification et décodage du token avec la clé secrète
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // Extraction de l'ID utilisateur depuis le token décodé
        const userId = decodedToken.userId;

        // Ajout de l'ID utilisateur à l'objet req
        req.auth = { userId: userId };

        // Passage au middleware suivant
        next();
    }
    // En cas d'erreur avec le token
    catch (error) {
        // Renvoyer une erreur 401
        res.status(401).json({ error });
    }
};