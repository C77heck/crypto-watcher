const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

module.exports = mongoose.model('Price', new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    hufPrice: {type: Number, required: true},
    pricePerUnit: {type: Number, required: true},
    date: {type: Date, required: true},
}).plugin(uniqueValidator));
