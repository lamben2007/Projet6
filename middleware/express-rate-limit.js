const rateLimit = require('express-rate-limit');

// Limiteur global
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes
    message: "Trop de requêtes effectuées depuis cette IP, veuillez réessayer plus tard.",
    headers: false, // Retire les en-têtes RateLimit dans la réponse. 
});


// Limiteur plus strict pour l'authentification
const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 min
    max: 5, // Seulement 5 tentatives
    message: "Trop de tentatives de connexion, attendez 5 min.",
});

module.exports = { globalLimiter, authLimiter };