var express = require('express');
var bcrypt = require('bcryptjs');
var schema = require('../models/schema');           //user model
var Game = require('../models/game');             //game model
var Question = require('../models/Question.js');    //questions model
var utils = require('./utils');                     // has functions for creating user session, also require login function
var router = express.Router();


/* GET newgame page. */
router.get('/', utils.requireLogin, function (req, res, next) {
    //console.log("i'm here in .get newgame");

    console.log("I'm in this part?");

    res.render('newgame.pug', {
        userName: req.user.username
    });

    /*
if (req.session['hasGameName'] == 'true')
{
    console.log("Restarting a game!");
    req.session['hasGameName'] = null;

    req.session['success'] = 'User Joined Game';
    //req.session['gameName'] = req.session['gameName'];

    //req.session['gameName']= null;
    res.redirect('Game');
   
}
else
{
    res.render('newgame.pug', {
        userName: req.user.username
    });
}
*/

});


/******************************** CREATE LOGIC  ************************************/

/* GET Create page. */
router.get('/Create', utils.requireLogin, function (req, res, next) {
    console.log("i'm here in .get Create");
    res.render('Create.pug');
});

/* POST Create page. */
router.post('/Create', utils.requireLogin, function (req, res, next) {
    console.log("i'm here in .post .Create");

    //console.log(req.body);

    myPlayers = '';
    myRounds = '';
    myGameName = '';
    var  categoriesToAdd = [];

    var isValid = true;

    if (req.body.gameName == "") {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        req.body.gameName = text;

        //console.log("my new game name is: " + req.body.gameName);
    }



    var playersExp = "^[1-9]$";
    if (!req.body.players.match(playersExp)) {
        // console.log("i'm in number of players cannot be blank");
        myPlayers = 'Number of players cannot be blank, 0, or greater than 9.';
        isValid = false && isValid;
    }

    var roundsExp = "^[1-9]$";
    if (!req.body.rounds.match(roundsExp)) {
        //console.log("i'm in number of rounds cannot be blank");
        myRounds = 'Number of rounds cannot be blank, 0, or greater than 9.';
        isValid = false && isValid;
    }

    Game.findOne(
        {
            gameName: req.body.gameName,
            gameActive: true
        }, function (err, game) {
            if (err) next(err);

            if (game) {
                //console.log("gameName was found in database: " + game.gameName);
                myGameName = "Game name already exists, please try again"

                res.render('Create.pug', { invalidPlayers: myPlayers, invalidRounds: myRounds, invalidGameName: myGameName });

            }
            else {
                if (!isValid) {
                    //console.log("i'm in !isValid");
                    res.render('Create.pug', { invalidPlayers: myPlayers, invalidRounds: myRounds, invalidGameName: myGameName });
                }
                else {

                        if (req.body.ludicrousLaws == "on") {
                            categoriesToAdd.push("ludicrousLaws");
                        }

                        if (req.body.definitions == "on") {
                            categoriesToAdd.push("definitions");
                        }

                        if (req.body.famousPeople == "on") {
                            categoriesToAdd.push("famousPeople");
                        }

                        if (req.body.acronyms == "on") {
                            categoriesToAdd.push("acronyms");
                        }

                        if (req.body.movieHeadlines == "on") {
                            categoriesToAdd.push("movieHeadlines");
                        }

                    //console.log("isValid3: " +isValid);
                    var game = new Game({
                        playerNumber: req.body.players,
                        rounds: req.body.rounds,
                        gameActive: true,                   //set game active to false in post
                        gameFull: false,
                        gameName: req.body.gameName,
                        category: categoriesToAdd
                    });

                    console.log("my categories on save: " + req.body.categories);

                    game.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            //console.log('game saved');
                        }
                    });

                    /*
                                    Game.find(function (err, games) 
                                    {
                                        if (err) return console.error(err);
                                        console.log(games);
                                    });
                    
                    */

                    req.session['success'] = 'User Created Game';
                    req.session['gameName'] = game.gameName;
                    res.redirect('Game');
                }
            }
        });

});


