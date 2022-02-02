const express = require('express');
const {check, sanitize, body} = require('express-validator')
const {signin, signup} = require('../controllers/admin-controller')
const router = express.Router();

router.post('/signin',
    [
        sanitize('*'),
        check('accountID').not().isEmpty().escape().trim(),
        check('password').not().isEmpty()
    ], signin);

router.post('/signup', [
    sanitize('*'),
    body('*').trim().escape(),
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6}),
    check('hint').not().isEmpty().escape(),
    check('answer').isLength({min: 4})
], signup);

module.exports = router;
