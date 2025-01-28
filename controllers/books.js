const Book = require('../models/book');
const fs = require('fs');


/**
 * @function getBestRating
 * @description Récupère les trois livres les mieux notés dans la base de données.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @param {Function} next - Fonction middleware suivante.
 * @returns {JSON} Renvoie un tableau des trois livres avec la meilleure note moyenne.
 */
exports.getBestRating = async (req, res, next) => {
    try {
        // Recherche tous les livres et les trie par note moyenne décroissante, puis limite à 3 résultats.
        const topBooks = await Book.find()
            .sort({ averageRating: -1 }) // Tri par ordre décroissant de la note moyenne
            .limit(3); // Sélection des 3 premiers

        // Réponse avec un statut 201 et les livres les mieux notés
        res.status(201).json(topBooks);
    }
    // Gestion des erreurs en cas d'échec de la requête
    catch (error) {
        // Renvoyer une erreur 400 avec l'erreur
        res.status(400).json({ error });
    }
};


/**
* @function ratingBook
* @description Ajoute une nouvelle notation d'un livre par un utilisateur
* @param {Object} req - L'objet de requête HTTP.
* @param {Object} res - L'objet de réponse HTTP.
* @returns {JSON} Renvoie les infos du livre.
*/
exports.ratingBook = async (req, res) => {
    try {

        // SI la note n'est pas comprise entre 0 et 5 ALORS
        if (req.body.rating < 0 || req.body.rating > 5)
            // Renvoyer status 401 avec l'erreur 'Error rating'
            res.status(401).json({ message: 'Error rating' });

        //SINON (si note entre 0 et 5)
        else {

            // Rechercher les informations du livre en fonction de son ID
            const book = await Book.findOne({ _id: req.params.id })

            // Vérifier si la note déjà attribuée par l'utilisateur
            const filteredRatings = book.ratings.filter(rating => rating.userId === req.auth.userId);
            // SI note déjà attribuée par l'utilisateur ALORS
            if (filteredRatings.length > 0) {
                // Renvoyer status 401 et le message d'erreur 'Book rating already made by the user'
                res.status(401).json({ message: 'Book rating already made by the user' });
            }
            // SINON (SI note non attribuée par l'utilisateur)
            else {

                // Ajouter la nouvelle note
                book.ratings.push({ "userId": req.auth.userId, "grade": req.body.rating });

                // Recalculer la moyenne
                const total = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
                book.averageRating = Math.round(total / book.ratings.length); // arrondir à l'entier le plus proche

                // Sauvegarder les modifications
                await book.save();

                // Renvoyer les infos du livre
                res.status(201).json(book);
            }
        }

    }
    // Gestion des erreurs
    catch (error) {
        // Renvoyer stuatus 400 et l'erreur
        res.status(400).json({ error });
    }
}


/**
 * @function createBook
 * @description Crée un nouveau livre et l'enregistre dans la base de données.
 * @param {Object} req - L'objet de requête HTTP contenant les données du livre.
 * @param {Object} res - L'objet de réponse HTTP permettant d'envoyer une réponse au client.
 */
exports.createBook = (req, res) => {
    // Extraction des données du livre envoyées dans la requête
    const bookObject = JSON.parse(req.body.book);

    // Suppression de l'ID pour éviter toute modification indésirable
    delete bookObject._id;

    // Création d'une nouvelle instance de Book avec les données fournies
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId, // Associe l'utilisateur authentifié au livre
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Génère l'URL de l'image
    });

    try {
        // Sauvegarde du livre dans la base de données
        book.save();

        // Envoi d'une réponse de succès au client
        res.status(201).json({ message: 'Book saved successfully!' });
    }
    // Gestion des erreurs
    catch (error) {
        // Renvoyer status 400 et l'erreur
        res.status(400).json({ error: error });
    }
};


/**
 * @function modifyBook
 * @description Modifie les données d'un livre en fonction de l'ID
 * @param {Object} req - Objet de requête contenant les données du livre et l'utilisateur authentifié.
 * @param {Object} res - Objet de réponse permettant d'envoyer le résultat de la modification.
 * @returns {void} Retourne un message de succès ou une erreur.
 */
