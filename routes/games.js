var express = require('express');
var bcrypt = require('bcryptjs');
var schema = require('../models/modelSetup');
var Game   = require('../models/game');
var utils = require('./utils'); // has functions for creating user session
var router = express.Router();

/* GET newgame page. */
router.get('/newgame', function(req, res, next) {
    //console.log("i'm here in .get newgame");
    res.render('Game/newgame');
});

/* GET Create page. */
router.get('/Create', function(req, res, next) {
    console.log("i'm here in .get Create");
    res.render('Game/Create');
});

/* POST Create page. */
router.post('/Create', function(req, res, next) {
    console.log("i'm here in .post .Create");
    

    //console.log(req.body);

    myPlayers ='';
    myRounds='';
    myGameName='';

    var isValid = true;

    if(req.body.gameName == "")
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        req.body.gameName = text;

        //console.log("my new game name is: " + req.body.gameName);
    }

    

    var playersExp = "^[1-9]$";
    if(!req.body.players.match(playersExp))
    {
       // console.log("i'm in number of players cannot be blank");
        myPlayers = 'Number of players cannot be blank, 0, or greater than 9.';
        isValid = false && isValid;
    }

    var roundsExp = "^[1-9]$";
    if(!req.body.rounds.match(roundsExp))
    {
        //console.log("i'm in number of rounds cannot be blank");
        myRounds = 'Number of rounds cannot be blank, 0, or greater than 9.';
        isValid = false && isValid;
    }

    Game.findOne(
    {
        gameName: req.body.gameName
    }, function(err, game) 
    {
        if (err) next(err);

        if (game) 
        {
            //console.log("gameName was found in database: " + game.gameName);
            myGameName = "Game name already exists, please try again"

            res.render('Game/Create', {invalidPlayers: myPlayers, invalidRounds:myRounds, invalidGameName: myGameName});
            
        }
        else
        {
            if(!isValid)
            {
                //console.log("i'm in !isValid");
                res.render('Game/Create', {invalidPlayers: myPlayers, invalidRounds:myRounds, invalidGameName: myGameName});
            }
            else
            {
                //console.log("isValid3: " +isValid);
                var game = new Game({ 
                    playerNumber: req.body.players, 
                    rounds: req.body.rounds, 
                    category: req.body.categories, 
                    gameName: req.body.gameName, 
                });

                game.save(function (err) 
                {
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
                res.redirect('Game');
            }
        }
    });

    

    

    
});

/* GET Join page. */
router.get('/Join', function(req, res, next) {
    //console.log("i'm here in .get Join");
    res.render('Game/Join');
});

/* POST Join page. */
router.post('/Join', function(req, res, next) {
    console.log("i'm here in .post .Join");
    
    console.log(req.body);

    myInvalidCode='';

    var isValid = true;

    Game.findOne(
    {
        gameName: req.body.code
    }, function(err, game) 
    {
        if (err) next(err);

        if (game) 
        {
            console.log("gameName was found in database: " + game.gameName);
            res.redirect('Game');    
        }
        else
        {
            console.log("gameName was not found in database");

            myInvalidCode = "Game room code was not found, please try again"

            res.render('Game/Join', {invalidCode: myInvalidCode});    
        }
    });

    

    

    
});

/* GET Game page. */
router.get('/Game', function(req, res, next) {
    //console.log("i'm here in .get Game");

    myQuestionOne = "this is my question one?";
    myQuestionTwo = "this is my question two?";
    myQuestionThree = "this is my question three?";
    myQuestionFour = "this is my question four?";
    myQuestionFive = "this is my question five?";
    myQuestionSix = "this is my question six?";


    res.render('Game/Game',{questionOne: myQuestionOne, questionTwo: myQuestionTwo, questionThree: myQuestionThree,
        questionFour: myQuestionFour, questionFive: myQuestionFive, questionSix: myQuestionSix});
});

/* POST Game page. */
router.post('/Game', function(req, res, next) {
    //console.log("i'm here in .post .Game");
    res.render('Game/Game');
});




module.exports = router;