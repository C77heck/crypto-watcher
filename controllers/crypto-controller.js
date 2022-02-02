const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const Admin = require('../models/admin');

const getPrices = async (req, res, next) => {

    res.status(201).json({product: 'something'})

}

exports = {getPrices};
