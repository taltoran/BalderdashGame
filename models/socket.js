var schema = require('../models/schema');           //user model
var Game = require('../models/game');             //game model


module.exports = (io) => {
    /*  Removed Globals
    var app = require('express');
    var router = app.Router();
    var userCount = 0;  
    var userPointsDict = {};    
    var userAnswersDict = {};
    var userIdDict = {};    
    var myScoresHtml = "";       
    var answersDisplayed = 0;
    var myWordDict = {};
    var myCurrentChosenQuestion;  // object var, NEED FIX?    
    var myNumberOfRounds;    
    var myCurrentRoundNumber=0;    
    //how many number of players should be in a game as specified by host
    var myNumberOfPlayers;
    var myHostName = "";
    //how many users have answered question.
    var usersAnswered = 0;
    */

    // Used to hold room specific variables instead of using globals
    //
    // TODO: CLEAN UP CODE
    //
    var roomdata = require('roomdata');

    // socket.io events
    io.on('connection', function (socket) {
        var sessionid = socket.id;

        /*socket.emit('message',{
            username: 'Chat It Up', 
            text: 'Welcome to Chat', 
        });*/ //Brady took out

        socket.on('sendWordsDict', function (msg) {
            console.log("sendWordsDict");

            var myWordsList = msg.wordList;

            var myWordDict = {};

            for (var i = 0; i < myWordsList.length; i++) {
                var question = myWordsList[i].question;
                var answer = myWordsList[i].answer;
                myWordDict[question] = answer;

                roomdata.set(socket, "myWordDict", myWordDict);
                /*
                console.log("question: " + question);
                console.log("answer: " + answer);
                console.log("myWordDict[question]: " + myWordDict[question]);
                var test = roomdata.get(socket, "myWordDict");
                console.log("myWordDict: " + test);
                */

                //console.log("socket answer: " +myWordDict[question]);
            }

            console.log("got word dict in socket: " + myWordDict);
        });

        socket.on('join', function (msg) {
            var stamp = new Date().toLocaleTimeString();
            if (stamp.length == 10) {
                stamp = stamp.substring(0, 4) + ' ' + stamp.substring(8, 10)
            } else {
                stamp = stamp.substring(0, 5) + ' ' + stamp.substring(9, 11)
            }

            console.log("socket.join");
            var room = msg.game;
            console.log('room: ' + room);
            roomdata.joinRoom(socket, room);

            roomdata.set(socket, "room", room);

            var myNumberOfPlayers;
            myNumberOfPlayers = msg.numberOfPlayers;
            //roomdata.set(socket, "myNumberOfPlayers", myNumberOfPlayers);
            console.log('numOfPlayers: ' + myNumberOfPlayers);

            var userCount = roomdata.get(socket, "userCount");
            console.log(userCount);
            if (!userCount) {
                userCount = 0;
                roomdata.set(socket, "userCount", userCount);
            }
            userCount++;
            roomdata.set(socket, "userCount", userCount);

            console.log('a user connected ' + userCount + ' user(s)');

            //Brady added to check if it's the host, and set the host name (host is first player to login right now)
            if (userCount == 1) {
                var myHostName = msg.username;
                roomdata.set(socket, "myHostName", myHostName);
                console.log('host name: ' + myHostName);

                var userIdDict = {};
                userIdDict[myHostName] = sessionid;
                roomdata.set(socket, "userIdDict", userIdDict);

                // initialize room variables on host
                var myCurrentRoundNumber = 0;
                roomdata.set(socket, "myCurrentRoundNumber", myCurrentRoundNumber);


                var shownFirstScreen = 0;//1;
                roomdata.set(socket, "shownFirstScreen", shownFirstScreen);
                var usersShownFirstScreen = {};
                roomdata.set(socket, "usersShownFirstScreen", usersShownFirstScreen);
                var firstScreenCalled = 0;
                roomdata.set(socket, "firstScreenCalled", firstScreenCalled);
                


                console.log("shownFirstScreen 1:" + shownFirstScreen);
                
                
            }
            else
            {
                var userIdDict = roomdata.get(socket, "userIdDict");
                userIdDict[msg.username] = sessionid;
                roomdata.set(socket, "userIdDict", userIdDict);
            }

            
            var usersShownFirstScreen  = roomdata.get(socket, "usersShownFirstScreen");

            var myHostName = roomdata.get(socket, "myHostName");
            usersShownFirstScreen[msg.username]="false";
            //usersShownFirstScreen[myHostName]="true";

            roomdata.set(socket, "usersShownFirstScreen", usersShownFirstScreen);


            


            

            //console.log("host session id is: " + userIdDict[myHostName]);

            //start game once all players have entered game

            if (userCount == myNumberOfPlayers)
            {
                userCountTimesTwo = userCount;
                roomdata.set(socket, "userCountTimesTwo", userCountTimesTwo);

                var myScoresCorrectAnswerHtml = "";        
                roomdata.set(socket, "myScoresCorrectAnswerHtml", myScoresCorrectAnswerHtml);
                var myScoresHtml = "";
                roomdata.set(socket, "myScoresHtml", myScoresHtml);

                console.log("I'm about to set host because all players are in game");
                
                // setting games gameFull column to true in DB 
                var gameName = roomdata.get(socket, "room");
                setGameFullInDB(gameName);

                /*
                io.emit('setHost', { 
                    username: myHostName,
                    time: stamp
                });
                */
                var myHostName = roomdata.get(socket, "myHostName");

                io.sockets.in(room).emit('setHost', {
                    username: myHostName,
                    time: stamp
                });
            }

            var userPointsDict = {};
            //userPointsDict[msg.username] = 0;
            roomdata.set(socket, "userPointsDict", userPointsDict);

            var userAnswersDict = {};
            roomdata.set(socket, "userAnswersDict", userAnswersDict);

            console.log(msg.username + " answer: " + userAnswersDict[msg.username]);

            /*
            io.emit('message', {
                //username: 'Chat It Up', //Brady took this out
                text: msg.username + ' has joined Room: '+ userCount + ' Users are logged in.',//Chat',  //Brady changed this
                time: stamp
            });
            */

            io.sockets.in(room).emit('message', {
                text: msg.username + ' has joined Room: ' + userCount + ' Users are logged in.',//Chat',  //Brady changed this
                time: stamp
            });

            //userPointsDict[msg.username] = sessionid;

            //console.log("your session id is: "+sessionid);     
        });


        socket.on('showChosenCategoryNQuestion', function (msg) { 
            var room = roomdata.get(socket, "room");
            io.sockets.in(room).emit('showChosenCategoryNQuestionToEveryone', {
                text: msg.curChosenCategoryNQuestion
            });
        });


        socket.on('showHostFirstScreen', function (msg) {            
            console.log(msg.username+" inside showHostFirstScreen");
            
            var firstScreenCalled = roomdata.get(socket, "firstScreenCalled");

            var userIdDict = roomdata.get(socket, "userIdDict");
            var myHostName = roomdata.get(socket, "myHostName");

            //var shownFirstScreen = 1;
            var shownFirstScreen =roomdata.get(socket, "shownFirstScreen");
            
            var usersShownFirstScreen = roomdata.get(socket, "usersShownFirstScreen");
            var userCount = roomdata.get(socket, "userCount");

            

            firstScreenCalled+=1;
            roomdata.set(socket, "firstScreenCalled", firstScreenCalled);
            console.log("firstScreenCalled#1:  " +firstScreenCalled);

            
            if (firstScreenCalled == userCountTimesTwo)//1)
            {
                
                

                if (shownFirstScreen == userCount)
                {
                    console.log("shownFirstScreen was equal to userCount");
                    shownFirstScreen = 0;
                    roomdata.set(socket, "shownFirstScreen", shownFirstScreen);
                    
                    for (var key in usersShownFirstScreen) 
                    {
                        usersShownFirstScreen[key]="false";
                    }
                    roomdata.set(socket, "usersShownFirstScreen", usersShownFirstScreen);
                }
                
                shownFirstScreen += 1;
                roomdata.set(socket, "shownFirstScreen", shownFirstScreen);


                var sendToThisPerson = "";
                for (var key in usersShownFirstScreen) {
                    var value = usersShownFirstScreen[key];
                    // Use `key` and `value`
                    console.log("I'm checking all user keys: "+key +" and values: " + value);
                    if (value =="false")
                    {
                        sendToThisPerson = userIdDict[key];
                        usersShownFirstScreen[key] = "true";
                        roomdata.set(socket, "usersShownFirstScreen", usersShownFirstScreen);
                        break;
                    }
                }
                if (firstScreenCalled == userCountTimesTwo)
                {
                    firstScreenCalled = 0;
                    roomdata.set(socket, "firstScreenCalled", firstScreenCalled);
                    console.log("setting firstScreenCalled#2 back to zero: " + firstScreenCalled);

                    userCountTimesTwo = userCount * userCount;
                    roomdata.set(socket, "userCountTimesTwo", userCountTimesTwo);
                }

                console.log("I'm in showHostFirstScreen in socket");

                //console.log("i'm in socket to show host first screen and host id is: "+userIdDict[myHostName]);
                //io.to(io.clients[userIdDict["host"]]).emit('hostFirstScreen');//send host to first screen
                io.sockets.connected[sendToThisPerson].emit('hostFirstScreen'); //userIdDict[myHostName]
            }
            
        });

        socket.on('userChoseYes', function (msg) {
            //myCurrentRoundNumber=0;
            roomdata.set(socket, "myCurrentRoundNumber", 0);
            var room = roomdata.get(socket, "room");
            io.sockets.in(room).emit('userChoseYesStartAgain', {
            });
        });


        socket.on('hideYesNo', function (msg) {
            var room = roomdata.get(socket, "room");
            // getting list of winners from roomdata "winnerList"
            var gameWinners = roomdata.get(socket, "winnerList");
            // getting the game name
            var gameName = roomdata.get(socket, "room");
            // calling function to update users gameswon to + 1
            updateUserInDB(gameWinners);
            // calling function to update Game fields in DB    NOTE: make sure to add aditonal params to the function at the bottom
            // updateGameInDB(gamename, additional params)       <----------------- EXAMPLE
            updateGameInDB(gameName, gameWinners);   // add stuff for the players array and the gameEnd time
            io.sockets.in(room).emit('hideYesNoButtons', {
            });
        });

        socket.on('showAnswers', function (msg) {
            var room = roomdata.get(socket, "room");
            io.sockets.in(room).emit('showAnswersTimeout', {
            });
        });

        socket.on('emptyUserAnswers', function (msg) {
            //var userAnswersDict = {};

            var room = roomdata.get(socket, "room");
            var answersDisplayed = roomdata.get(socket, "answersDisplayed");
            var myCurrentRoundNumber = roomdata.get(socket, "myCurrentRoundNumber");
            var myNumberOfRounds = roomdata.get(socket, "myNumberOfRounds");
            var userPointsDict = roomdata.get(socket, "userPointsDict");
            var userAnswersDict = roomdata.get(socket, "userAnswersDict");
            var myScoresHtml = roomdata.get(socket, "myScoresHtml");
            var myScoresCorrectAnswerHtml = roomdata.get(socket, "myScoresCorrectAnswerHtml");

            
            

            if (!answersDisplayed) {
                answersDisplayed = 0;
            }

            console.log("emptyUserAnswers " + userAnswersDict[msg.text] + " ,answer username: " + msg.username);

            
            //if (answersDisplayed == 0)
            //{

                answersDisplayed += 1;
                roomdata.set(socket, "answersDisplayed", answersDisplayed);

                if (myCurrentRoundNumber < myNumberOfRounds) {
                    myScoresHtml = "<h1>Points Scored During the Round</h1>" + myScoresHtml

                    myScoresHtml += "<h1> Total Scores: </h1>";

                    for (var key in userPointsDict) {
                        var value = userPointsDict[key];
                        // Use `key` and `value`
                        myScoresHtml += "<p>" + key + " points: " + value + "</p>";

                    }
                }
                else {
                    myScoresHtml = "<h1>Final Points Scored During the Last Round</h1>" + myScoresHtml

                    var userCount = roomdata.get(socket, "userCount");
                    userCountTimesTwo = userCount;
                    roomdata.set(socket, "userCountTimesTwo", userCountTimesTwo);
            
                }

            //}
            
            myScoresHtml += myScoresCorrectAnswerHtml;
                
            if (myCurrentRoundNumber < myNumberOfRounds)
            {

                console.log("I'm about to show scores");

                /*
                io.emit('showScores', { 
                    text: myScoresHtml
                });
                */

                var tempMyScoresHtml = myScoresHtml;
                myScoresHtml ="";
                //roomdata.set(socket, "myScoresHtml", myScoresHtml);

                io.sockets.in(room).emit('showScores', {
                    text: tempMyScoresHtml//myScoresHtml
                });
            }
            else {
                var tempHtml = "";
                console.log("answersDisplayed value: " + answersDisplayed);

                //if (answersDisplayed == 1)
                //{


                    answersDisplayed += 1;
                    roomdata.set(socket, "answersDisplayed", answersDisplayed);
                    tempHtml = "<h1>Final Points!</h1>";

                    // Create items array
                    var items = Object.keys(userPointsDict).map(function (key) {
                        return [key, userPointsDict[key]];
                    });

                    // Sort the array based on the second element
                    items.sort(function (first, second) {
                        return second[1] - first[1];
                    });

                    // Create a new array 
                    var myArray = items.slice(0, userPointsDict.length);
                    var index = 1;
                    // Put all the winners in a list
                    var winnerList = [];
                    console.log("myArray Length:" + myArray.length);
                    for (var i = 0; i < myArray.length; i++) {
                        console.log("player " + myArray[i][0] + " has points = " + myArray[i][1]);
                        if (myArray[i][1] == myArray[0][1]) {
                            // adding winners who tied to winner list
                            winnerList[i] = myArray[i][0];
                            console.log("__________In winner list part_______");
                            tempHtml += "<h2 class='winText'> WINNER!!!   " + myArray[i][0] + " Won with a Score of " + myArray[i][1] + " Points   WINNER!!!</h2>";
                        }
                        else {
                            index += 1;
                            tempHtml += "<h3> Place #" + index + ": " + myArray[i][0] + " Scored " + myArray[i][1] + " Points</h3>";
                        }
                        console.log(tempHtml);
                    }
                    // adding winner list to roomdata
                    roomdata.set(socket, "winnerList", winnerList);

                    console.log("__________OUt of winner list for loop_______");
                    console.log("My winners list: " + winnerList)

                    myScoresHtml = tempHtml + "</br></br>" + myScoresHtml;



                    
                //}

                console.log("I'm about to show FINAL scores");



                //     // Create a new array 
                //     var myArray = items.slice(0, userPointsDict.length);

                //     for(var i=0; i<myArray.length;i++)
                //     {
                //         var index=i+1;
                //         if (i == 0)
                //         {
                //             myWinner = myArray[i][0];
                //             console.log("My winner: " + myWinner);
                //             tempHtml += "<h2 class='winText'> WINNER!!!   "+myArray[i][0]+" Won with a Score of "+myArray[i][1]+" Points   WINNER!!!</h2>";
                //         }
                //         else
                //         {

                //             tempHtml += "<h3> Place #"+ index +": " +myArray[i][0]+" Scored "+myArray[i][1]+" Points</h3>";
                //         }
                //     }

                //     myScoresHtml = tempHtml + "</br></br>"+myScoresHtml;


                // }
                // console.log("I'm about to show FINAL scores");



                /*
                io.emit('showFinalScores', { 
                    text: myScoresHtml
                });
                */


                var tempMyScoresHtml = myScoresHtml;
                myScoresHtml ="";
                //roomdata.set(socket, "myScoresHtml", myScoresHtml);


                io.sockets.in(room).emit('showFinalScores', {
                    text: tempMyScoresHtml//myScoresHtml
                });
            }

            //myScoresHtml = "";
        });

        socket.on('addToChosenAnswer', function (msg) {

            //var myWordDict = {};
            var myWordDict = roomdata.get(socket, "myWordDict");
            var myCurrentChosenQuestion = roomdata.get(socket, "myCurrentChosenQuestion");
            var userPointsDict = roomdata.get(socket, "userPointsDict");
            var userAnswersDict = roomdata.get(socket, "userAnswersDict");

            var myScoresHtml = roomdata.get(socket, "myScoresHtml");
            var myScoresCorrectAnswerHtml = roomdata.get(socket, "myScoresCorrectAnswerHtml");
            //var myScoresHtml = "";
            


            console.log("myCurrentChosenQuestion: " + myCurrentChosenQuestion);
            console.log("myWordDict: " + myWordDict);


            console.log("the answer for currentChosenQuestion is: " + myWordDict[myCurrentChosenQuestion] + " and user chose the answer: " + msg.text);
            if (myWordDict[myCurrentChosenQuestion] == msg.text) {
                userPointsDict[msg.username] += 2;
                roomdata.set(socket, "userPointsDict", userPointsDict);


                myScoresHtml +="<p>"+msg.username + " picked the Correct answer: " + msg.text+ ", so "+msg.username + " scored 2 points!</p>";//" +userPointsDict[userAnswersDict[msg.text]] +" 
                console.log("<p>"+msg.username + " picked the Correct answer: " + msg.text+ ", so "+msg.username + " scored 2 points!</p>");

                console.log("user chose correct answer and won 2 points");
            }
            else {
                //give user whose answer it was, a point
                userPointsDict[userAnswersDict[msg.text]] += 1;
                roomdata.set(socket, "userPointsDict", userPointsDict);

                console.log("answer did not exist in answers");

                console.log("<p>" + userAnswersDict[msg.text] + " points: " + userPointsDict[userAnswersDict[msg.text]] + "</p>");

                myScoresHtml += "<p>" + msg.username + " picked the answer: " + msg.text + ", so " + userAnswersDict[msg.text] + " scored 1 point</p>";//" +userPointsDict[userAnswersDict[msg.text]] +" 

            }

            myScoresCorrectAnswerHtml ="<h3>The Correct Answer To "+myCurrentChosenQuestion+" was: </h2><p>"+myWordDict[myCurrentChosenQuestion]+"</p>";        
            roomdata.set(socket, "myScoresCorrectAnswerHtml", myScoresCorrectAnswerHtml);

            roomdata.set(socket, "myScoresHtml", myScoresHtml);
            var userCount = roomdata.get(socket, "userCount");
            var room = roomdata.get(socket, "room");
            /*
            io.emit('addOneChosenAnswer', { 
                 usersCount: userCount
            });
            */

            io.sockets.in(room).emit('addOneChosenAnswer', {
                usersCount: userCount
            });
        });

        socket.on('send', function (msg) {
            var stamp = new Date().toLocaleTimeString();
            if (stamp.length == 10) {
                stamp = stamp.substring(0, 4) + ' ' + stamp.substring(8, 10)
            } else {
                stamp = stamp.substring(0, 5) + ' ' + stamp.substring(9, 11)
            }
            /*
            io.emit('message', { 
                username: msg.username, 
                text: msg.text, 
                time: stamp
            });
            */

            var myScoresHtml = "";
            roomdata.set(socket, "myScoresHtml", myScoresHtml);

            //answersDisplayed = 0;
            roomdata.set(socket, "answersDisplayed", 0);

            var usersAnswered = roomdata.get(socket, "usersAnswered");
            if (!usersAnswered) {
                usersAnswered = 0;
            }
            usersAnswered++;
            roomdata.set(socket, "usersAnswered", usersAnswered);

            var room = roomdata.get(socket, "room");
            var userCount = roomdata.get(socket, "userCount");

            //Brady Added
            /*
            io.emit('answerMessage', { 
                username: msg.username, 
                text: msg.text, 
                time: stamp,
                //usersCount: userCount
            });
            */

            io.sockets.in(room).emit('answerMessage', {
                username: msg.username,
                text: msg.text,
                time: stamp
            });

            if (usersAnswered == userCount) {
                /*
                io.emit('hideLoading', { 
                });
                */
                io.sockets.in(room).emit('hideLoading', {});
                usersAnswered = 0;
                roomdata.set(socket, "usersAnswered", usersAnswered);
            }

            var userPointsDict = roomdata.get(socket, "userPointsDict");
            
            if (!userPointsDict[msg.username])
            {
                console.log(msg.username +" aasdfasd: " + userPointsDict[msg.username]);
                userPointsDict[msg.username] = 0;
            }
            
            roomdata.set(socket, "userPointsDict", userPointsDict);

            var userAnswersDict = roomdata.get(socket, "userAnswersDict");
            userAnswersDict[msg.text] = msg.username;
            roomdata.set(socket, "userAnswersDict", userAnswersDict);

        });

        socket.on('sendQuestion', function (msg) {
            var myCurrentChosenQuestion = msg.text;
            console.log("socket myCurrentChosenQuestion1: " + myCurrentChosenQuestion);
            roomdata.set(socket, "myCurrentChosenQuestion", myCurrentChosenQuestion);

            var myNumberOfRounds = msg.rounds;
            roomdata.set(socket, "myNumberOfRounds", parseInt(myNumberOfRounds));

            var myCurrentRoundNumber = roomdata.get(socket, "myCurrentRoundNumber");
            myCurrentRoundNumber++;
            roomdata.set(socket, "myCurrentRoundNumber", myCurrentRoundNumber);

            console.log("mycurrent question is: " + msg.text);

            /*
            //Brady Added
            io.emit('questionMessage', { 
                text: msg.text
            });
            */

            var room = roomdata.get(socket, "room");
            console.log("socket myCurrentChosenQuestion2: " + myCurrentChosenQuestion);
            io.sockets.in(room).emit('questionMessage', {
                text: msg.text
            });

        });

        socket.on('leave', function (msg) {
            console.log("------In socket.js  socket.on leave------");
            var stamp = new Date().toLocaleTimeString();
            if (stamp.length == 10) {
                stamp = stamp.substring(0, 4) + ' ' + stamp.substring(8, 10)
            } else {
                stamp = stamp.substring(0, 5) + ' ' + stamp.substring(9, 11)
            }
            var userCount = roomdata.get(socket, "userCount");
            var room = roomdata.get(socket, "room");
            var tempUserCount = userCount - 1;
            /*
            io.emit('message', {
                //username: 'Chat It Up', //Brady removed this
                
                text: msg.username + ' has left Room: '+ tempUserCount + ' Users are logged in.', //Chat', //Brady changed this
                time: stamp
            });
            */
            io.sockets.in(room).emit('message', {
                text: msg.username + ' has left Room: ' + tempUserCount + ' Users are logged in.', //Chat', //Brady changed this
                time: stamp
            });
        });

        socket.on('disconnect', function () {
            console.log("------In socket.js  socket.on disconnect------");
            var userCount = roomdata.get(socket, "userCount");
            userCount--;
            roomdata.set(socket, "userCount", userCount);
            var myCurrentRoundNumber = 0;
            roomdata.set(socket, "myCurrentRoundNumber", myCurrentRoundNumber);
            console.log('user disconnected ' + userCount + ' user(s)');
        });
    });

    //return router;

    // function takes in the list of winners including those who tied and iterates through each one incrementing their gameswon
    // function is called on 191
    function updateUserInDB(myWinners) {
        console.log("------In socket.js  .updateUserInDb------");
        console.log("The game winners: " + myWinners);
        console.log("Is myWinners object an Array? ");
        console.log(myWinners instanceof Array);
        console.log("list length = " + myWinners.length);
        for (i = 0; i < myWinners.length; i++) {
            console.log("Game winner #" + i + ": Game winner name: " + myWinners[i]);
            schema.User.findOne({ username: myWinners[i] }, 'fname lname email username password gameswon data', function (err, updateUser) {
                // cant find user redirect to error page with error msg displayed
                if (!updateUser) {
                    console.log("Couldnt Find User...");
                }
                else {
                    console.log("Found user!!!!!!");
                    var won = (updateUser.gameswon + 1);
                    // if user found compare update the users gameswon
                    updateUser.gameswon = won;
                    updateUser.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                        else{
                            console.log("User: " + updateUser.username + "    New score: " + won);
                        }
                    });
                }
            });
        }
    }

    // Function will set gameActive to false, update the games winners[], update the games EndTime, and update the games playerData[]
    // Function is called on line 195
    function updateGameInDB(gamename, winners) {
        console.log("-----In socket.js .updateGameInDB-----");
        console.log("gamename param: " + gamename);
        Game.findOne({ gameName: gamename}, function (err, updateGame) {
            if (!updateGame) {
                console.log("Couldnt Find Game...");
            }
            else {
                console.log("Found Game!!!!!!");
                // if game found update the games columns
                // ex updateGame.whatever = stuff
                updateGame.gameActive = true;
                updateGame.gameFull = false;
                updateGame.winners = winners;
                // add game endEnd date 
                // add update to whatever is going in the players array
                updateGame.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else{
                        console.log("Game: " + updateGame.gameName + "    gameActive: " + updateGame.gameActive);
                        console.log("Game: " + updateGame.gameName + "    gameFull: " + updateGame.gameFull);
                        console.log("Game: " + updateGame.gameName + "    winners: " + updateGame.winners);
                    }
                });
            }
        });
    }

    // function is called on line 122
    function setGameFullInDB(gamename) {
        console.log("-----In socket.js .setGameFullInDB-----");
        console.log("gamename param: " + gamename);
        Game.findOne({ gameName: gamename }, function (err, updateGame) {
            if (!updateGame) {
                console.log("Couldnt Find Game...");
            }
            else {
                console.log("Found Game!!!!!!");
                // if game found update the games columns
                updateGame.gameFull = true;
                updateGame.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("update successful, "+ updateGame.gameName+".gameFull = true")
                });
            }
        });
    }

}
