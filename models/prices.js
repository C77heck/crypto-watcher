const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

module.exports = mongoose.model('Price', new Schema({
    identifier: {type: Number, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    symbol: {type: String, required: true},
    date: {type: Date, required: true},
}).plugin(uniqueValidator));
