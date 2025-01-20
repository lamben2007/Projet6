const express = require('express');
const auth = require('../middleware/auth');
const booksCtrl = require('../controllers/books');
// const multer = require('../middleware/multer-config');
const { upload, processImage } = require('../middleware/uploadMiddleware');
const router = express.Router();

//
router.get('/', booksCtrl.getAllBooks);
router.get('/:id', booksCtrl.getOneBook);
// router.post('/', auth, multer, booksCtrl.createBook);
// router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.post('/', auth, upload, processImage, booksCtrl.createBook);
router.put('/:id', auth, upload, processImage, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
// /api/books/:id/rating
router.post('/:id/rating',auth, booksCtrl.ratingBook);


module.exports = router;