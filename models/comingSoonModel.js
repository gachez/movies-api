const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComingSoon = new Schema({
    title: String,
    genre: String,
    description: String,
    rating: String,
    poster: String,
    trailer: String
});

module.exports =  mongoose.model('ComingSoon', ComingSoon);
