const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const priceSchema = new Schema({
    identifier: {type: Number, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    symbol: {type: String, required: true},
    created_at: {type: Date, required: true},
    percentChangeLastHour: {type: Number, required: true},
    percentChangeLastDay: {type: Number, required: true},
    percentChangeLastWeek: {type: Number, required: true},
    percentChangeLastMonth: {type: Number, required: true},
    percentChangeLast60Days: {type: Number, required: true},
    percentChangeLast90Days: {type: Number, required: true},
});
priceSchema.statics.findByName = function (name) {
    return this.where({name: new RegExp(name, 'i')});
}

priceSchema.statics.getLast = function (name) {
    return this.where({name: new RegExp(name, 'i')}).sort({_id: -1}).limit(1);
}

priceSchema.statics.getByIdentifier = function (identifier) {
    return this.findOne({identifier}, {}, {sort: {created_at: -1}})
}

// need a pagination logic here.
priceSchema.statics.getAll = function (limit) {
    return this.find({}, {}, {sort: {created_at: -1}, limit: limit})
}

priceSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Price', priceSchema);