/******************************** JOIN LOGIC  ************************************/

/* GET Join page. */
router.get('/Join', utils.requireLogin, function (req, res, next) {
    //console.log("i'm here in .get Join");
    res.render('Join.pug');
});

/* POST Join page. */
router.post('/Join', function (req, res, next) {
    console.log("i'm here in .post .Join");

    console.log(req.body);

    myInvalidCode = '';

    var isValid = true;

    Game.findOne(
        {
            gameName: req.body.code,
            gameActive: true
        }, function (err, gameJoin) {
            if (err) next(err);

            if (gameJoin) {
                console.log("gameName was found in database: " + gameJoin.gameName);

                // check if game is full logic here
                if (gameJoin.gameFull) {
                    myInvalidCode = "Game room is full, please try again"
                    res.redirect('/games/Join', { invalidCode: myInvalidCode });
                } else {
                    req.session['success'] = 'User Joined Game';
                    res.redirect('Game');
                }
            }
            else {
                console.log("gameName was not found in database");

                myInvalidCode = "Game room code was not found, please try again"

                res.render('Join.pug', { invalidCode: myInvalidCode });
            }
        });

});


/******************************** GAME LOGIC  ************************************/


/* GET Game page. */
router.get('/Game', utils.requireLogin, function (req, res, next) {
    console.log("In Game");

    if (req.session['success'] == 'User Created Game') {
        console.log("Yes a user just created a game!");
        req.session['success'] = null;

        console.log("Game name is: " + req.session['gameName']);

        Game.findOne(
            {
                gameName: req.session['gameName'], 
                gameActive: true

            }, function (err, myGame) {
                if (err) next(err);

                if (myGame) {
                    req.session['gameName'] = null;
                    var winners = [];
                    var gameFull = false;
                    Question.find()
                        .then(function (word) {
                            res.render('Game.pug', {
                                title: 'Question Creator', 
                                userName: req.user.username, wordsList: word, categories: myGame.category, rounds: myGame.rounds, numberOfPlayers: myGame.playerNumber, gameName: myGame.gameName, 
                                winnerList: winners, gameFull: myGame.gameFull
                            });
                        });
                }
                else {
                    req.session['gameName'] = null;
                }
            });
    }
    else {
        console.log("No a user did not just create a game.");

        /*
        Question.find()
        .then(function(words) {
            res.render('Game.pug', {title: 'Question Creator',  userName: req.user.username,
            wordsList: words, categories:["words"], rounds:"4", numberOfPlayers: "2"}); 
        });
        */
        if (req.session['success'] == 'User Joined Game') {
            console.log("Yes a user just joined a game!");
            req.session['success'] = null;

            console.log("Game name is: " + req.session['gameName'])

            Game.findOne(
                {
                    gameName: req.session['gameName'],
                    gameActive: true
                }, function (err, myGame) {
                    if (err) next(err);

                    if (myGame) {
                        req.session['gameName'] = null;
                        var winners = [];
                        Question.find()
                            .then(function (words) {
                                res.render('Game.pug', {
                                    title: 'Question Creator',
                                    userName: req.user.username, wordsList: word, categories: myGame.category, rounds: myGame.rounds, numberOfPlayers: myGame.playerNumber, gameName: myGame.gameName, 
                                    winnerList: winners, gameFull: myGame.gameFull
                                });
                            });
                    }
                    else {
                        req.session['gameName'] = null;
                    }
                });
        }
        else {
            req.session['gameName'] = null;

            res.render('newgame.pug', {
                userName: req.user.username
            });
        }
    }



});



