const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Movie = new Schema({
    title: String,
    genre: String,
    description: String,
    rating: String,
    poster: String,
    trailer: String
});

module.exports = mongoose.model('Movie', Movie);