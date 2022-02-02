const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const Admin = require('../models/admin');
const {getLatestListings, getNewListings, getAllCryptos} = require("./helpers/api-helper");

const getLatestListings = async (req, res, next) => {
    const listings = await getLatestListings();
    console.log({listings});
    res.json({listings})
}
const getNewListings = async (req, res, next) => {
    const newCryptos = await getNewListings();
    console.log({newCryptos});
    res.json({newCryptos})
}
const getAllCryptos = async (req, res, next) => {
    const allCryptos = await getAllCryptos();
    console.log({allCryptos});
    res.json({allCryptos})
}


exports.getLatestListings = getLatestListings;
exports.getNewListings = getNewListings;
exports.getAllCryptos = getAllCryptos;
