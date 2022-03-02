const HttpError = require('../models/http-error');
const Price = require('../models/price');
const Favourite = require('../models/favourite');
const Purchase = require('../models/purchase');
const {numArray} = require("./libs/helpers");
const {Fluctuation} = require("./libs/fluctuation");
const {latestListings, newListings, allCryptos} = require("../libs/api-helper");
const {get, set, clearAll, clear} = require('../libs/redis-client');
const {json, removeDuplicates} = require('../libs/helpers');
const {terminal} = require("../libs/terminal-helper");
const {
    CONSTANTS: {
        REDIS: {
            CRYPTOS_TO_FOLLOW,
            CRYPTOS_FOR_SELECT,
            CRYPTO_FLUCTUATION,
            CRYPTO_PAGINATION,
            FAVOURITE_CRYPTOS,
        },
        PAGINATION_VAL,
        CURRENCY,
        TRANSACTION_FEE
    }
} = require('../libs/constants');
const {handleError} = require("../libs/error-handler");

const getLatestListings = async (req, res, next) => {
    handleError(req, next);

    await clearPriceDB();

    const listings = await latestListings();

    if (!!listings.status && !listings.status.error_code) {
        await savePrices(listings?.data || [], listings?.status?.timestamp || new Date());
        await saveAssets((listings?.data || []));
        await saveFluctuationAsPaginated();
    }

    res.json({listings})
}

const saveAssets = async (data) => {
    const assets = data.map(crypto => ({
        name: crypto.name,
        symbol: crypto.symbol,
        id: crypto.id,
        price: crypto?.quote[CURRENCY]?.price || 0,
    }));

    await set(CRYPTOS_FOR_SELECT, json(assets));
}

const saveFluctuationAsPaginated = async () => {
    try {
        const data = await Price.getAll();
        const paginationLength = numArray(Math.round(data.length / PAGINATION_VAL) || 1);
        const pages = [];
        for (const page of paginationLength) {
            const pageId = `${CRYPTO_FLUCTUATION}-${page}`;
            pages.push(pageId);
            await set(pageId, json(formatFluctuation(data, page, PAGINATION_VAL)));
        }

        await set(CRYPTO_PAGINATION, json(pages));
    } catch (e) {
        console.log(e);
    }
}

const isFavourite = async (prices) => {
    const cachedFavourites = await get(CRYPTOS_TO_FOLLOW);
    const favourites = !!cachedFavourites && !!cachedFavourites.length
        ? cachedFavourites
        : (await Favourite.getAll() || []).map(favourite => favourite?.identifier);

    return prices.map(price => {
        price.isFavourite = favourites.includes(price?.identifier)

        return price;
    });

}

const formatFluctuation = (prices, page, items = 20) => {
    const startPoint = ((page - 1) * items) > 0 ? ((page - 1) * items) : 0;
    const endPoint = (page * items);

    return ((prices || []).slice(startPoint, endPoint) || []).map(price => new Fluctuation(price));
}

const clearPriceDB = async () => {
    try {
        await Price.deleteMany({});
        // await clearRedis();
    } catch (e) {

    }
}

const clearRedis = async () => {
    await clearAll();
}

const getAssets = async (req, res, next) => {
    handleError(req, next);

    try {
        const assets = await get(CRYPTOS_FOR_SELECT);

        res.json({assets: assets || []});
    } catch (e) {
        return next(new HttpError('Sorry, something went wrong.', 500));
    }

}

const savePrices = async (listings, date) => {
    for (const listing of listings) {
        try {
            const {id, name, symbol, quote: {HUF}} = listing;

            const createdPrice = new Price({
                name, symbol,
                price: HUF.price,
                identifier: id,
                created_at: date,
                percentChangeLastHour: HUF.percent_change_1h,
                percentChangeLastDay: HUF.percent_change_24h,
                percentChangeLastWeek: HUF.percent_change_7d,
                percentChangeLastMonth: HUF.percent_change_30d,
                percentChangeLast60Days: HUF.percent_change_60d,
                percentChangeLast90Days: HUF.percent_change_90d,
            });

            await createdPrice.save();
        } catch (e) {

            console.log('HERE', e);
            continue
        }
    }
}

const addToFavourites = async (req, res, next) => {
    handleError(req, next);
    try {
        const {cryptoId} = req.body;
        const priceInstance = await Price.getByIdentifier(cryptoId);

        const createdFavourite = new Favourite({
            name: priceInstance.name,
            symbol: priceInstance.symbol,
            price: priceInstance.price,
            identifier: priceInstance.identifier,
        });

        const favourite = await createdFavourite.save();

        await refreshFavouriteList(favourite?.identifier);
    } catch (e) {
        console.log(e);
        return next(new HttpError('Sorry, something went wrong.', 500));
    }

    res.json({message: 'Success'})
}

const refreshFavouriteList = async (cryptoId, isDelete = false) => {
    try {
        const followedCryptos = removeDuplicates((await get(CRYPTOS_TO_FOLLOW) || []).map(id => parseFloat(id)));
        const identifiers = isDelete ? followedCryptos.filter(crypto => crypto?.identifier !== cryptoId) : [...(followedCryptos || []), cryptoId];
        const prices = await Promise.all(identifiers.map((identifier) => {
            return Price.getByIdentifier(identifier)
        }));
        await set(CRYPTOS_TO_FOLLOW, json(identifiers));
        await set(FAVOURITE_CRYPTOS, json(prices.flat()));
    } catch (e) {
        console.log('Something went wrong', e);
    }
}

