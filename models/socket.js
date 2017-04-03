
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

            for (var i = 0; i<myWordsList.length; i++)
            {
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

            console.log("got word dict in socket: "+myWordDict);
        });

        socket.on('join', function (msg) {
            var stamp = new Date().toLocaleTimeString();
            if(stamp.length == 10 ){
                stamp = stamp.substring(0, 4) + ' ' + stamp.substring(8, 10)
            }else{
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
            if ( userCount == 1 )
            {
                var myHostName = msg.username;
                roomdata.set(socket, "myHostName", myHostName);
                console.log('host name: ' + myHostName);
                
                var userIdDict = {};
                userIdDict[myHostName] = sessionid;
                roomdata.set(socket, "userIdDict", userIdDict);

                console.log("host session id is: " + userIdDict[myHostName]);

                // initialize room variables on host
                var myCurrentRoundNumber = 0;
                roomdata.set(socket, "myCurrentRoundNumber", myCurrentRoundNumber);
            }

            //start game once all players have entered game
            if (userCount == myNumberOfPlayers)
            {
                console.log("I'm about to set host because all players are in game");
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
            userPointsDict[msg.username] = 0;
            roomdata.set(socket, "userPointsDict", userPointsDict);

            var userAnswersDict = {};
            roomdata.set(socket, "userAnswersDict", userAnswersDict);

            console.log(msg.username + " answer: " +userAnswersDict[msg.username]);

            /*
            io.emit('message', {
                //username: 'Chat It Up', //Brady took this out
                text: msg.username + ' has joined Room: '+ userCount + ' Users are logged in.',//Chat',  //Brady changed this
                time: stamp
            });
            */

            io.sockets.in(room).emit('message', {
                text: msg.username + ' has joined Room: '+ userCount + ' Users are logged in.',//Chat',  //Brady changed this
                time: stamp
            });
            
            //userPointsDict[msg.username] = sessionid;

            //console.log("your session id is: "+sessionid);     
        });

        socket.on('showHostFirstScreen', function (msg) {            
           
            var userIdDict = roomdata.get(socket, "userIdDict");
            var myHostName = roomdata.get(socket, "myHostName");

            console.log("i'm in socket to show host first screen and host id is: " + userIdDict[myHostName]);
            //io.to(io.clients[userIdDict["host"]]).emit('hostFirstScreen');//send host to first screen
            io.sockets.connected[userIdDict[myHostName]].emit('hostFirstScreen');
            
        });

        socket.on('emptyUserAnswers', function (msg) {
            //var userAnswersDict = {};

            var room = roomdata.get(socket, "room");
            var answersDisplayed = roomdata.get(socket, "answersDisplayed");
            var myCurrentRoundNumber = roomdata.get(socket, "myCurrentRoundNumber");
            var myNumberOfRounds = roomdata.get(socket, "myNumberOfRounds");
            var userPointsDict = roomdata.get(socket, "userPointsDict");
            var userAnswersDict = roomdata.get(socket, "userAnswersDict");
            var myScoresHtml = "";

            if (!answersDisplayed) {
                answersDisplayed = 0;
            }
            
            console.log("emptyUserAnswers " + userAnswersDict[msg.text] + " ,answer username: " + msg.username);
            
            if (answersDisplayed == 0)
            {
                answersDisplayed += 1;
                roomdata.set(socket, "answersDisplayed", answersDisplayed);                

                if (myCurrentRoundNumber < myNumberOfRounds)
                {
                    myScoresHtml = "<h1>Points Scored During the Round</h1>"+myScoresHtml

                    myScoresHtml += "<h1> Total Scores: </h1>";
                    
                    for (var key in userPointsDict) {
                        var value = userPointsDict[key];
                        // Use `key` and `value`
                        myScoresHtml += "<p>" +key +" points: " + value +"</p>";
                            
                    }
                }
                else
                {
                    myScoresHtml = "<h1>Final Points Scored During the Last Round</h1>"+myScoresHtml
                }
            }
            
                
            if (myCurrentRoundNumber < myNumberOfRounds)
            {
                console.log("I'm about to show scores");

                /*
                io.emit('showScores', { 
                    text: myScoresHtml
                });
                */                

                io.sockets.in(room).emit('showScores', {
                    text: myScoresHtml
                });
            }
            else
            {
                var tempHtml = "";
                console.log("answersDisplayed value: " + answersDisplayed);
                if (answersDisplayed == 1)
                {

                    answersDisplayed += 1;
                    roomdata.set(socket, "answersDisplayed", answersDisplayed);
                    tempHtml = "<h1>Final Points!</h1>";

                    // Create items array
                    var items = Object.keys(userPointsDict).map(function(key) {
                        return [key, userPointsDict[key]];
                    });

                    // Sort the array based on the second element
                    items.sort(function(first, second) {
                        return second[1] - first[1];
                    });

                    // Create a new array 
                    var myArray = items.slice(0, userPointsDict.length);

                    for(var i=0; i<myArray.length;i++)
                    {
                        var index=i+1;
                        if (i == 0)
                        {
                            tempHtml += "<h2> WINNER!!!   "+myArray[i][0]+" Won with a Score of "+myArray[i][1]+" Points   WINNER!!!</h2>";
                        }
                        else
                        {
                            
                            tempHtml += "<h3> Place #"+ index +": " +myArray[i][0]+" Scored "+myArray[i][1]+" Points</h3>";
                        }
                    }

                    myScoresHtml = tempHtml + "</br></br>"+myScoresHtml;

                    
                }
                console.log("I'm about to show FINAL scores");
                /*
                io.emit('showFinalScores', { 
                    text: myScoresHtml
                });
                */
                io.sockets.in(room).emit('showFinalScores', {
                    text: myScoresHtml
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
            var myScoresHtml = "";

            console.log("myCurrentChosenQuestion: " + myCurrentChosenQuestion);
            console.log("myWordDict: " + myWordDict);             
            
            console.log("the answer for currentChosenQuestion is: " + myWordDict[myCurrentChosenQuestion] + " and user chose the answer: " + msg.text);
            if (myWordDict[myCurrentChosenQuestion] == msg.text)
            {
                userPointsDict[msg.username] += 2;
                roomdata.set(socket, "userPointsDict", userPointsDict);

                myScoresHtml +="<p>"+msg.username + " picked the Real Correct answer: " + msg.text+ ", so "+msg.username + " scored 2 points!</p>";//" +userPointsDict[userAnswersDict[msg.text]] +" 

                console.log("user chose correct answer and won 2 points");
            }
            else
            {
                //give user whose answer it was, a point
                userPointsDict[userAnswersDict[msg.text]] += 1;
                roomdata.set(socket, "userPointsDict", userPointsDict);

                console.log("answer did not exist in answers");

                console.log("<p>"+userAnswersDict[msg.text] + " points: " +userPointsDict[userAnswersDict[msg.text]] +"</p>");

                myScoresHtml +="<p>"+msg.username + " picked the answer: " + msg.text+ ", so "+userAnswersDict[msg.text] + " scored 1 point</p>";//" +userPointsDict[userAnswersDict[msg.text]] +" 

            }
            
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

        socket.on('reallyHideLoading', function (msg) {
            /*
            io.emit('reallyReallyHideLoading', { 
            });
            */

            var room = roomdata.get(socket, "room");
            io.sockets.in(room).emit('reallyReallyHideLoading', {});
        });       

        socket.on('send', function (msg) {
            var stamp = new Date().toLocaleTimeString();
            if(stamp.length == 10 ){
                stamp = stamp.substring(0, 4) + ' ' + stamp.substring(8, 10)
            }else{
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

            if (usersAnswered == userCount)
            {
                /*
                io.emit('hideLoading', { 
                });
                */
                io.sockets.in(room).emit('hideLoading', {});
                usersAnswered = 0;
                roomdata.set(socket, "usersAnswered", usersAnswered);
            }   

            var userAnswersDict = roomdata.get(socket, "userAnswersDict");
            userAnswersDict[msg.text] = msg.username;
            roomdata.set(socket, "userAnswersDict", userAnswersDict);

        });

        socket.on('sendQuestion', function (msg) {
            var myCurrentChosenQuestion = msg.text
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
            io.sockets.in(room).emit('questionMessage', {
                text: msg.text
            });

        });  

        socket.on('leave', function (msg) {
            var stamp = new Date().toLocaleTimeString();
            if(stamp.length == 10 ){
                stamp = stamp.substring(0, 4) + ' ' + stamp.substring(8, 10)
            }else{
                stamp = stamp.substring(0, 5) + ' ' + stamp.substring(9, 11)
            }
            var userCount = roomdata.get(socket, "userCount");
            var room = roomdata.get(socket, "room");
            var tempUserCount = userCount -1;
            /*
            io.emit('message', {
                //username: 'Chat It Up', //Brady removed this
                
                text: msg.username + ' has left Room: '+ tempUserCount + ' Users are logged in.', //Chat', //Brady changed this
                time: stamp
            });
            */
            io.sockets.in(room).emit('message', {
                text: msg.username + ' has left Room: '+ tempUserCount + ' Users are logged in.', //Chat', //Brady changed this
                time: stamp
            });
        });

        socket.on('disconnect', function(){
            var userCount = roomdata.get(socket, "userCount");
            userCount--;
            roomdata.set(socket, "userCount", userCount);
            var myCurrentRoundNumber = 0;
            roomdata.set(socket, "myCurrentRoundNumber", myCurrentRoundNumber);
            console.log('user disconnected ' + userCount + ' user(s)');
        });
    });

    //return router;
}