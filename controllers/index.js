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

  var condition = false;
  if(req.user.username == ''){
    condition = false;
  }
  else{
    conditon = true;
  }

  res.render('index', { 
    userName: req.user.username,
    loggedIn: condition
  });
});

module.exports = router;
