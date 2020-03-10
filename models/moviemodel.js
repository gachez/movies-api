const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Movie = new Schema({
    id: Number,
    title: String,
    year: String,
    runtime: String,
    genres: Array,
    director: String,
    actors: String,
    plot: String,
    posterUrl: String
});

module.exports = mongoose.model('Movie', Movie);