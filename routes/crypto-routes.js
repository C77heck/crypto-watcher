const express = require('express');
const {check} = require('express-validator')
const router = express.Router();
const {
    getLatestListings,
    getNewListings,
    getAllCryptos,
    startFollowing,
    stopFollowing,
    getShouldSell,
    addNewPurchase,
    updatePurchase,
    getAssets,
    deletePurchase,
    getPurcasedPrices,
} = require('../controllers/crypto-controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/latest_listings', getLatestListings);

router.get('/get_select_assets', getAssets);

router.get('/new_cryptos', getNewListings);

router.get('/all_cryptos', getAllCryptos);

router.get('/get_purchases', getPurcasedPrices);

router.get('/should_sell', getShouldSell);

router.post('/add_new_purchase', [
    check('name').not().isEmpty().escape().trim(),
    check('symbol').not().isEmpty().escape().trim(),
    check('price').not().isEmpty().escape().trim().isNumeric(),
    check('amount').not().isEmpty().escape().trim().isNumeric(),
    check('thresholds').not().isEmpty(),
], addNewPurchase);

router.patch('/update_purchase/:id', [
    check('name').not().isEmpty().escape().trim(),
    check('symbol').not().isEmpty().escape().trim(),
    check('price').not().isEmpty().escape().trim().isNumeric(),
    check('amount').not().isEmpty().escape().trim().isNumeric(),
    check('thresholds').not().isEmpty(),
], updatePurchase);

router.post('/start_following', [check('cryptos').isArray()], startFollowing);

router.delete('/stop_following', [check('cryptos').isArray()], stopFollowing);
router.delete('/delete_purchase/:id', [], deletePurchase);

module.exports = router;
