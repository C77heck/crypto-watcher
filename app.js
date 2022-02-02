const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const indexRouter = require('./routes/admin');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`app is listening on port: ${port}`));

module.exports = app;
