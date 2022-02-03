const express = require('express');
const {check, body} = require('express-validator')
const {login, signup} = require('../controllers/admin-controller')
const router = express.Router();

router.post('/login',
    [
        check('email').not().isEmpty().escape().trim(),
        check('password').not().isEmpty()
    ], login);

router.post('/signup', [
    body('*').trim().escape(),
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6}),
    check('hint').not().isEmpty().escape(),
    check('answer').isLength({min: 4})
], signup);

module.exports = router;
