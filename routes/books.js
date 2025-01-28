const express = require('express');
const auth = require('../middleware/auth');
const { upload, processImage } = require('../middleware/uploadMiddleware');
const booksCtrl = require('../controllers/books');
const router = express.Router();

//Récupère tous les livres.
router.get('/', booksCtrl.getAllBooks); 

//Récupère les 3 livres ayant les meilleures notations
// Attention : garder cette route avant la route '/:id' sinon problème ("bestrating" vu comme identifiant)
router.get('/bestrating', booksCtrl.getBestRating);

//Récupère un livre spécifique par son identifiant.
router.get('/:id', booksCtrl.getOneBook);

// Crée un nouveau livre et une image téléchargée.
router.post('/', auth, upload, processImage, booksCtrl.createBook);

// Modifie un livre existant par son identifiant
router.put('/:id', auth, upload, processImage, booksCtrl.modifyBook);

// Supprime un livre spécifique par son identifiant.
router.delete('/:id', auth, booksCtrl.deleteBook);

// Ajoute une notation à un livre par son identifiant.
router.post('/:id/rating', auth, booksCtrl.ratingBook);


module.exports = router;