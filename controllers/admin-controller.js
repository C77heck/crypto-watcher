const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Admin = require('../models/admin');
const { handleError } = require("../libs/error-handler");
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    handleError(req, next);

    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await Admin.findOne({ email: email })
    } catch (err) {
        return next(new HttpError(
            `Login failed, please try again later.`,
            500
        ))
    }

    if (!existingUser) {
        return next(new HttpError(
            'Invalid credentials, please try again.',
            401
        ))
    }
    let isValidPassword = false;

    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        return next(new HttpError(
            'Could not log you in, please check your credentials and try again',
            401
        ))
    }

    if (!isValidPassword) {
        existingUser.status.loginAttempts += 1;
        await existingUser.save();
        return next(new HttpError(
            'Could not log you in, please check your credentials and try again',
            401
        ))
    } else {
        existingUser.status.passwordRequest = 0;
        await existingUser.save();
    }

    let token;
    try {
        token = jwt.sign({ userId: existingUser.id, email: existingUser.email },
            process.env.JWT_KEY,
            { expiresIn: '24h' }
        )
    } catch (err) {
        console.log(err);
        return next(new HttpError(
            'Login failed, please try again',
            500
        ))
    }

    res.json({
        userData: {
            userId: existingUser.id,
            token: token,
        }
    });
}

const signup = async (req, res, next) => {
    handleError(req, next);
    const { name, email, password, hint, answer } = req.body;
    let existingUser;
    try {
        existingUser = await Admin.findOne({ email: email })
    } catch (err) {
        existingUser = null;
    }

    if (existingUser) {
        return next(new HttpError(
            'The email you entered, is already in use',
            400
        ))
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {

        return next(new HttpError(
            'Could not create user, please try again.',
            500
        ))
    }

    const createdAdmin = new Admin({ name, email, hint, answer, password: hashedPassword })
    try {
        await createdAdmin.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError(
            'Login failed, please try again',
            500
        ))
    }

    let token;
    try {
        token = jwt.sign({ userId: createdAdmin.id, email: createdAdmin.email },
            process.env.JWT_KEY,
            { expiresIn: '24h' }
        )
    } catch (err) {
        console.log(err);
        return next(new HttpError(
            'Login failed, please try again',
            500
        ))
    }

    res.status(201).json({ userData: { userId: createdUser.id, token: token } })
}

exports.login = login;
exports.signup = signup;

