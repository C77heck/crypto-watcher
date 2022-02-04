const HttpError = require('../models/http-error');
const Price = require('../models/prices');
const {latestListings, newListings, allCryptos} = require("../libs/api-helper");
const {get, set} = require('../libs/redis-client');
const {json, removeDuplicates} = require('../libs/helpers');

const getLatestListings = async (req, res, next) => {
    const listings = await latestListings();
    if (!!listings.status && !listings.status.error_code) {
        await savePrices(listings?.data || [], listings?.status?.timestamp || new Date());
    }

    res.json({listings})
}

const savePrices = async (listings, date) => {
    for (const listing of listings) {
        try {
            const {id, name, symbol, quote: {HUF: {price, percent_change_1h}},} = listing;
            const createdPrice = new Price({
                name, symbol, price, date,
                identifier: id,
                date: new Date(),
                percentChangeLastHour: percent_change_1h,
            });

            await createdPrice.save();
        } catch (e) {
            console.log(e);
        }
    }
}

const startFollowing = async (req, res, next) => {
    try {
        const {cryptos} = req.body;
        const followedCryptos = json(await get('cryptos-to-follow'), []);
        const combined = removeDuplicates([...(followedCryptos || []), ...cryptos]);
        await set('cryptos-to-follow', json(combined));

        res.json({combined, followedCryptos})
    } catch (e) {
        return next(new HttpError('Sorry, something went wrong.', 500));
    }
}

const stopFollowing = async (req, res, next) => {
    try {
        const {cryptos} = req.body;
        const followedCryptos = json(await get('cryptos-to-follow'), []);
        const filtered = (followedCryptos || []).filter(item => !cryptos.includes(item))
        await set('cryptos-to-follow', json(filtered));

        res.json({filtered})
    } catch (e) {
        return next(new HttpError('Sorry, something went wrong.', 500));
    }
}

const getNewListings = async (req, res, next) => {
    const newCryptos = await newListings();
    // TODO -> See what could we use this for.

    res.json({newCryptos})
}
const getAllCryptos = async (req, res, next) => {
    const full_list = await allCryptos();

    res.json({full_list})
}

const calculateValues = async (req, res, next) => {
    const foundItems = await Price.findByName(req.query.name || '');
    if (!!foundItems && !!foundItems.length) {
        // need the price we bought it for for comparison
        for (const item of foundItems) {

        }
    }

    res.json({foundItems})
}

exports.getLatestListings = getLatestListings;
exports.getNewListings = getNewListings;
exports.getAllCryptos = getAllCryptos;
exports.startFollowing = startFollowing;
exports.stopFollowing = stopFollowing;
exports.calculateValues = calculateValues;
