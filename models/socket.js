
module.exports = (io) => {
    var app = require('express');
    var router = app.Router();
    var userCount = 0;
    var userPointsDict = {};
    var userAnswersDict = {};
    var userIdDict = {};
    var myScoresHtml = ""; 
    var answersDisplayed = 0;
    var myWordDict = {};
    var myCurrentChosenQuestion;
    var myNumberOfRounds;
    var myCurrentRoundNumber=0;
    //how many number of players should be in a game as specified by host
    var myNumberOfPlayers;

    var myHostName = "";

    //how many users have answered question.
    var usersAnswered = 0;

    // socket.io events
    io.on('connection', function (socket) {
        var sessionid = socket.id;

        userCount++;

        
        console.log('a user connected ' + userCount + ' user(s)');
        /*socket.emit('message',{
            username: 'Chat It Up', 
            text: 'Welcome to Chat', 
        });*/ //Brady took out

        socket.on('sendWordsDict', function (msg) {
            var myWordsList = msg.wordList;

            for (var i = 0; i<myWordsList.length; i++)
            {
                var question = myWordsList[i].question;
                var answer = myWordsList[i].answer;
                myWordDict[question] = answer;

                //console.log("socket answer: " +myWordDict[question]);
            }

            console.log("got word dict in socket: "+myWordDict);
        });

        socket.on('showHostFirstScreen', function (msg) {

            console.log("i'm in socket to show host first screen and host id is: "+userIdDict[myHostName]);
            //io.to(io.clients[userIdDict["host"]]).emit('hostFirstScreen');//send host to first screen
            io.sockets.connected[userIdDict[myHostName]].emit('hostFirstScreen');
            
        });

        socket.on('emptyUserAnswers', function (msg) {
            userAnswersDict = {}

            
            console.log("emptyUserAnswers "+userAnswersDict[msg.text] + " ,answer username: " +msg.username);
            
            if (answersDisplayed == 0)
            {
                answersDisplayed += 1;

                

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


                io.emit('showScores', { 
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
                io.emit('showFinalScores', { 
                    text: myScoresHtml
                });
            }

            //myScoresHtml = "";
        });

        socket.on('addToChosenAnswer', function (msg) {

             
            
            console.log("the answer for currentChosenQuestion is: "+myWordDict[myCurrentChosenQuestion] + " and user chose the answer: "+msg.text);
            if (myWordDict[myCurrentChosenQuestion]==msg.text)
            {
                userPointsDict[msg.username] += 2; 
                myScoresHtml +="<p>"+msg.username + " picked the Real Correct answer: " + msg.text+ ", so "+msg.username + " scored 2 points!</p>";//" +userPointsDict[userAnswersDict[msg.text]] +" 

                console.log("user chose correct answer and won 2 points");
            }
            else
            {
                //give user whose answer it was, a point
                userPointsDict[userAnswersDict[msg.text]] += 1;

                console.log("answer did not exist in answers");

                console.log("<p>"+userAnswersDict[msg.text] + " points: " +userPointsDict[userAnswersDict[msg.text]] +"</p>");

                myScoresHtml +="<p>"+msg.username + " picked the answer: " + msg.text+ ", so "+userAnswersDict[msg.text] + " scored 1 point</p>";//" +userPointsDict[userAnswersDict[msg.text]] +" 

            }
            
            
            

            
            io.emit('addOneChosenAnswer', { 
                 usersCount: userCount
            });
        });

        socket.on('reallyHideLoading', function (msg) {
            io.emit('reallyReallyHideLoading', { 
            });
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

            myScoresHtml = "";
            answersDisplayed = 0;

            usersAnswered += 1;

            //Brady Added
            io.emit('answerMessage', { 
                username: msg.username, 
                text: msg.text, 
                time: stamp,
                //usersCount: userCount
            });


            if (usersAnswered == userCount)
            {
                io.emit('hideLoading', { 
                });

                usersAnswered = 0;
            }

            
            
            

            userAnswersDict[msg.text] = msg.username;

        });

        socket.on('sendQuestion', function (msg) {
            myCurrentChosenQuestion = msg.text

            myNumberOfRounds = msg.rounds;
            myCurrentRoundNumber +=1;

            console.log("mycurrent question is: " + msg.text);
            
            
            //Brady Added
            io.emit('questionMessage', { 
                text: msg.text
            });

        });

        socket.on('join', function (msg) {
            var stamp = new Date().toLocaleTimeString();
            if(stamp.length == 10 ){
                stamp = stamp.substring(0, 4) + ' ' + stamp.substring(8, 10)
            }else{
                stamp = stamp.substring(0, 5) + ' ' + stamp.substring(9, 11)
            }

            
            
            myNumberOfPlayers = msg.numberOfPlayers;
            
            //start game once all players have entered game
            if (userCount == myNumberOfPlayers)
            {
                console.log("I'm about to set host because all players are in game");
                io.emit('setHost', { 
                    username: myHostName,
                    time: stamp
                });
            }
            userPointsDict[msg.username] = 0;

            console.log(msg.username + " answer: " +userAnswersDict[msg.username]);


            io.emit('message', {
                //username: 'Chat It Up', //Brady took this out
                text: msg.username + ' has joined Room: '+ userCount + ' Users are logged in.',//Chat',  //Brady changed this
                time: stamp
            });

            
            //userPointsDict[msg.username] = sessionid;

            //Brady added to check if it's the host, and set the host name (host is first player to login right now)
            if ( userCount == 1 )
            {
                myHostName = msg.username;

                userIdDict[myHostName] = sessionid;

                console.log("host session id is: "+userIdDict[myHostName]);
            }

            //console.log("your session id is: "+sessionid);

            

        });
        socket.on('leave', function (msg) {
            var stamp = new Date().toLocaleTimeString();
            if(stamp.length == 10 ){
                stamp = stamp.substring(0, 4) + ' ' + stamp.substring(8, 10)
            }else{
                stamp = stamp.substring(0, 5) + ' ' + stamp.substring(9, 11)
            }
            var tempUserCount = userCount -1;
            io.emit('message', {
                //username: 'Chat It Up', //Brady removed this
                
                text: msg.username + ' has left Room: '+ tempUserCount + ' Users are logged in.', //Chat', //Brady changed this
                time: stamp
            });
        });
        socket.on('disconnect', function(){
            userCount--;
            myCurrentRoundNumber=0;
            console.log('user disconnected ' + userCount + ' user(s)');
        });
    });

    return router;
}