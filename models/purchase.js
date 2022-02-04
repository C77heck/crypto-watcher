const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const thresholdTypeSchema = new Schema({
    flat: {type: Number, required: true},
    percentage: {type: Number, required: true},
});

const thresholdSchema = new Schema({
    first: thresholdTypeSchema,
    second: thresholdTypeSchema,
    third: thresholdTypeSchema,
});

const purchasedSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    symbol: {type: String, required: true},
    date: {type: Date, required: true},
    thresholds: thresholdSchema,
});

purchasedSchema.statics.findByName = function (name) {
    return this.where({name: new RegExp(name, 'i')});
}

purchasedSchema.statics.getAll = function () {
    return this.find();
}

purchasedSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Purchase', purchasedSchema);
