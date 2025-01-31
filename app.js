require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const { globalLimiter } = require('./middleware/express-rate-limit')
const helmet = require('helmet');


// Connexion à la base de données MongoDB 
try {
  // Tentative de connexion à MongoDB avec la chaîne de connexion définie dans les variables d'environnement
  mongoose.connect(process.env.ConnexionStringMongoDB, {
    useNewUrlParser: true,  //
    useUnifiedTopology: true //
  });

  // Si la connexion réussie, afficher un message de succès dans la console
  console.log('Connexion à MongoDB réussie !');

} catch (error) {
  // Si la connexion échoue, afficher un message d'erreur
  console.log('Connexion à MongoDB échouée !');
}


// Middleware pour analyser les corps des requêtes au format JSON
app.use(express.json());


// Configuration de Helmet pour améliorer la sécurité du serveur
// Helmet réduit les risques d'attaques en modifiant intelligemment les en-têtes HTTP
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Permet le chargement des ressources depuis n'importe quelle origine
}));


// Middleware de limitation de la fréquence des requêtes (globalLimiter)
app.use(globalLimiter); 


// Middleware pour définir des en-têtes HTTP spécifiques pour gérer les CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  // Permet les demandes CORS depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Autorise les en-têtes spécifiques dans les requêtes
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // Permet certaines méthodes HTTP
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  // Passe à la suite du middleware
  next();
});


// Middleware pour un accès aux fichiers images depuis le répertoire "images"
app.use("/images", express.static("images"));


// Définition des routes API
app.use('/api/books', booksRoutes); // Routes pour les livres
app.use('/api/auth', userRoutes);  // Routes pour l'authentification des utilisateurs


// Exportation de l'application Express pour l'utiliser ailleurs
module.exports = app;