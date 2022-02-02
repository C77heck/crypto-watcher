const express = require('express');
const router = express.Router();
const {getPrices} = require('../controllers/crypto-controller');

router.get('/', getPrices)

router.get('/prices', [], getPrices);

module.exports = router;
