const Book = require('../models/book');
const fs = require('fs');


// Les 3 meilleurs livres
exports.getBestRating = async (req, res, next) => {
    try {
        const topBooks = await Book.find()
            .sort({ averageRating: -1 })
            .limit(3); // remettre à 3

        console.log('Top 3 documents :', topBooks);

        //
        res.status(201).json(topBooks);

    } catch (error) {
        //
        res.status(400).json({ error });
    }

}

// Notation d'un livre
exports.ratingBook = async (req, res, next) => {

    try {

        // console.log("body:", req.body);

        // Vérifier note comprise entre 0 et 5
        if (req.body.rating < 0 || req.body.rating > 5)
            //
            res.status(401).json({ message: 'Error rating' });
        //
        else {

            // Rechercher les informations du livre en fonction de son ID
            const book = await Book.findOne({ _id: req.params.id })

            // Vérifier si la note déjà attribuée par l'utilisateur
            const filteredRatings = book.ratings.filter(rating => rating.userId === req.body.userId);
            if (filteredRatings.length > 0) {
                //
                res.status(401).json({ message: 'Book rating already made by the user' });
            }
            // SINON (note non attribuée par l'utilisateur)
            else {

                // Ajouter la nouvelle note
                book.ratings.push({ "userId": req.body.userId, "grade": req.body.rating });

                // Recalculer la moyenne
                const total = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
                // book.averageRating = total / book.ratings.length;
                book.averageRating = Math.round(total / book.ratings.length); // arrondir à l'entier le plus proche
                // console.log("note moyenne:", book.averageRating);

                // Sauvegarder les modifications
                await book.save();

                // Renvoyer les infos du livre
                res.status(201).json(book);
            }
        }

    }

    catch (error) {
        res.status(400).json({ error });
    }

}

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