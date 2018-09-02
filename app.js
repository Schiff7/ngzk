const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const stylus = require('stylus');

const log4js = require('log4js');

log4js.configure({
  appenders: {
    app: { type: 'console' }
  },
  categories: {
    default: { appenders: ['app'], level: 'info' }
  }
});

const logger = log4js.getLogger('app');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(log4js.connectLogger(logger));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/images', express.static(path.join(__dirname, 'public/src/images')));

module.exports = app;
