var express = require('express');
var bcrypt = require('bcryptjs');
var schema = require('../models/schema');
var utils = require('./utils');   // has functions for creating user session
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
var noUser = {
  username: 'No User'
};
/* GET register page. */
router.get('/register', function(req, res, next) {
  if(req.user == null){
    req.user = noUser;
  }
  res.render('register', { 
    userName: req.user.username,
    csrfToken: req.csrfToken() });
});

/**
 * POST register from regisation form 
 * Create a new user account.
 * Once a user is logged in, they will be sent to the chat page.
 */
router.post('/register', function(req, res, next) {
  // encrypt users password
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);
  // create a new schema.User from the fields in the form 
  var user = new schema.User({
    fname:      req.body.fname,
    lname:      req.body.lname,
    email:      req.body.email,
    username:   req.body.username,
    password:   hash,
  });
  //console.log(user); 
  user.save(function(err) {
    //check for errors
    if (err) {
      var error = 'Something bad happened! Please try again.';

      if (err.code === 11000) {
       res.render('register',{ error: "That email is already registered" });
      }
      return next(err);
      res.render('register', { error: error });
    } else {
      // if no errors we create a new user session and redirect to the chat
      utils.createUserSession(req, res, user);
      res.redirect('/chat');
    }
  });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  if(req.user == null){
    req.user = noUser;
  }
  res.render('login', { 
    userName: req.user.username,
    csrfToken: req.csrfToken() 
  });
});


/**
 * POST login request
 * Log a user into their account.
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/login', function(req, res) {
  // get a single user from their username entered on the webpage
  schema.User.findOne({ username: req.body.username }, 'fname lname email username password data', function(err, user) {
    // console.log(user);
    // cant find user redirect to login with error msg displayed
    if (!user) {
      res.render('login', { error: "Incorrect user name / password.", csrfToken: req.csrfToken() });
    } else {
      // if user found compare encrypted password to match
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // if input is validated create a new user session and redirect to chat
        utils.createUserSession(req, res, user);
        res.redirect('/chat');
      } else {
        // if password is wrong redirecct to login with error msg displayed
        res.render('login', { error: "Incorrect email / password.", csrfToken: req.csrfToken() });
      }
    }
  });
});




module.exports = router;
