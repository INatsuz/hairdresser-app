const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");

const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

const http_app = express();

http_app.use(function (req, res) {
	console.log("Redirecting to https " + "https://" + req.headers.host + req.url)
	res.redirect('https://' + req.headers.host + req.url);
});

const app = express();

app.use(cors({origin: ["http://127.0.0.1:5173", "http://localhost:3000"], credentials: true }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);
app.use('/users', usersRouter);
app.use('/', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

module.exports = {
	app: app,
	http_app: http_app
};

