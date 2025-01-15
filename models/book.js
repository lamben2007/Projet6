const mongoose = require('mongoose');


//
const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    grade: { type: Number, required: true },
});

//     userId : String - identiant MongoDB unique de l'utilisateur qui a créé le livre
//     title : String - titre du livre
//     author : String - auteur du livre
//     imageUrl : String - illustration/couverture du livre
//     year: Number - année de publication du livre
//     genre: String - genre du livre
//     ratings : [
//          {
//              userId : String - identiant MongoDB unique de l'utilisateur qui a noté le livre
//              grade : Number - note donnée à un livre
//          }
//     ] - notes données à un livre
//     averageRating : Number - note moyenne du livre
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: { type: [ratingSchema], required: true },
    averageRating: { type: Number, required: true },
});







module.exports = mongoose.model('Book', bookSchema);





// Book {
//     userId : String - identiant MongoDB unique de l'utilisateur qui a créé le livre
//     title : String - titre du livre
//     author : String - auteur du livre
//     imageUrl : String - illustration/couverture du livre
//     year: Number - année de publication du livre
//     genre: String - genre du livre
//     ratings : [
//     {
//     userId : String - identiant MongoDB unique de l'utilisateur qui a noté le livre
//     grade : Number - note donnée à un livre
//     }
//     ] - notes données à un livre
//     averageRating : Number - note moyenne du livre
//     }