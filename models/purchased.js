const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const purchasedSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    symbol: {type: String, required: true},
    date: {type: Date, required: true},
});

purchasedSchema.statics.findByName = function (name) {
    return this.where({name: new RegExp(name, 'i')});
}

purchasedSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Purchased', purchasedSchema);
