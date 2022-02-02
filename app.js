const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config()

const indexRouter = require('./routes/admin');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const port = process.env.PORT || 3030;
process.env['BIIIITCH'] = 'production'
console.log(process.env);
mongoose
    .connect(process.env.MONGO_URL,
        {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        app.listen(port, () => console.log(`app is listening on port: ${port}`));
    })
    .catch(err => {
        console.log(err)
    })
module.exports = app;
