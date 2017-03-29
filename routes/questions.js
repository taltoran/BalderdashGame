var express = require('express');
var bcrypt = require('bcryptjs');
var schema = require('../models/schema');
var utils = require('./utils');   // has functions for creating user session
var router = express.Router();
var Question = require('../models/Question.js');


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

router.get('/', function(req, res, next) {
    
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
    /*Question.find(function (err, questions){
        //res.render('createQuestion', {title: 'Question Creator'});
        res.send(questions);
    });*/ 
    //{ category: /^words/ }, 
    /*var resultArray = [];
    var cursor = db.collection('questions').find();
    cursor.forEach(function(doc, err) {
        assert.equal(null, err);
        resultArray.push(doc);
    }, function() {
        db.close();
        res.render('createQuestion', {items: resultArray, title: 'Question Creator'});
    });  */   

function doesUserExist(question, fn) {
    Question.findOne({
            question: question.toLowerCase()
        },
        function(err, q) {
            if (q) {
                return fn(null, q)
            } else {

                return fn(new Error('gtg'));
            }
        });
}

router.post('/', function(req, res) {
    var question = req.body.question;
    var category = req.body.category;
    var answer = req.body.answer;

    doesUserExist(question, function(err, q) {
        if (q) {
            res.status(409).json({ message: "Question already exists" }); //Changed these out to status codes

        } else {
            var newQuestion = new Question();
            newQuestion.question = question;
            newQuestion.answer = answer;
            newQuestion.category = category;
            newQuestion.save();
            res.status(201).json({ message: "Question added"});
        }
    });
});

router.get('/editQuestion/:id', function(req, res) {

    var theId = req.params.id;

    Question.findOne({ _id: theId}, function(err, q) {
        console.log(q);

        res.render('editQuestion.hbs', {title: 'Question Editor', question: q });
    });

});

router.patch('/questions/:id', function(req, res) {
    
    var id = req.params.id;
    var query = { _id: id };
    var newAnswer = req.body.answer;

    Question.findOneAndUpdate(query, {$set:{answer: newAnswer}})
        .then(function(question){
            res.status(200).json(question);
        })
        .catch(function(err){
            return res.status(500).json(err);
        })
    
    /*var theQuestion = req.params.id;
    var query = { question: theQuestion };
    var newAnswer = document.getElementById("editAnswer").value;

    Model.findOneAndUpdate(query, { $set: {answer: newAnswer }}, options, callback)

    MyModel.findOneAndUpdate(
        query, // find a document with that filter
        modelDoc, // document to insert when nothing was found
        {upsert: true, new: true, runValidators: true}, // options
        function (err, doc) { // callback
            if (err) {
                // handle error
            } else {
                // handle document
                doc.answer = newAnswer;
            }
        }
    );*/
});


module.exports = router;

module.exports = router;