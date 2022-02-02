require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Redis = require("ioredis");
const HttpError = require('./models/http-error');
const adminRouter = require('./routes/admin');
const app = express();

const {get, set} = require('./libs/redis-client');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
    next();
})

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', adminRouter);

app.use(() => {
    throw new HttpError('Could not find this route.', 404);
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
