require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const adminRouter = require('./routes/admin-routes');
const cryptoRouter = require('./routes/crypto-routes');
const app = express();

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

app.use('/api/users', adminRouter);
app.use('/api/crypto', cryptoRouter);

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
