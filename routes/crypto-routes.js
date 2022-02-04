const express = require('express');
const {check} = require('express-validator')
const router = express.Router();
const {
    getLatestListings,
    getNewListings,
    getAllCryptos,
    startFollowing,
    stopFollowing,
    calculateValues,
} = require('../controllers/crypto-controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/latest_listings', getLatestListings)

router.get('/new_cryptos', getNewListings);

router.get('/all_cryptos', getAllCryptos);

router.get('/calculate_values', calculateValues);

router.post('/start-following', [check('cryptos').isArray()], startFollowing);

router.delete('/stop-following', [check('cryptos').isArray()], stopFollowing);

module.exports = router;
