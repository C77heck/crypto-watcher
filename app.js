require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const adminRouter = require('./routes/admin-routes');
const cryptoRouter = require('./routes/crypto-routes');
const app = express();

const errorHandler = (err, req, res, next) => {
    console.log('WWWWWWWWW');

    res.status(500).send({ error: err });
}

app.use(function (err, req, res, next) {
    console.log('what the actual fuck');
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    res.send(JSON.stringify(error));
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
    next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', adminRouter);
app.use('/api/crypto', cryptoRouter);

app.use(() => {
    throw new HttpError('Could not find this route.', 404);
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

(async () => {
    try {
        const port = process.env.PORT || 3030;
        await mongoose.connect(process.env.MONGO_URL);
        await app.listen(port, () => console.log(`app is listening on port: ${port}`));
    } catch (e) {
        console.log(e);
    }
})();

module.exports = app;
