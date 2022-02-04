const HttpError = require('../models/http-error');
const Price = require('../models/prices');
const Purchase = require('../models/purchase');
const {latestListings, newListings, allCryptos} = require("../libs/api-helper");
const {get, set} = require('../libs/redis-client');
const {json, removeDuplicates} = require('../libs/helpers');
const {CONSTANTS} = require("../libs/constants");

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

const addNewPurchase = async (req, res, next) => {
    try {
        const {name, symbol, price} = req.body;
        const createdPurchase = new Purchase({
            name, symbol, price,
            date: new Date(),
        });

        await createdPurchase.save();
    } catch (e) {
        console.log(e);
    }
    // will have to follow it too.
    res.json({message: 'Success'})
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

const getShouldSell = async (req, res, next) => {
    const {FIRST, SECOND, THIRD} = CONSTANTS.THRESHOLDS;
    const purchasedCryptos = await Purchase.getAll();
    const data = [];
    if (!!purchasedCryptos && !!purchasedCryptos.length) {
        for (const item of purchasedCryptos) {
            const foundItems = (await Price.getLast(item.name) || [])[0] || {};
            const diff = foundItems.price - item.price;
            const thresholds = {
                first: FIRST > diff,
                second: SECOND > diff,
                third: THIRD > diff,
            }
            data.push({diff, ...thresholds, ...item?._doc || {}});
        }
    }

    res.json({data})
}

exports.getLatestListings = getLatestListings;
exports.getNewListings = getNewListings;
exports.getAllCryptos = getAllCryptos;
exports.startFollowing = startFollowing;
exports.stopFollowing = stopFollowing;
exports.getShouldSell = getShouldSell;
exports.addNewPurchase = addNewPurchase;
