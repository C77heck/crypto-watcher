const HttpError = require('../models/http-error');
const Price = require('../models/prices');
const Purchase = require('../models/purchase');
const Threshold = require('../models/threshold');
const {latestListings, newListings, allCryptos} = require("../libs/api-helper");
const {get, set} = require('../libs/redis-client');
const {json, removeDuplicates} = require('../libs/helpers');
const {terminal} = require("../libs/terminal-helper");

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
    const {name, symbol, price} = req.body;

    try {
        const createdPurchase = new Purchase({
            name, symbol, price,
            date: new Date(),
        });

        await createdPurchase.save();
    } catch (e) {
        console.log(e);
    }

    try {
        const followedCryptos = json(await get('cryptos-to-follow'), []);
        const combined = removeDuplicates([...(followedCryptos || []), name]);
        await set('cryptos-to-follow', json(combined));
    } catch (e) {
        return next(new HttpError('Sorry, something went wrong.', 500));
    }

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

const setThreshold = async (req, res, next) => {
    const {first, second, third} = req.body;
    const thresholds = await Threshold.get();

    if (!thresholds) {
        try {
            const createdThreshold = new Threshold({
                first: {
                    flat: first.flat,
                    percentage: first.percentage,
                },
                second: {
                    flat: second.flat,
                    percentage: second.percentage,
                },
                third: {
                    flat: third.flat,
                    percentage: third.percentage,
                }
            });

            await createdThreshold.save();

            res.json({thresholds: createdThreshold})
        } catch (e) {
            // console.log(e);
            return next(new HttpError('Sorry, something went wrong.', 500));
        }
    } else {
        try {
            thresholds.first = {flat: first.flat, percentage: first.percentage};
            thresholds.first = {flat: first.flat, percentage: first.percentage};
            thresholds.second = {flat: second.flat, percentage: second.percentage};
            thresholds.second = {flat: second.flat, percentage: second.percentage};
            thresholds.third = {flat: third.flat, percentage: third.percentage};
            thresholds.third = {flat: third.flat, percentage: third.percentage};

            await thresholds.save();

            res.json({thresholds})
        } catch (e) {
            console.log(e);
            return next(new HttpError('Sorry, something went wrong.', 500));
        }
    }
}

const getThresholds = async () => {
    const thresholds = await Threshold.get();

    return {
        first: thresholds?.first || {},
        second: thresholds?.second || {},
        third: thresholds?.third || {},
    }
}

const getShouldSell = async (req, res, next) => {
    const {first, second, third} = await getThresholds();
    const purchasedCryptos = await Purchase.getAll();
    const data = [];

    if (!!purchasedCryptos && !!purchasedCryptos.length) {
        for (const item of purchasedCryptos) {
            const foundItems = (await Price.getLast(item.name) || [])[0] || {};
            const flatDiff = foundItems.price - item.price;
            const percentageDiff = foundItems.price - item.price; // figure how to calculate this.
            const thresholds = {
                first: {
                    flat: getThreshold(first.flat > flatDiff, 'first flat', item.name),
                    percentage: getThreshold(first.percentage > percentageDiff, 'first percentage', item.name),
                },
                second: {
                    flat: getThreshold(second.flat > flatDiff, 'second flat', item.name),
                    percentage: getThreshold(second.percentage > percentageDiff, 'second percentage', item.name),
                },
                third: {
                    flat: getThreshold(third.flat > flatDiff, 'third flat', item.name),
                    percentage: getThreshold(third.percentage > percentageDiff, 'third percentage', item.name),
                },
            }
            data.push({flatDiff, percentageDiff, ...thresholds, ...item?._doc || {}});
        }
    }

    res.json({data})
}

const getThreshold = (isThresholdHit, level, cryptoName) => {
    if (isThresholdHit) {
        sendNotification(level, cryptoName);
    }

    return isThresholdHit;
}

const sendNotification = (level, cryptoName) => {
    terminal(`osascript -e 'display alert "SELLING ADVISE" message "${cryptoName} has reached ${level} level of threshold. consider selling"'`);
}

exports.getLatestListings = getLatestListings;
exports.getNewListings = getNewListings;
exports.getAllCryptos = getAllCryptos;
exports.startFollowing = startFollowing;
exports.stopFollowing = stopFollowing;
exports.getShouldSell = getShouldSell;
exports.addNewPurchase = addNewPurchase;
exports.setThreshold = setThreshold;
