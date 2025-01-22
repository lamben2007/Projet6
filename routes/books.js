const express = require('express');
const auth = require('../middleware/auth');
const booksCtrl = require('../controllers/books');
// const multer = require('../middleware/multer-config');
const { upload, processImage } = require('../middleware/uploadMiddleware');
const router = express.Router();

//
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating); // BLA : avant la route "/:id" sinon "bestrating" vu comme un identifiant book
router.get('/:id', booksCtrl.getOneBook);
router.post('/', auth, upload, processImage, booksCtrl.createBook);
router.put('/:id', auth, upload, processImage, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating',auth, booksCtrl.ratingBook);


module.exports = router;