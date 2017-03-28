var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cons = require('consolidate')
var hbs = require('express-handlebars');

// David: added for db validation
var csrf = require('csurf');
var session = require('client-sessions');
var middleware = require('./middleware');


// database dependencies
mongoose.connect('mongodb://localhost/BalderDash');
mongoose.Promise = Promise;

// routes
var index = require('./routes/index');
var users = require('./routes/users');
var chat = require('./routes/chat');
var games = require('./routes/games');
var questions = require('./routes/questions');

// database connection
var db = mongoose.createConnection('mongodb://localhost/BalderDash');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'Connected to Database'));

// express
var app = express();

// socket.io 
var socket_io = require('socket.io');
var io = socket_io();
app.io = io;

var routes = require('./models/socket')(app.io);

// view engine setup
app.engine('pug', cons.pug);
app.engine('handlebars', cons.handlebars);
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  cookieName: 'session',
  secret: 'keyboard cat',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
app.use(middleware.simpleAuth);


//routes
app.use('/', index);
app.use('/users', users);
app.use('/chat', chat);
app.use('/games', games);
app.use('/questions', questions);


app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
