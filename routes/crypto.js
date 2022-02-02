const express = require('express');
const router = express.Router();
const {getPrices} = require('../controllers/crypto-controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/', getPrices)

router.get('/prices', [], getPrices);

module.exports = router;
