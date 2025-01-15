const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const booksCtrl = require('../controllers/books');


router.get('/', auth, booksCtrl.getAllBooks);
router.get('/:id', auth, booksCtrl.getOneBook);
router.post('/', auth, booksCtrl.createBook);
router.put('/:id', auth, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

// router.get('/', booksCtrl.getAllBooks);
// router.get('/:id', booksCtrl.getOneBook);
// router.post('/', booksCtrl.createBook);
// router.put('/:id', booksCtrl.modifyBook);
// router.delete('/:id', booksCtrl.deleteBook);

module.exports = router;