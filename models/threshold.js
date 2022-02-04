const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const thresholdSchema = new Schema({
    first: {type: Number, required: true},
    second: {type: Number, required: true},
    third: {type: Number, required: true},
});

thresholdSchema.statics.get = function () {
    return this.findOne();
}

thresholdSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Threshold', thresholdSchema);
