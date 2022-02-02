const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const Admin = require('../models/admin');
const {getListings} = require("./helpers/api-helper");

const getPrices = async (req, res, next) => {
    const listings = await getListings();
    console.log({listings});
    res.status(201).json({listings})
}


exports.getPrices = getPrices;
