const Book = require('../models/book');
const fs = require('fs');


// Création d'un livre
exports.createBook = (req, res) => {
    //
    const bookObject = JSON.parse(req.body.book);
    console.log(bookObject)

    delete bookObject._id;
    // delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    //
    try {
        //
        book.save();
        //
        res.status(201).json({ message: 'Book saved successfully!' });
    } catch (error) {
        //
        res.status(400).json({ error: error });
    }
}


// Modification des données d'un livre
exports.modifyBook = async (req, res) => {
    //
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    //
    try {
        //
        const book = await Book.findOne({ _id: req.params.id })
        //
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Not authorized' });
        }
        else {
            try {
                await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                res.status(200).json({ message: 'Book modified!' })
            } catch (error) {
                res.status(401).json({ error })
            }
        }

    } catch (error) {
        res.status(400).json({ error });
    }
}


// Lecture des données d'un livre
exports.getOneBook = async (req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ error: error });
    }
};


// Suppression d'un livre
exports.deleteBook = async (req, res) => {
    try {
        //
        const book = await Book.findOne({ _id: req.params.id });
        //
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Not authorized' });
        } else {
            //
            const filename = book.imageUrl.split('/images/')[1];
            //
            fs.unlink(`images/${filename}`, async () => {
                try {
                    //
                    await Book.deleteOne({ _id: req.params.id })
                    //
                    res.status(200).json({ message: 'Book deleted !' })
                } catch (error) {
                    res.status(401).json({ error })
                }
            });

        }
    } catch (error) {
        res.status(500).json({ error })
    }

}


// Lecture des données de tous les livres
exports.getAllBooks = async (req, res) => {
    try {
        //
        const book = await Book.find();
        //
        res.status(200).json(book);
    }
    // 
    catch (error) {
        res.status(400).json({ error: error })
    }
}