/* POST Game page. */
router.post('/Game', function (req, res, next) {
    console.log("I'm in the Game post");
    console.log(req.body.myChoice);

    // winnerList should be returned as a list strings of winners names
    // For loop through winnersList where winner.username is set to user name in find one
    for (winner in winnerList) {
        schema.User.findOne({ username: winner }, 'fname lname email username password gameswon data', function (err, updateUser) {
            // cant find user redirect to error page with error msg displayed
            if (!updateUser) {
                res.render('error.pug', { error: "Could not find user: " + winner });
            }
            else {
                var won = (updateUser.gameswon + 1);
                console.log(winner + " New score: " + won);
                // if user found compare update the users gameswon
                updateUser.gameswon = won;
                updateUser.save(function (err) {
                    if (err) {
                        res.render('error.pug', { error: err });
                    }
                });
            }
        });
    }

    // Update game data information when posting
    console.log("In Game .Post - Game Name: "+myGame.gameName);
    console.log("Another way to get gameName check: " + req.body.gameName);
    Game.findOne({ gameName: myGame.gameName}, function (err, updateGame) {
        // cant find game redirect to error page with error msg displayed
        if (!updateGame) {
            res.render('error.pug', { error: err });
        }
        else {
            console.log("Game to update found");
            // if user found compare update the users gameswon
            //updateGame.gameActive = false;
            //updateGame.winner = "whatever";                          // <---------------needs to be changed / updated
            //updateGame.gameEnd = "som etime"; 
            // updateGame.save(function (err) {
            //     if (err) {
            //         res.render('error.pug', { error: err });
            //     }
            // });
        }
    });

    res.redirect('/games');



    /*
        if (req.body.myChoice == 'choseNo')
        {
            res.render('newgame.pug', {
                    userName: req.user.username
                });
        }
        else
        {
            req.session['hasGameName'] = 'true';
            req.session['gameName'] = req.body.myChoice;
    
            res.render('newgame.pug', {
                    userName: req.user.username
                });
    
            console.log("yes I get here");
        }
        */
});


/******************************** QUESTIONS LOGIC  ************************************/

/* GET questions management page. */
router.get('/questions', utils.requireLogin, function (req, res, next) {

    Question.find({ category: /^words/ })
        .then(function (words) {
            console.log(words);

            Question.find({ category: /^people/ })
                .then(function (people) {
                    console.log(people);

                    Question.find({ category: /^initials/ })
                        .then(function (initials) {
                            console.log(initials);

                            Question.find({ category: /^movies/ })
                                .then(function (movies) {
                                    console.log(movies);

                                    Question.find({ category: /^laws/ })
                                        .then(function (laws) {
                                            console.log(laws);

                                            res.render('createQuestion.hbs', {
                                                title: 'Question Creator',
                                                wordsList: words,
                                                peopleList: people,
                                                initialsList: initials,
                                                moviesList: movies,
                                                lawsList: laws
                                            });
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

function doesQuestionExist(question, fn) {
    Question.findOne({
        question: question.toLowerCase()
    },
        function (err, q) {
            if (q) {
                return fn(null, q)
            } else {

                return fn(new Error('gtg'));
            }
        });
}

router.post('/questions', utils.requireLogin, function (req, res) {
    var question = req.body.question;
    var category = req.body.category;
    var answer = req.body.answer;

    doesQuestionExist(question, function (err, q) {
        if (q) {
            res.status(409).json({ message: "Question already exists" }); //Changed these out to status codes

        } else {
            var newQuestion = new Question();
            newQuestion.question = question;
            newQuestion.answer = answer;
            newQuestion.category = category;
            newQuestion.save();
            res.status(201).json({ message: "Question added" });
        }
    });
});

router.get('/editQuestion/:id', utils.requireLogin, function (req, res) {

    var theId = req.params.id;

    Question.findOne({ _id: theId }, function (err, q) {
        console.log(q);

        res.render('editQuestion.hbs', { title: 'Question Editor', question: q });
    });

});

router.patch('/questions/:id', function (req, res) {

    var id = req.params.id;
    var query = { _id: id };
    var newAnswer = req.body.answer;

    Question.findOneAndUpdate(query, { $set: { answer: newAnswer } })
        .then(function (question) {
            res.status(200).json(question);
        })
        .catch(function (err) {
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