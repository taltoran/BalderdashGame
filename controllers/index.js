var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var noUser = {
    username: 'No User'
  };

  if(req.user == null){
    req.user = noUser;
  }
  res.render('index', { 
    userName: req.user.username
  });
});

module.exports = router;
