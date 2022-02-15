const HttpError = require('../models/http-error');
const Price = require('../models/prices');
const Purchase = require('../models/purchase');
const { latestListings, newListings, allCryptos } = require("../libs/api-helper");
const { get, set } = require('../libs/redis-client');
const { json, removeDuplicates } = require('../libs/helpers');
const { terminal } = require("../libs/terminal-helper");
const { CONSTANTS: { CRYPTOS_TO_FOLLOW, CRYPTOS_FOR_SELECT, CURRENCY, TRANSACTION_FEE } } = require('../libs/constants');

const getLatestListings = async (req, res, next) => {
    const listings = await latestListings();

    if (!!listings.status && !listings.status.error_code) {
        await savePrices(listings?.data || [], listings?.status?.timestamp || new Date());
        const assets = (listings?.data || []).map(crypto => ({
            name: crypto.name,
            symbol: crypto.symbol,
            id: crypto.id,
            price: crypto?.quote[CURRENCY]?.price || 0,
        }));
        await set(CRYPTOS_FOR_SELECT, json(assets));
    }

    res.json({ listings })
}

const getAssets = async (req, res, next) => {
    try {
        const assets = await get(CRYPTOS_FOR_SELECT);

        res.json({ assets: !!assets ? json(assets) : [] });
    } catch (e) {
        return next(new HttpError('Sorry, something went wrong.', 500));
    }

}

const savePrices = async (listings, date) => {
    for (const listing of listings) {
        try {
            const { id, name, symbol, quote: { HUF: { price, percent_change_1h } }, } = listing;
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
        const { cryptos } = req.body;
        const followedCryptos = json(await get(CRYPTOS_TO_FOLLOW), []);
        const combined = removeDuplicates([...(followedCryptos || []), ...cryptos]);
        await set(CRYPTOS_TO_FOLLOW, json(combined));

        res.json({ combined, followedCryptos })
    } catch (e) {
        return next(new HttpError('Sorry, something went wrong.', 500));
    }
}

const stopFollowing = async (req, res, next) => {
    try {
        const { cryptos } = req.body;
        const followedCryptos = json(await get(CRYPTOS_TO_FOLLOW), []);
        const filtered = (followedCryptos || []).filter(item => !cryptos.includes(item))
        await set(CRYPTOS_TO_FOLLOW, json(filtered));

        res.json({ filtered })
    } catch (e) {
        return next(new HttpError('Sorry, something went wrong.', 500));
    }
}

const addNewPurchase = async (req, res, next) => {
    const { name, symbol, price, amount, thresholds } = req.body;
    try {
        console.log({ name, symbol, price, thresholds });
        const createdPurchase = new Purchase({ name, symbol, price, amount, thresholds, date: new Date() });
        await createdPurchase.save();
    } catch (e) {
        console.log(e);
        return next(new HttpError('Sorry, something went wrong.', 500));
    }

    try {
        const followedCryptos = json(await get(CRYPTOS_TO_FOLLOW), []);
        const combined = removeDuplicates([...(followedCryptos || []), name]);
        await set(CRYPTOS_TO_FOLLOW, json(combined));
    } catch (e) {
        return next(new HttpError('Sorry, something went wrong.', 500));
    }

    res.json({ message: 'Success' })
}

const getNewListings = async (req, res, next) => {
    const newCryptos = await newListings();
    // TODO -> See what could we use this for.
    console.log();
    res.json({ newCryptos })
}
const getAllCryptos = async (req, res, next) => {
    const full_list = await allCryptos();
    res.json({ full_list })
}

const getShouldSell = async (req, res, next) => {
    const purchasedCryptos = await Purchase.getAll();
    const data = [];

    if (!!purchasedCryptos && !!purchasedCryptos.length) {
        for (const item of purchasedCryptos) {
            const foundItems = (await Price.getLast(item.name) || [])[0] || {};
            const { first, second, third } = item.thresholds;

            console.log(item);
            const currentPrice = foundItems.price * item.amount;
            const percentageDiff = ((currentPrice * TRANSACTION_FEE) / (item.price * TRANSACTION_FEE)) * 100;
            getThreshold(first > percentageDiff, 'first', item.name);
            getThreshold(second > percentageDiff, 'second', item.name);
            getThreshold(third > percentageDiff, 'third', item.name);

            data.push({
                percentageDiff, ...item?._doc || {}, first, second, third, currentPrice,
                priceBoughtFor: item.price,
                potentialProfit: (currentPrice * TRANSACTION_FEE) - (item.price * TRANSACTION_FEE),
            });
        }
    }

    res.json({ items: data })
}

const getThreshold = (isThresholdHit, level, cryptoName) => {
    if (false && isThresholdHit) {
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
exports.getAssets = getAssets;
