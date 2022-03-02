const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const favouriteSchema = new Schema({
    identifier: {type: Number, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    symbol: {type: String, required: true},
});

favouriteSchema.statics.findByName = function (name) {
    return this.where({name: new RegExp(name, 'i')});
}

favouriteSchema.statics.getLast = function (name) {
    return this.where({name: new RegExp(name, 'i')}).sort({_id: -1}).limit(1);
}

favouriteSchema.statics.getByIdentifier = function (identifier) {
    return this.findOne({identifier}, {}, {sort: {created_at: -1}})
}
favouriteSchema.statics.deleteByIdentifier = function (identifier) {
    return this.deleteOne({identifier});
}

// need a pagination logic here.
favouriteSchema.statics.getAll = function (limit) {
    return this.find({}, {}, {sort: {created_at: -1}, limit: limit})
}

favouriteSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Favourite', favouriteSchema);
