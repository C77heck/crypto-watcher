const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const Admin = require('../models/admin');
const Price = require('../models/price');
const {getLatestListings, getNewListings, getAllCryptos} = require("./helpers/api-helper");

const getLatestListings = async (req, res, next) => {
    const listings = await getLatestListings();
    const price = new Price({
        name: '',
        price: 0,
        hufPrice: 0,
        pricePerUnit: 0,
        date: new Date(),
    });

    try {
        await price.save();
    } catch (e) {
        return next(new HttpError(
            'Something went wrong',
            500
        ))
    }

    // TODO -> launch a job that calculates value matrices in order to be analyzable.

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
