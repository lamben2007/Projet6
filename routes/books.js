const express = require('express');
const auth = require('../middleware/auth');
const booksCtrl = require('../controllers/books');
const multer = require('../middleware/multer-config');
const router = express.Router();

//
router.get('/', booksCtrl.getAllBooks);
router.get('/:id', booksCtrl.getOneBook);
router.post('/', auth, multer, booksCtrl.createBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;