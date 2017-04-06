window.onload = () => {
//Brady stuff

    //used for scores
    var scoresHtml = "";//document.getElementById("scores");
    //scoresHtml.innerHTML = "";

    //used for host choosing a question
    var sendButton = document.getElementsByClassName("sendQuestion");
    
    //used to show chosenquestion
    var chosenQuestion = document.getElementById("chosenQuestion");
    var chosenQuestionTwo = document.getElementById("chosenQuestionTwo");

    //used to get input answer
    var inputAnswer = document.getElementById("inputAnswer");
    var answers = document.getElementById("answers");

    //***used to see if all users have chosen an answer
    var usersChosenAnswer = 0;

    //used to display scores at end of each round
    var scores = document.getElementById("scores");
    //used to display final scores
    var finalscores = document.getElementById("finalscores");
    

    
    //var buttonHtml = "";
    //var buttonNumber = 0;

    //used to display round number each round
    var myHtmlRoundNumber = 1;
    var roundHtml = document.getElementsByClassName("roundNumber");
    //this sets round number 1 on first login
    for (var i = 0; i < roundHtml.length; i++) {
        roundHtml[i].innerHTML = "<p> Round Number: "+myHtmlRoundNumber+"</p>";
    }



    //used to see if everybodys entered an answer
    //var usersAnswered = 0;

    //used to show current chosen question each round
    var currentChosenQuestion = "";
    //used to show current category chosen each round
    var currentChosenCategoryNQuestion = "";


    //used to save questions and answers
    var myWordsDict= {}; 


    //used to make it so only words in Category are chosen as questions (gets rid of other categories in list)
    for (var i = 0; i<myWordsList.length; i++)
    {
        var foundIt = "false";
        for (var j = 0; j<myCategories.length; j++)
        {
            if (myCategories[j] == myWordsList[i].category)
            {
                console.log("myCategories[j]"+myCategories[j])
                foundIt = "true";
            }
        }
        if (foundIt == "false")
        {
            myWordsList.splice(i, 1);
            i = i-1;
        }
    }

/*
    for (var i = 0; i<myWordsList.length; i++)
    {
        console.log(myWordsList[i].category + " :" +myWordsList[i].question);
    }
    */

    

    //putting question and answers in a dictionary, where the question is the key and answer is the value
    for (var i = 0; i<myWordsList.length; i++)
    {
        var question = myWordsList[i].question;
        var answer = myWordsList[i].answer;
        myWordsDict[question] = answer;

        console.log("answer: " +myWordsDict[question]);
    }

    //used to see which categories were chosen
    //console.log("my categories: " + myCategories[0]);



    //this section selects the first round of random questions. 
    var gamediv = document.getElementById("gamediv");

    gamediv.innerHTML += "<h1 style='padding-top:25px'> Choose Question For the Round </h1>";
    
    var myChosenWords = {};
    var count = 0;
    var categoryCount = 0;
    for (var i = 0; i<4; i++)
    {
        var randomNum= Math.floor(Math.random() * (myWordsList.length))
        var myQuestion = myWordsList[randomNum].question
        var myCategory = myWordsList[randomNum].category
        
        while (myWordsList[randomNum].category != myCategories[categoryCount])
        {
            randomNum= Math.floor(Math.random() * (myWordsList.length));
            myQuestion = myWordsList[randomNum].question
            myCategory = myWordsList[randomNum].category
        }

        
        if (categoryCount ==myCategories.length-1)
        {
            categoryCount = 0;
        }
        else
        {
            categoryCount +=1;
        }
        
            
        

        if (myChosenWords[myQuestion] == "true")
        {
          var myCount = 0
          while (myChosenWords[myQuestion] == "true" && myWordsList[randomNum].category != myCategories[categoryCount] &&myCount <200)
          {
            randomNum= Math.floor(Math.random() * (myWordsList.length));
            myQuestion = myWordsList[randomNum].question
            myCategory = myWordsList[randomNum].category
            myCount +=1;
          }
          myChosenWords[myQuestion] = "true"
          if (myCount ==200)
          {
              for (var j =0; j<myChosenWords.length; j++)
              {
                  myChosenWords[myQuestion] = "false";
              }
          }
          myCount = 0;
        }
        else
        {
          myChosenWords[myQuestion] = "true"
        }
        //var myString= "<button class=sendQuestion name=\""+myQuestion+"\">"+ myQuestion + "</button>";
        //console.log(myString);
        gamediv.innerHTML += "<div style='padding:10px'>"
        //gamediv.innerHTML += "  <p> Category: "+myCategory+"</p>" //
        gamediv.innerHTML += "  <button class=sendQuestion value=\""+myQuestion+"\" name=\" "+myQuestion+"\">"+ myCategory + ": "+myQuestion + "</button>";
        gamediv.innerHTML += "</div>"
    }
    

    
    

/*
    sendAnswer.onclick = function() {
        console.log("answer");
        console.log(inputAnswer.value);
        alert(inputAnswer.value);
        answers.innerHTML += inputAnswer.value.toLowerCase();
        answers.innerHTML += '<br /><hr />';
    }
    */



    var user = document.getElementsByTagName('p')[1].textContent;
    var gameName = document.getElementById('game').getAttribute('data-name');

    var socket = io.connect();
    window.onbeforeunload = () => {
        socket.emit('leave',{
            username: document.getElementsByTagName('p')[1].textContent
        });
    };


    socket.emit('join', {
            username: user,
            numberOfPlayers: myNumberOfPlayers,
            game: gameName
    });
    
    socket.emit('sendWordsDict', { 
        wordList: myWordsList
    });



//used to set click listeners on host questions at beginning of round. 
//once clicked users will be sent to page to enter answers
    for (var i = 0; i < sendButton.length; i++) {
        sendButton[i].onclick = function() {
            console.log("hello");
            //alert($(this).text());
            //chosenQuestion.innerHTML = this.name;

            //testing the jquery hide() function in javascript
            document.getElementById("gamediv").style.display="none";

            //alert($(this).val());
            currentChosenCategoryNQuestion =$(this).text();

            socket.emit('sendQuestion', { 
                username: user,
                text: $(this).val(),//$(this).text(), //this.name 
                rounds: myRounds,
                //setCurrentQuestion: myQuestion    
            });
            
            for (var i = 0; i<4; i++)
            {  
                var randomNum= Math.floor(Math.random() * (myWordsList.length))
                var myQuestion = myWordsList[randomNum].question;
                var myCategory = myWordsList[randomNum].category
        
                while (myWordsList[randomNum].category != myCategories[categoryCount])
                {
                    randomNum= Math.floor(Math.random() * (myWordsList.length));
                    myQuestion = myWordsList[randomNum].question
                    myCategory = myWordsList[randomNum].category
                }

                
                if (categoryCount ==myCategories.length-1)
                {
                    categoryCount = 0;
                }
                else
                {
                    categoryCount +=1;
                }

                if (myChosenWords[myQuestion] == "true")
                {
                    var myCount = 0
                    while (myChosenWords[myQuestion] == "true" && myWordsList[randomNum].category != myCategories[categoryCount] &&myCount <200)
                    {
                        randomNum= Math.floor(Math.random() * (myWordsList.length));
                        myQuestion = myWordsList[randomNum].question
                        myCount +=1;
                    }
                    myChosenWords[myQuestion] = "true"
                    if (myCount ==200)
                    {
                        for (var j=0; j<myChosenWords.length; j++)
                        {
                            myChosenWords[myQuestion] = "false";
                        }
                    }
                    myCount = 0;
                }
                else
                {
                    myChosenWords[myQuestion] = "true"
                }

                $(sendButton[i]).val(myQuestion);
                //gamediv.innerHTML += "  <p> Category: "+myCategory+"</p>"
                $(sendButton[i]).text(myCategory+": "+myQuestion);
            }

            //used to give users 15 seconds to enter their answers
            //setTimeout(timesUpShowAnswers, 15000);
            
        }
    }

//in testing right now. this cuts off people who take more than 15 seconds to answer question.
//and shows the answers that have been entered.
    socket.on('showAnswersTimeout', (msg)=>{
        $(".gamediv3").show();
        $(".gamediv2").hide();
        $("#answerWait").hide();
    });

//sends to socket, and which then calls socket.on('showanswersTimeout') above this.  
    function timesUpShowAnswers()
    {
        socket.emit('showAnswers', {
        });
    }


//once everyone has joined the game the host name is saved.
//this will call to show the host the first screen, 
//and the other users the waiting for host to choose question screen
//
//socket.emit('showHostFirstScreen', {
//        });
// 
// is probably the only useful part of this. can't remember why i did the other stuff..
    socket.on('setHost', (msg)=>{
        console.log('set hostname')
        console.log(msg.username);
        var $hosts, host;

        $('.message_input').val('');
        
        $hosts = $('.hosts');
        console.log('you: ' + user + 'sender: ' + msg.username)

        host = new Host({
            user: msg.username
        });

<<<<<<< HEAD
        //$("#gamediv").show();
        $("#loadingScreen").hide();
        $("#questionWait").show();
=======
<<<<<<< HEAD

        
        $("#loadingScreen").hide();
        $("#gamediv").show();
        //document.getElementById("loadingScreen").style.display="none";
        //document.getElementById("gamediv").style.display="unset";
        //document.getElementById("div.mainScreen").style.display="none";
=======
        $("#loadingScreen").hide();
        $("#questionWait").show();
>>>>>>> origin/BradyGame4square1
>>>>>>> refs/remotes/origin/BradyGame4square1

        host.draw();

        //console.log("I'm about to show host first screen because all players are in game");

        //this is where it calls to show host first screen
        socket.emit('showHostFirstScreen', {
        });
        return $hosts.animate({ scrollTop: $hosts.prop('scrollHeight') }, 300);
    });

    //used as an object for above. //has a draw function
    //kind of useless.. I think all I did was show a host name 
    var Host = function (arg) {
        this.user = arg.user;//, this.time = arg.time, this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $host;
                $host = $($('.message_template').clone().html());
                $host.addClass(_this.message_side).find('.user').html(_this.user);
                
                //what brady added
                $('.hosts').append($host);

                return setTimeout(function () {
                    return $host.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };



//host chooses the first question, and then everybody moves from loading screen to answer question
    socket.on('questionMessage', (msg)=>{
        console.log('get question message:')
        console.log(msg.text);

        //set the current question for all players?
        //alert("questionMessage currentChosenQuestion: "+msg.text);
        currentChosenQuestion = msg.text; //$(this).text();
        
        if (msg.text.trim() === '') {
            return;
        }

        //adds to gamediv2
        chosenQuestion.innerHTML = currentChosenCategoryNQuestion;//msg.text;

        //adds to gamediv3
        chosenQuestionTwo.innerHTML = currentChosenCategoryNQuestion;//msg.text;

        
        $("#gamediv").hide();
        $("#loadingScreen").hide();
        $("#questionWait").hide();
        $("div.gamediv2").show();
    });










// used to put answers in buttons. and set up answer button listeners
    socket.on('answerMessage', (msg)=>{
        console.log('get message')
        console.log(msg.username);
        console.log(msg.text);

        var $answerMessages, answerMessage;
        if (msg.text.trim() === '') {
            return;
        } 

        $answerMessages = $('.myAnswers');
        console.log('you: ' + user + 'sender: ' + msg.username)
        if(msg.username == user ){
            message_side = 'right';
        }else{
            message_side = 'left';
        }

        answerMessage = new AnswerMessage({
            user: msg.username,
            time: msg.time,
            text: msg.text,
            message_side: message_side,
            usersCount: msg.usersCount
        });

        //bradyadded
        answerMessage.draw();
        return $answerMessages.animate({ scrollTop: $answerMessages.prop('scrollHeight') }, 300);

    });

//an object used for socket.on('answerMessage'). draw function puts in all answers as buttons as they are entered
    var AnswerMessage = function (arg) {
        this.user = arg.user, this.usersCount = arg.usersCount, this.time = arg.time, this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $answerMessage;
                $answerMessage = $($('.answerTemplate').clone().html());
                $answerMessage.addClass(_this.text).find('.answerText').html(_this.text);
                $answerMessage.addClass(_this.text).find('.answerUser').html(_this.user);
                $('.myAnswers').append($answerMessage);

                //shuffle answer buttons
                var ul = document.querySelector('ul.myAnswers');
                for (var i = ul.children.length; i >= 0; i--) {
                    ul.appendChild(ul.children[Math.random() * i | 0]);
                }

                var answerMessagesButton = document.getElementsByClassName("answerText");


                if (firstTimeThroughAnswer == 0)
                {
                    //alert("currentChosenQuestion answermessage: " +currentChosenQuestion);
                    console.log("this is my first time thourgh answer");
                    console.log("this is the answer: " + myWordsDict[currentChosenQuestion]);

                    $answerMessage = $($('.answerTemplate').clone().html());
                    $answerMessage.addClass(_this.text).find('.answerText').html(myWordsDict[currentChosenQuestion]);
                    $answerMessage.addClass(_this.text).find('.answerUser').html("Computer");
                    
                    $('.myAnswers').append($answerMessage);

                    //shuffle answer buttons
                    //var ul = document.querySelector('ul.myAnswers');
                    for (var i = ul.children.length; i >= 0; i--) {
                        ul.appendChild(ul.children[Math.random() * i | 0]);
                    }
                    firstTimeThroughAnswer +=1;
                }

                
                scoresHtml += "<p>" +_this.user + " input the answer: " +_this.text + "</p>";
                

                

                for (var i = 0; i < answerMessagesButton.length; i++) {
                    answerMessagesButton[i].onclick = function() {
                        //alert(this.innerHTML);//textContent);//innerHTML);//textContent);//Content);
                        $temp = $($('.answerTemplate').clone().html());
                        //alert(this.innerHTML);
                        console.log("I'm in answer messages button");
                        $("#answerChosen").show();
                        $("div.gamediv3").hide();
                        firstTimeThroughAnswer = 0;
                
                        
                        socket.emit('addToChosenAnswer', { 
                        text: this.innerHTML,
                        username: user
                        });
                        

                        console.log("usersCount: " + arg.usersCount);
                        console.log("usersChosenAnswer count: " + usersChosenAnswer);
                    }

                    $(answerMessagesButton[i]).show();
                    $(answerMessagesButton[answerMessagesButton.length-1]).hide();
                }

                return setTimeout(function () {
                    return $answerMessage.addClass('appeared');
                }, 0);
                
            };
        }(this);
        return this;
    };



//used to hide "waiting for users to answer" loading screen. and shows the users answers page
    socket.on('hideLoading', function (msg) {
        console.log("hiding waiting for users to answer and showing gamediv3.");
        
        $("#answerWait").hide();
        $("div.gamediv3").show();
    });




//used to show how many users are logged in on very first login loadingScreen
//waiting for all users to login
//also is called when user logs out
    socket.on('message', (msg)=>{
        console.log('get message')
        console.log(msg.username);
        console.log(msg.text);
        var $messages, message;

        if (msg.text.trim() === '') {
            return;
        }
        $('.message_input').val('');
        $messages = $('.messages');

        console.log('you: ' + user + 'sender: ' + msg.username)
        if(msg.username == user ){
            message_side = 'right';
        }else{
            message_side = 'left';
        }
        //message_side = message_side === 'left' ? 'right' : 'left';
        message = new Message({
            user: msg.username,
            time: msg.time,
            text: msg.text,
            message_side: message_side
        });

        message.draw();
        return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
    });
  
    
  
    var Message = function (arg) {
        this.user = arg.user, this.time = arg.time, this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $message.addClass(_this.message_side).find('.user').html(_this.user);
                $message.addClass(_this.message_side).find('.time').html(_this.time);
                console.log('text: '+_this.text+' user: '+_this.user+' time: '+_this.time);
                $('.messages').append($message);

                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
/*
//shows that a user logged into the game
    socket.emit('join', {
            username: user,
            numberOfPlayers: myNumberOfPlayers
    });
*/


    
//once everyone chooses an answer, then this calls to show scores for the end of the round
    socket.on('addOneChosenAnswer', function (msg) {
        usersChosenAnswer += 1;

        
        console.log("Game: how many users have chosen answer: " + usersChosenAnswer);

        if(msg.usersCount == usersChosenAnswer)
        {
            console.log("They are equal!");
            $("#answerChosen").hide();
            //$("div.gamediv3").show();
            //$(".answerUser").show();
            usersChosenAnswer = 0;

            console.log("I'm about to show users answers");
            socket.emit('emptyUserAnswers', {   
            });
        }
    });


//used to show ONLY the HOST the screen to choose the new question for the round
    socket.on('hostFirstScreen', function (msg) {
        console.log("i'm in game to show host first screen");
        var $answerMessage;
        $answerMessage = $($('.answerTemplate').clone().html());
        
        $('.myAnswers').empty();
        //scores.innerHTML = "";
        $("#finalscores").hide();
        $("#gamediv").show();
        $("#questionWait").hide();        
    });


//used to show scores at the end of each round
    //used for showscores
    var myTempCount = 0;
    socket.on('showScores', function (msg) {
        console.log("I'm in show scores. heres the innerHTML:");
        //alert(scores.innerHTML);
        scores.innerHTML = msg.text+ "</br><h1>User Answers: </h1>"+scoresHtml;

        $('.message_input').val('');

        

        if (myTempCount == 0)
        {
            myHtmlRoundNumber += 1;

            myTempCount +=1;
        }
        else
        {
            myTempCount = 0;
        }
        
        for (var i = 0; i < roundHtml.length; i++) {
            roundHtml[i].innerHTML = "<p> Round Number: "+myHtmlRoundNumber+"</p>";
        }

        $("#scores").show();

        function startOver()
        {
            myTempCount = 0;
            $("#scores").hide();
            //$("#gamediv").show();
            $("#questionWait").show();

            socket.emit('showHostFirstScreen', {
            
            });

            var $answerMessage;
            $answerMessage = $($('.answerTemplate').clone().html());
            
            $('.myAnswers').empty();
            scores.innerHTML = "";

        }

        setTimeout(startOver, 5000);
    });



//used to show final scores at the end of the game
    socket.on('showFinalScores', function (msg) {
        console.log("I'm in show final scores. heres the innerHTML:");
        //alert(finalscores.innerHTML);
        $('.message_input').val('');
        finalscores.innerHTML = msg.text+ "</br><h1>User Final Answers: </h1>"+scoresHtml;

        finalscores.innerHTML += "</br></br><h1> Would you like to Continue Game for Another Round? </h1>";


    
        //finalscores.innerHTML += "<form id='myForm' action='' method='post'><button id='choseYes' value="+myGameName+" name='myChoice' type='text'> Yes </button><button id='choseNo' name='myChoice' value='choseNo' type='text'> No </button></form>";
        finalscores.innerHTML += "<button class='choseYes' id='choseYes' value="+myGameName+" name='myChoice' type='text'> Yes </button>&nbsp&nbsp&nbsp&nbsp<button class='choseNo' id='choseNo' name='myChoice' value='choseNo' type='text'> No </button>";

        //var form = document.getElementById("myForm");
        //$(document.body).append(form);


        var choseYes = document.getElementById("choseYes");
        var choseNo = document.getElementById("choseNo");


        choseYes.onclick = function() {
            //sets rounds back over, then calls userChoseYesStartAgain below.
            //used to send to all players since onclicks don't resume in the socket.on, it only sends to one person
            socket.emit('userChoseYes', {
            });
        }
        choseNo.onclick = function() {
            //finalscores.innerHTML += "<p> You chose No </p>";
            $('#choseYes').hide();
            $('#choseNo').hide();

            socket.emit('hideYesNo', {
            
            });
        }


        $("#scores").hide();
        $("#finalscores").show();
    });

//gets called eventually from onclick function above userChoseYes
//continues the game with a new round
    socket.on('userChoseYesStartAgain', function (msg) {
        
        
        myHtmlRoundNumber += 1;

        if (myTempCount ==0)
        {
            myTempCount+=1;
            
            roundHtml = document.getElementsByClassName("roundNumber");
            //this sets round number 1 on first login
            for (var i = 0; i < roundHtml.length; i++) {
                roundHtml[i].innerHTML = "<p> Round Number: "+myHtmlRoundNumber+"</p>";
            }
        }
        else
        {
            myTempCount = 0;
        }
        
        
        $("#finalscores").hide();
        //$("#gamediv").show();
        $("#questionWait").show();

        socket.emit('showHostFirstScreen', {
        
        });
        
        var $answerMessage;
        $answerMessage = $($('.answerTemplate').clone().html());
        
        $('.myAnswers').empty();
        scores.innerHTML = "";
        //finalscores.innerHTML += "<p> You chose Yes </p>";
        //$.post("", { 'myChoice': myGameName });
    });

//used if user chooses not to continue game at the end of the game. hides the yes and no button.
//and then shows the button to return to home page
    socket.on('hideYesNoButtons', function (msg) {
        console.log("i'm in hide yes no buttons");

        finalscores.innerHTML += "<p>A Player Chose To Not Continue Game. Thanks for Playing! Click Button Below to Return to Home Page. </p>";
        $('#choseYes').hide();
        $('#choseNo').hide();

        finalscores.innerHTML += "<form id='myForm' action='' method='post'><button class='choseYes' id='choseYes' value="+myGameName+" name='myChoice' type='text'> Return Home </button></form>";

    });



    var firstTimeThroughAnswer = 0;    





//functions that were already here. when we started project 3.
//I used it to send the answers.
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            
            if ($message_input.val() ==null || $message_input.val()=="") 
            { 
                return "blank response"; 
            } 
            else 
            { 
                return $message_input.val(); 
            } 
        };
        sendMessage = function (text) {
            console.log('send: ' + text);
            socket.emit('send', { 
                username: user,
                text: text 
            });
        };
        
        
        //used to send answer
        $('.send_message').click(function (e) {
            console.log("I clicked .send_message button"); 
            $("div.gamediv2").hide();
            $("#answerWait").show();
            return sendMessage(getMessageText());
        });

        $('.message_input').keypress(function (e) {
            var key = e.which;
            if(key == 13)  // the enter key code
            {
                $('.send_message').click();
                return false;  
            }
        }); 
    });
}




