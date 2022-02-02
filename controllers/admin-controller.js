const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const Admin = require('../models/admin');

const signin = async (req, res, next) => {

    res.status(201).json({product: 'something'})
}

exports.signin = signin;
