const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, minlength: 6},
    hint: {type: String, required: true},
    answer: {type: String, required: true},
    status: {
        loginAttempts: {type: Number, required: true},
        isBlocked: {type: Boolean, required: true}
    }
});

adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Admin', adminSchema);
