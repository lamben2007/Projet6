// Importation des modules
const http = require('http');
const app = require('./app');

/**
 * @function normalizePort
 * @description Normalise le port d'écoute
 * @param {string} val - La valeur du port type string
 * @returns {number|string|boolean} - Le port normalisé ou false si invalide.
 */
const normalizePort = val => {

  // Conversion de la valeur en un entier
  const port = parseInt(val, 10);

  // Si la conversion échoue (NaN), retourner la valeur telle quelle
  if (isNaN(port)) {
    return val;
  }

  // Si le port est positif ou égal à 0, retour du port
  if (port >= 0) {
    return port;
  }

  // Si le port est négatif, retourner false
  return false;
};


// Récupération du port à utiliser, avec un port 4000 si non défini
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);  // Définir le port sur l'application


/**
 * @function errorHandler
 * @description Gestion des erreurs liées à l'écoute du serveur
 * @param {Object} error - L'objet erreur généré par le serveur.
 */
const errorHandler = error => {

  //
  if (error.syscall !== 'listen') { throw error; }

  //
  const address = server.address();  // Récupération de l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

  // Gestion des erreurs en fonction du code d'erreur
  switch (error.code) {
    // CAS : Erreur de permissions
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);  // Terminer le processus en cas d'erreur de permissions
      break;

    // CAS : Port déjà utilisé
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);  // Terminer le processus si le port est déjà utilisé
      break;

    // Autre cas
    default:
      throw error;  // Lancer l'erreur si ce n'est pas un cas prévu
  }
};


// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);


// Écoute des événements 'error' et 'listening' du serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);  // Affichage du port ou du pipe où l'application écoute
});


// Lancement du serveur sur le port spécifié
server.listen(port);
