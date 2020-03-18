const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs  = require('express-handlebars');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/a01025959', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', () => {
  console.log('Failed to connect to mongodb. Exiting...');
  process.exit(1);
});

db.once('open', function() {
  console.log('Opened mongoDB connection')
});

process.on('SIGINT', () => {
  console.log("Stopping the process....");
  mongoose.connection.close((err) => {
      console.log("Shutting down.....");
  });
});

const ordersRouter = require('./routes/orders');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  extname: '.hbs',
  helpers: require('./views/helpers/custom-helpers.js')
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', ordersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