exports.modifyBook = async (req, res) => {

    // Vérifie si une nouvelle image a été ajoutée, sinon garde les autres données inchangées
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    try {
        // Recherche le livre dans la base de données
        const book = await Book.findOne({ _id: req.params.id });

        // SI l'utilisateur actuel n'est l'auteur du livre ALORS
        if (book.userId != req.auth.userId) {
            // Renvoyer status 401 et le message 'Not authorized' 
            res.status(401).json({ message: 'Not authorized' });
        }
        //SINON (si utilisateur auteur du livre)
        else {
            try {
                // Met à jour le livre avec les nouvelles données
                await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
                // Renvoie le status 200 et le message 'Book modified!' 
                res.status(200).json({ message: 'Book modified!' });
            }
            // Gestion des erreurs
            catch (error) {
                // Renvoi le status 401 et l'erreur
                res.status(401).json({ error });
            }
        }

    }
    // Gestion des erreurs
    catch (error) {
        // Renvoi le status 400 et le message d'erreur
        res.status(400).json({ error });
    }
};


/**
 * @function getOneBook
 * @description Récupère un livre spécifique en fonction de son identifiant.
 * @param {Object} req - L'objet de requête Express contenant les paramètres.
 * @param {Object} res - L'objet de réponse Express utilisé pour renvoyer les données.
 * @returns {Object} Renvoie un objet JSON contenant les informations du livre ou une erreur.
 */
exports.getOneBook = async (req, res) => {
    try {
        // Recherche du livre dans la base de données avec l'ID fourni dans les paramètres de la requête
        const book = await Book.findOne({ _id: req.params.id });

        // Si le livre est trouvé, retour d'une réponse avec un statut 200 et les données du livre
        res.status(200).json(book);
    } 
    // Gestion des erreurs
    catch (error) {
        // Renvoyer le statut 404 et un message d'erreur
        res.status(404).json({ error: error });
    }
};


/**
 * @function deleteBook
 * @description Supprime un livre par son ID
 * @param {Object} req - Objet de requête contenant l'ID du livre
 * @param {Object} res - Objet de réponse
 * @returns {void} Retourne un message de succès ou une erreur.
 */
exports.deleteBook = async (req, res) => {
    try {
        // Recherche du livre par son ID
        const book = await Book.findOne({ _id: req.params.id });
        
        // SI utilisateur non authorisé ALORS
        if (book.userId != req.auth.userId) {
            // Renvoyer status 401 et le message 'Not authorized' 
            res.status(401).json({ message: 'Not authorized' });
        } 
        // SINON (si utilisateur authorisé)
        else {
            // Extraction du nom du fichier image à supprimer
            const filename = book.imageUrl.split('/images/')[1];
            
            // Suppression du fichier image associé au livre
            fs.unlink(`images/${filename}`, async () => {
                try {
                    // Suppression du livre de la base de données
                    await Book.deleteOne({ _id: req.params.id });
                    // Renvoyer status 200 et le message 'Book deleted !'
                    res.status(200).json({ message: 'Book deleted !' });
                } 
                // Gestion des erreurs
                catch (error) {
                    // Renvoyer status 401 et l'erreur
                    res.status(401).json({ error });
                }
            });
        }
    } 
    // Gestion des erreurs
    catch (error) {
        // Renvoyer status 500 et l'erreur
        res.status(500).json({ error });
    }
};


/**
 * @function getAllBooks
 * @description Récupère tous les livres disponibles
 * @param {Object} req - Objet de requête
 * @param {Object} res - Objet de réponse contenant la liste des livres
 */
exports.getAllBooks = async (req, res) => {
    try {
        // Récupération de tous les livres de la base de données
        const books = await Book.find();
        // Renvoi le status 200 et les infos du livre
        res.status(200).json(books);
    } 
    // Gestion des erreurs
    catch (error) {
        // Renvoie status 400 et l'erreur
        res.status(400).json({ error: error });
    }
};