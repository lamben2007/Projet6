const mongoose = require('mongoose');

/**
 * Schéma de notation des livres.
 */
const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    grade: { type: Number, required: true },
});


/**
 * Schéma du livre.
 */
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true }, // Identifiant unique de l'utilisateur qui a ajouté le livre
    title: { type: String, required: true }, // Titre du livre
    author: { type: String, required: true }, // Auteur du livre
    imageUrl: { type: String, required: true }, // URL de l'image de couverture du livre
    year: { type: Number, required: true }, // Année de publication du livre
    genre: { type: String, required: true }, // Genre du livre
    ratings: { type: [ratingSchema], required: true }, // Liste des évaluations des utilisateurs
    averageRating: { type: Number, required: true }, // Note moyenne du livre
});


module.exports = mongoose.model('Book', bookSchema);
