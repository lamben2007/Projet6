// Importation du module mongoose pour la gestion de la base de données MongoDB
const mongoose = require('mongoose');
// Importation du plugin mongoose-unique-validator pour garantir l'unicité des champs spécifiés
const uniqueValidator = require('mongoose-unique-validator');

/**
 * Schéma de l'utilisateur pour la base de données MongoDB
 */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Champ email, unique et obligatoire
    password: { type: String, required: true } // Champ mot de passe, obligatoire
});

// Application du plugin pour s'assurer que l'email est unique en base de données
userSchema.plugin(uniqueValidator);

// Exportation du modèle 'User' basé sur le schéma défini
module.exports = mongoose.model('User', userSchema);