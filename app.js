require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');


//
try {
  //
  mongoose.connect(process.env.ConnexionStringMongoDB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  //
  console.log('Connexion à MongoDB réussie !')
} catch (error) {
  //
  console.log('Connexion à MongoDB échouée !')
}


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use("/images", express.static("images"));

app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;
