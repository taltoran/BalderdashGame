var express = require('express');
var bcrypt = require('bcryptjs');
var schema = require('../models/schema');
var utils = require('./utils');   // has functions for creating user session
var router = express.Router();


/* GET questions page. */
router.get('/', utils.requireLogin, function(req, res, next) {
  res.render('questions.pug');
});

/* GET questions view page. */
router.get('/View', utils.requireLogin, function(req, res, next) {
    // get a single user from their username entered on the webpage
  res.render('questionView.pug',
  {
      questions: schema.Question
  });
});

/* GET questions create page. */
router.get('/Create', utils.requireLogin, function(req, res, next) {
  res.render('questionCreate.pug');
});

module.exports = router;