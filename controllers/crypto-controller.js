const HttpError = require('../models/http-error');
const Price = require('../models/prices');
const {latestListings, newListings, allCryptos} = require("../libs/api-helper");
const {get, set} = require('../libs/redis-client');
const {json} = require('../libs/helpers');

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
        const {id, name, symbol, quote: {HUF: {price, percent_change_1h}},} = listing;
        const createdPrice = new Price({
            name, symbol, price, date,
            identifier: id,
            date: new Date(),
            percentChangeLastHour: percent_change_1h,
        });

        try {
            await createdPrice.save();
        } catch (e) {
            console.log(e);
        }
    }
}

const startFollowing = async (req, res, next) => {
    const {cryptos} = req.body;
    const followedCryptos = json(get('cryptos-to-follow'), []);
    const combined = [...(followedCryptos || []), cryptos];
    await set('cryptos-to-follow', combined);

    res.json({combined})
}

const stopFollowing = async (req, res, next) => {
    const {cryptos} = req.body;
    const followedCryptos = json(get('cryptos-to-follow'), []);
    const newFollowedCryptos = (followedCryptos || []).filter(item => !cryptos.includes(item.name))
    await set('cryptos-to-follow', newFollowedCryptos);

    res.json({newFollowedCryptos})
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
exports.startFollowing = startFollowing;
exports.stopFollowing = stopFollowing;