const removeFromFavourties = async (req, res, next) => {
    handleError(req, next);
    try {
        const {cryptoId} = req.body;

        await Favourite.deleteByIdentifier(cryptoId);

        await refreshFavouriteList(cryptoId, true);
    } catch (e) {
        return next(new HttpError('Sorry, something went wrong.', 500));
    }

    res.json({message: 'Success'})
}

const addNewPurchase = async (req, res, next) => {
    handleError(req, next);

    const {name, symbol, price, amount, thresholds, identifier} = req.body;
    try {
        const createdPurchase = new Purchase({identifier, name, symbol, price, amount, thresholds, date: new Date()});
        await createdPurchase.save();
    } catch (e) {
        return next(new HttpError(`'Sorry, something went wrong.'${e}`, 500));
    }

    try {
        const followedCryptos = json(await get(CRYPTOS_TO_FOLLOW), []);
        const combined = removeDuplicates([...(followedCryptos || []), name]);
        await set(CRYPTOS_TO_FOLLOW, json(combined));
    } catch (e) {
        return next(new HttpError(`'Sorry, something went wrong.'${e}`, 500));
    }

    res.json({message: 'New purchase has been successfully added to the watchlist'})
}

const updatePurchase = async (req, res, next) => {
    handleError(req, next);
    const {name, symbol, price, amount, thresholds, identifier} = req.body;
    try {
        const purchase = await Purchase.updateDocument(req.params.id, {
            name,
            symbol,
            price,
            amount,
            thresholds,
            identifier
        });
    } catch (e) {
        return next(new HttpError(`'Sorry, something went wrong.'${e}`, 500));
    }

    res.json({message: 'New purchase has been successfully updated'})
}

const deletePurchase = async (req, res, next) => {
    handleError(req, next);

    const {id} = req.params;
    if (!id) {
        return next(new HttpError('Missing id', 503))
    }
    try {
        await Purchase.deleteById(id);
    } catch (e) {
        return next(new HttpError('Could not delete purchase', 503))
    }

    res.json({message: 'Purchase has been successfully deleted.'})
}

const getNewListings = async (req, res, next) => {
    handleError(req, next);

    const newCryptos = await newListings();
    // TODO -> See what could we use this for.
    res.json({newCryptos})
}
const getAllCryptos = async (req, res, next) => {
    handleError(req, next);

    const full_list = await allCryptos();
    res.json({full_list})
}

const getPurcasedPrices = async (req, res, next) => {
    handleError(req, next);

    const purchasedCryptos = await Purchase.getAll();
    const data = [];

    if (!!purchasedCryptos && !!purchasedCryptos.length) {
        for (const item of purchasedCryptos) {
            const foundItems = await Price.getByIdentifier(item.identifier);
            const {first, second, third} = item.thresholds;
            const currentPrice = foundItems?.price * item.amount;
            const percentageDiff = ((currentPrice * TRANSACTION_FEE) / (item.price * TRANSACTION_FEE)) * 100;

            data.push({
                percentageDiff, ...item?._doc || {}, first, second, third, currentPrice,
                priceBoughtFor: item.price,
                potentialProfit: (currentPrice * TRANSACTION_FEE) - (item.price),
            });
        }
    }

    res.json({items: data})
}

const getShouldSell = async (req, res, next) => {
    handleError(req, next);

    const purchasedCryptos = await Purchase.getAll();
    const data = [];

    if (!!purchasedCryptos && !!purchasedCryptos.length) {
        for (const item of purchasedCryptos) {
            const foundItems = (await Price.getByIdentifier(item.identifier) || [])[0] || {};
            const {first, second, third} = item.thresholds;
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

    res.json({items: data})
}


const getFavourites = async (req, res, next) => {
    try {
        const favourites = await get(FAVOURITE_CRYPTOS)

        res.json({items: favourites})
    } catch (e) {
        return next(new HttpError(`Something went wrong`, 500));
    }
}

const getCryptosWithFluctuation = async (req, res, next) => {
    let data = [];
    let total = 0;
    try {
        const pagination = await get(CRYPTO_PAGINATION);
        total = (pagination || []).length;
        const pageProp = `${CRYPTO_FLUCTUATION}-${req.query.page}`;

        if (!(pagination || []).includes(pageProp)) {
            res.json({items: [], total: 0})
        }
        const items = await get(pageProp)

        if (!req.query.search) {
            data = await isFavourite(items);
        } else {
            const all = await getAllFromRedis(total);
            data = search(await isFavourite(all), req.query.search).slice(0, PAGINATION_VAL)
            total = 1;
        }
    } catch (e) {

        return next(new HttpError(`Something went wrong ${e}`, 500));
    }

    res.json({items: data, total: total})
}

const getAllFromRedis = async (rounds) => {
    return await Promise.all(numArray(rounds).map(round => get(`${CRYPTO_FLUCTUATION}-${round}`)));
}

const search = (all, search) => {
    const regex = new RegExp(search, 'i');

    return all.flat().filter(item => regex.test(item?.name) || regex.test(item?.symbol));
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
exports.addToFavourites = addToFavourites;
exports.removeFromFavourties = removeFromFavourties;
exports.getShouldSell = getShouldSell;
exports.addNewPurchase = addNewPurchase;
exports.updatePurchase = updatePurchase;
exports.getAssets = getAssets;
exports.deletePurchase = deletePurchase;
exports.getPurcasedPrices = getPurcasedPrices;
exports.getCryptosWithFluctuation = getCryptosWithFluctuation;
exports.getFavourites = getFavourites;
