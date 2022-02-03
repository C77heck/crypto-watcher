const HttpError = require('../models/http-error');
const Price = require('../models/prices');
const {latestListings, newListings, allCryptos} = require("./helpers/api-helper");

const getLatestListings = async (req, res, next) => {
    const listings = await latestListings();
    if (!!listings.status && !listings.status.error_code) {
        await savePrices(listings?.data || [], listings?.status?.timestamp || new Date());
    }
    // TODO -> launch a job that calculates value matrices in order to be analyzable.

    res.json({listings})
}

const savePrices = async (listings, date) => {
    for (const listing of listings) {
        const {id, name, symbol, quote: {HUF: {price}},} = listing;
        const createdPrice = new Price({
            name, symbol, price, date,
            identifier: id,
            date: new Date(),
        });

        try {
            await createdPrice.save();
        } catch (e) {
            console.log(e);
        }
    }
}

const getNewListings = async (req, res, next) => {
    const newCryptos = await newListings();
    // TODO -> See the purpose of  this.

    res.json({newCryptos})
}
const getAllCryptos = async (req, res, next) => {
    const full_list = await allCryptos();

    res.json({full_list})
}


exports.getLatestListings = getLatestListings;
exports.getNewListings = getNewListings;
exports.getAllCryptos = getAllCryptos;
