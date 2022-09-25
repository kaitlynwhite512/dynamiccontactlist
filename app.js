var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const ex_session = require('express-session');
var logger = require('morgan');
const https = require('https');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/cmps369';
var db = null;
let mycontacts = null;

var app;

const linkRequestToCollection = (req, res, next) => {
  req.db = db;
  req.mycontacts = mycontacts;
  next();
}


const startup = async() => {

  try {

    app = express();

    const connection = await MongoClient.connect(url);
    const db = connection.db('cmps369');
    mycontacts = await db.createCollection("mycontacts");

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(ex_session({secret: 'cmps:369'}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(linkRequestToCollection);

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/contactedit', indexRouter);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');

    });

    
  } catch (ex) {
    console.error(ex);
  }

}


startup();

module.exports = app;