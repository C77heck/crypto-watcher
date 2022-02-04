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
    setThreshold,
} = require('../controllers/crypto-controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/latest_listings', getLatestListings)

router.get('/new_cryptos', getNewListings);

router.get('/all_cryptos', getAllCryptos);

router.get('/should_sell', getShouldSell);

router.post('/add_new_purchase', [
    check('name').not().isEmpty().escape().trim(),
    check('symbol').not().isEmpty().escape().trim(),
    check('price').not().isEmpty().escape().trim()
], addNewPurchase);

router.post('/set_thresholds', [
    check('first').not().isEmpty().escape().trim(),
    check('second').not().isEmpty().escape().trim(),
    check('third').not().isEmpty().escape().trim()
], setThreshold);

router.post('/start-following', [check('cryptos').isArray()], startFollowing);

router.delete('/stop-following', [check('cryptos').isArray()], stopFollowing);

module.exports = router;
