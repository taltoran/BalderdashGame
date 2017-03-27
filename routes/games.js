var express = require('express');
var bcrypt = require('bcryptjs');
var schema = require('../models/schema');
var Game   = require('../models/game');
var utils = require('./utils'); // has functions for creating user session
var router = express.Router();

// assign swig engine to .hbs files
//app.set('view engine', 'handlebars');

/* GET newgame page. */
router.get('/', utils.requireLogin, function(req, res, next) {
    //console.log("i'm here in .get newgame");
    res.render('newgame.pug', {
        userName: req.user.username
    });
});

/* GET Create page. */
router.get('/Create', utils.requireLogin,  function(req, res, next) {
    //console.log("i'm here in .get Create");
    res.render('Create.pug');
});

/* POST Create page. */
router.post('/Create',function(req, res, next) {
    //console.log("i'm here in .post .Create");
    

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

            res.render('Create.pug', {invalidPlayers: myPlayers, invalidRounds:myRounds, invalidGameName: myGameName});
            
        }
        else
        {
            if(!isValid)
            {
                //console.log("i'm in !isValid");
                res.render('Create.pug', {invalidPlayers: myPlayers, invalidRounds:myRounds, invalidGameName: myGameName});
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
                res.redirect('/games/Game');
            }
        }
    });

    

    

    
});

/* GET Join page. */
router.get('/Join', utils.requireLogin, function(req, res, next) {
    //console.log("i'm here in .get Join");
    res.render('Join.pug');
});

/* POST Join page. */
router.post('/Join', function(req, res, next) {
    //console.log("i'm here in .post .Join");
    
    //console.log(req.body);

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
           // console.log("gameName was found in database: " + game.gameName);
            res.redirect('/games/Game');    
        }
        else
        {
           // console.log("gameName was not found in database");

            myInvalidCode = "Game room code was not found, please try again"

            res.render('Join.pug', {invalidCode: myInvalidCode});    
        }
    });

    

    

    
});

/* GET Game page. */
router.get('/Game', utils.requireLogin, function(req, res, next) {
    //console.log("i'm here in .get Game");
    res.render('Game.hbs');
});


module.exports = router;