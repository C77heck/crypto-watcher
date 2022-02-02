const express = require('express');
const {check} = require('express-validator');
const {signin} = require('../controllers/admin-controller')
const router = express.Router();

router.post('/signin',
    [
        check('accountID').not().isEmpty().escape().trim(),
        check('password').not().isEmpty()
    ], signin);

module.exports = router;
