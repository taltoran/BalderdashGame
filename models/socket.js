
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

            console.log("i'm in socket to show host first screen and host id is: "+userIdDict["host"]);
            //io.to(io.clients[userIdDict["host"]]).emit('hostFirstScreen');//send host to first screen
            io.sockets.connected[userIdDict["host"]].emit('hostFirstScreen');
            
        });

        socket.on('emptyUserAnswers', function (msg) {
            userAnswersDict = {}

            
            console.log("emptyUserAnswers "+userAnswersDict[msg.text] + " ,answer username: " +msg.username);
            
            if (answersDisplayed == 0)
            {
                answersDisplayed += 1;

                myScoresHtml = "<h1>Points Scored During the Round</h1>"+myScoresHtml
                myScoresHtml += "<h1> Total Scores: </h1>";
                
                for (var key in userPointsDict) {
                    var value = userPointsDict[key];
                    // Use `key` and `value`
                    myScoresHtml += "<p>" +key +" points: " + value +"</p>";
                        
                }
            }
            
                
            
            
            console.log("I'm about to show scores");
            io.emit('showScores', { 
                text: myScoresHtml
            });

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

            userPointsDict[msg.username] = 0;

            console.log(msg.username + " answer: " +userAnswersDict[msg.username]);


            io.emit('message', {
                //username: 'Chat It Up', //Brady took this out
                text: msg.username + ' has joined Room: '+ userCount + ' Users are logged in.',//Chat',  //Brady changed this
                time: stamp
            });

            
            //userPointsDict[msg.username] = sessionid;

            //Brady added to check if it's the host, and set the host name
            if (userCount == 1)
            {
                io.emit('setHost', { 
                    username: msg.username,
                    time: stamp
                });

                userIdDict["host"] = sessionid;

                console.log("host session id is: "+userIdDict["host"]);
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
            console.log('user disconnected ' + userCount + ' user(s)');
        });
    });

    return router;
}