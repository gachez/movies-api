const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TvShow = new Schema({
    title: String,
    genre: String,
    description: String,
    rating: String,
    poster: String,
    trailer: String
});

module.exports = mongoose.model('TvShow', TvShow);