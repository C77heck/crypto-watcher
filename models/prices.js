const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const priceSchema = new Schema({
    identifier: {type: Number, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    symbol: {type: String, required: true},
    date: {type: Date, required: true},
    percentChangeLastHour: {type: Number, required: true},
});
priceSchema.statics.findByName = function (name) {
    return this.where({name: new RegExp(name, 'i')});
}

priceSchema.statics.getLast = function (name) {
    return this.where({name: new RegExp(name, 'i')}).sort({_id: -1}).limit(1);
}

priceSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Price', priceSchema);
