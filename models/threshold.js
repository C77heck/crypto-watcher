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

thresholdSchema.statics.get = function () {
    return this.findOne();
}

thresholdSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Threshold', thresholdSchema);
