const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const thresholdSchema = new Schema({
    first: {type: Number, required: true},
    second: {type: Number, required: true},
    third: {type: Number, required: true},
});

const purchasedSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    amount: {type: Number, required: true},
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

purchasedSchema.statics.deleteById = function (id) {
    return this.deleteOne({_id: id});
}

purchasedSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Purchase', purchasedSchema);
