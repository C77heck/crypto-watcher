const express = require('express');
const router = express.Router();
const {getLatestListings, getNewListings, getAllCryptos} = require('../controllers/crypto-controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/latest', getLatestListings)

router.get('/new_cryptos', getNewListings);

router.get('/all_cryptos', getAllCryptos);

router.post('/start-follow', getAllCryptos);

router.delete('/stop-following', getAllCryptos);

module.exports = router;
