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
  res.render('index.pug', { 
    userName: req.user.username
  });
});

router.get('/createQuestion', function(req, res, next) {
    
    Question.find({ category: /^words/ })
        .then(function(words) {
            console.log(words);

            Question.find({ category: /^people/ })
            .then(function(people) {
                console.log(people);

                    Question.find({ category: /^initials/ })
                    .then(function(initials) {
                        console.log(initials);

                            Question.find({ category: /^movies/ })
                            .then(function(movies) {
                                console.log(movies);

                                    Question.find({ category: /^laws/ })
                                    .then(function(laws) {
                                        console.log(laws);

                        res.render('createQuestion.hbs', {title: 'Question Creator', 
                          wordsList: words, 
                          peopleList: people,
                          initialsList: initials,
                          moviesList: movies,
                          lawsList: laws});
                    });
                });
            });
        });
    });
});


module.exports = router;