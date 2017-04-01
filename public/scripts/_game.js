window.onload = () => {
//Brady stuff

    var sendButton = document.getElementsByClassName("sendQuestion");
    var chosenQuestion = document.getElementById("chosenQuestion");
    var chosenQuestionTwo = document.getElementById("chosenQuestionTwo");
    //var sendAnswer = document.getElementById("sendAnswer");
    var inputAnswer = document.getElementById("inputAnswer");
    var answers = document.getElementById("answers");

    //***used to see if all users have chosen an answer
    var usersChosenAnswer = 0;

    var scores = document.getElementById("scores");
    var scores = document.getElementById("finalscores");
    
    var buttonHtml = "";
    var buttonNumber = 0;

    var myHtmlRoundNumber = 1;
    var roundHtml = document.getElementsByClassName("roundNumber");

    for (var i = 0; i < roundHtml.length; i++) {
        roundHtml[i].innerHTML = "<p> Round Number: "+myHtmlRoundNumber+"</p>";
    }



    //used to see if everybodys entered an answer
    var usersAnswered = 0;

    var currentChosenQuestion = "";


    //just using to see if I got data from Game.pug
    /*
    console.log("my local data: " +myWordsList);

    for (var i = 0; i<3; i++)
    {
        var randomNum= Math.floor(Math.random() * (myWordsList.length))
        var myQuestion = myWordsList[randomNum].question
        console.log("my questions " +myWordsList[randomNum].question)
    }
    */

    var myWordsDict= {}; 

    //used to make it so only words in Category are chosen as questions (gets rid of other categories in list)
    for (var i = 0; i<myWordsList.length; i++)
    {
        var foundIt = "false";
        for (var j = 0; j<myCategories.length; j++)
        {
            if (myCategories[j] == myWordsList[i].category)
            {
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

    


    for (var i = 0; i<myWordsList.length; i++)
    {
        var question = myWordsList[i].question;
        var answer = myWordsList[i].answer;
        myWordsDict[question] = answer;

        console.log("answer: " +myWordsDict[question]);
    }

    console.log("my categories: " + myCategories[0]);

    var gamediv = document.getElementById("gamediv");

    gamediv.innerHTML = "<h1> Choose Question For the Round </h1>";
    
    var myChosenWords = {};
    var count = 0;
    for (var i = 0; i<4; i++)
    {
        var randomNum= Math.floor(Math.random() * (myWordsList.length))
        var myQuestion = myWordsList[randomNum].question


        if (myChosenWords[myQuestion] == "true")
        {
          var myCount = 0
          while (myChosenWords[myQuestion] == "true" && myCount <20)
          {
            randomNum= Math.floor(Math.random() * (myWordsList.length));
            myQuestion = myWordsList[randomNum].question
            myCount +=1;
          }
          myChosenWords[myQuestion] = "true"
          if (myCount ==20)
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
        var myString= "<button class=sendQuestion name=\""+myQuestion+"\">"+ myQuestion + "</button>";
        console.log(myString);
        gamediv.innerHTML += "<button class=sendQuestion name=\" "+myQuestion+"\">"+ myQuestion + "</button>";
        
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


    let user = document.getElementsByTagName('p')[0].textContent;

    let socket = io.connect();
    window.onbeforeunload = () => {
        socket.emit('leave',{
            username: document.getElementsByTagName('p')[0].textContent
        })
    };




    
    socket.emit('sendWordsDict', { 
        wordList: myWordsList
    });

    for (var i = 0; i < sendButton.length; i++) {
        sendButton[i].onclick = function() {
            console.log("hello");
            alert($(this).text());
            //chosenQuestion.innerHTML = this.name;

            //testing the jquery hide() function in javascript
            document.getElementById("gamediv").style.display="none";

            socket.emit('sendQuestion', { 
                username: user,
                text: $(this).text(), //this.name 
                rounds: myRounds
            });

            

            
            for (var i = 0; i<4; i++)
            {
                
                var randomNum= Math.floor(Math.random() * (myWordsList.length))
                var myQuestion = myWordsList[randomNum].question

                if (myChosenWords[myQuestion] == "true")
                {
                    var myCount = 0
                    while (myChosenWords[myQuestion] == "true" && myCount <20)
                    {
                        randomNum= Math.floor(Math.random() * (myWordsList.length));
                        myQuestion = myWordsList[randomNum].question
                        myCount +=1;
                    }
                    myChosenWords[myQuestion] = "true"
                    if (myCount ==20)
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

/*
                var your_div = document.getElementById('gamediv');

                var text_to_change = your_div.childNodes[i];

                text_to_change.nodeValue = myQuestion;
                */

                $(sendButton[i]).text(myQuestion);

                //var currentOne = 'button.sendQuestion['+i+']';
                //$('button.sendQuestion').text('Hello');
                //$('button.sendQuestion').name('Hello');
                //$(this).innerHTML = myQuestion;
                //var myString= "<button class=sendQuestion name=\""+myQuestion+"\">"+ myQuestion + "</button>";
                //console.log(myString);
                //gamediv.innerHTML += "<button class=sendQuestion name=\" "+myQuestion+"\">"+ myQuestion + "</button>";
                
            }

            
        }
    }


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

        $("#loadingScreen").hide();
        $("#questionWait").show();
        //document.getElementById("loadingScreen").style.display="none";
        //document.getElementById("gamediv").style.display="unset";
        //document.getElementById("div.mainScreen").style.display="none";

        host.draw();

        console.log("I'm about to show host first screen because all players are in game");
        socket.emit('showHostFirstScreen', {
        });
        return $hosts.animate({ scrollTop: $hosts.prop('scrollHeight') }, 300);
    });




//host chooses the first question, and then everybody moves from loading screen to answer question
    socket.on('questionMessage', (msg)=>{
        console.log('get question message:')
        console.log(msg.text);

        //set the current question for all players?
        currentChosenQuestion = msg.text; //$(this).text();
        
        if (msg.text.trim() === '') {
            return;
        }

        //adds to gamediv2
        chosenQuestion.innerHTML = msg.text;

        //adds to gamediv3
        chosenQuestionTwo.innerHTML = msg.text;

        
        $("#gamediv").hide();
        $("#loadingScreen").hide();
        $("#questionWait").hide();
        $("div.gamediv2").show();
    });











    socket.on('answerMessage', (msg)=>{
        console.log('get message')
        console.log(msg.username);
        console.log(msg.text);

        //Brady added
        
        var $answerMessages, answerMessage;
        if (msg.text.trim() === '') {
            return;
        } 
        //$('.answerMessages').val(''); 
        //Bradyadded
        //$answerMessages = $('.answerMessages');
        $answerMessages = $('.myAnswers');
        console.log('you: ' + user + 'sender: ' + msg.username)
        if(msg.username == user ){
            message_side = 'right';
        }else{
            message_side = 'left';
        }

//my attempt to use innerHTML for answer buttons
/*
        var btnNumber = buttonNumber +"";
        buttonHtml = "<button id=\""+btnNumber+"\" value=\""+msg.text+"\">"+msg.text+"</button>";
        $('.myAnswers').innerHTML += buttonHtml;

        console.log(buttonHtml);

        var answerMessagesButton = document.getElementById(btnNumber);


        
        answerMessagesButton.onclick = function() {
            alert(this.innerHTML);//textContent);//innerHTML);//textContent);//Content);
            
            console.log("I'm in answer messages button");
            $("#loadingScreen").show();
            $("div.gamediv3").hide();

            

            socket.emit('addToChosenAnswer', { 
                text: this.innerHTML,
                username: user
            });

            console.log("usersCount: " + arg.usersCount);
            console.log("usersChosenAnswer count: " + usersChosenAnswer);
        };
        */

// removed for a second

        //bradyadded
        answerMessage = new AnswerMessage({
            user: msg.username,
            time: msg.time,
            text: msg.text,//name="+msg.text.toLowerCase()+"\">" + msg.text.toLowerCase() +"</button></br>",
            message_side: message_side,
            usersCount: msg.usersCount
        });
/*
        usersAnswered +=1;
        if (usersAnswered == msg.usersCount)
        {
            $("div.gamediv3").show();
        }
        else
        {
            displayLoading();
        }
        */

        //bradyadded
        answerMessage.draw();
        return $answerMessages.animate({ scrollTop: $answerMessages.prop('scrollHeight') }, 300);
        
    
    });

    socket.on('hideLoading', function (msg) {
        
        console.log("hiding waiting for users to answer and showing gamediv3.");
        
/*
        console.log("the answer i'm sending: "+myWordsDict[currentChosenQuestion]);

        answerMessage = new AnswerMessage({
            user: "Computer",
            text: myWordsDict[currentChosenQuestion]
        });

        

        answerMessage.draw();
*/
        $("#answerWait").hide();
        $("div.gamediv3").show();

/*
        socket.emit('reallyHideLoading', {

        });
        */
        
        
    });

    socket.on('reallyReallyHideLoading', function (msg) {


        

        $("#answerWait").hide();
        $("div.gamediv3").show();
        
    });
/*
    function displayLoading()
    {
        $("#loadingScreen").show();
    }
    */


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

    socket.emit('join', {
            username: user,
            numberOfPlayers: myNumberOfPlayers
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

    //used for showscores
    var myTempCount = 0;

    socket.on('showScores', function (msg) {
        console.log("I'm in show scores. heres the innerHTML:");
        //alert(scores.innerHTML);
        scores.innerHTML = msg.text;

        $('.message_input').val('');

        if (myTempCount == 0)
        {
            myHtmlRoundNumber += 1;

            myTempCount +=1;
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




    socket.on('showFinalScores', function (msg) {
        console.log("I'm in show final scores. heres the innerHTML:");
        alert(finalscores.innerHTML);
        finalscores.innerHTML = msg.text;

        finalscores.innerHTML += "</br></br><h1> Would you like to start a New Game? </h1>";


    
        //finalscores.innerHTML += "<form id='myForm' action='' method='post'><button id='choseYes' value="+myGameName+" name='myChoice' type='text'> Yes </button><button id='choseNo' name='myChoice' value='choseNo' type='text'> No </button></form>";
        finalscores.innerHTML += "<button id='choseYes' value="+myGameName+" name='myChoice' type='text'> Yes </button><button id='choseNo' name='myChoice' value='choseNo' type='text'> No </button>";

        //var form = document.getElementById("myForm");
        //$(document.body).append(form);


        var choseYes = document.getElementById("choseYes");
        var choseNo = document.getElementById("choseNo");


        choseYes.onclick = function() {
            myTempCount = 0;
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
        }
        choseNo.onclick = function() {
            finalscores.innerHTML += "<p> You chose No </p>";
        }


        $("#scores").hide();
        $("#finalscores").show();
    });



    var firstTimeThroughAnswer = 0;    

//brady added this function, a modification of Message
    var AnswerMessage = function (arg) {
        this.user = arg.user, this.usersCount = arg.usersCount, this.time = arg.time, this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $answerMessage;
                //$answerMessage = $($('.answerMessages').clone().html());
                $answerMessage = $($('.answerTemplate').clone().html());
                console.log("the text i'm adding to the answer button: " + _this.text);
                $answerMessage.addClass(_this.text).find('.answerText').html(_this.text);
                $answerMessage.addClass(_this.text).find('.answerUser').html(_this.user);
                //$answerMessage.addClass(_this.message_side).find('.time').html(_this.time);
                console.log('text: '+_this.text+' user: '+_this.user+' time: '+_this.time);
                console.log("here is my answermessage: ");
                console.log($answerMessage);
                //what brady added
                //$('.answerMessages').append($answerMessage);
                $('.myAnswers').append($answerMessage);

                //shuffle answer buttons
                var ul = document.querySelector('ul.myAnswers');
                for (var i = ul.children.length; i >= 0; i--) {
                    ul.appendChild(ul.children[Math.random() * i | 0]);
                }

                var answerMessagesButton = document.getElementsByClassName("answerText");


                if (firstTimeThroughAnswer == 0)
                {
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
                

                

                for (var i = 0; i < answerMessagesButton.length; i++) {
                    answerMessagesButton[i].onclick = function() {
                        //alert(this.innerHTML);//textContent);//innerHTML);//textContent);//Content);
                        $temp = $($('.answerTemplate').clone().html());
                        alert(this.innerHTML);
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

    //brady added this function, a modification of Message
    var Host = function (arg) {
        this.user = arg.user;//, this.time = arg.time, this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $host;
                $host = $($('.message_template').clone().html());
                //$host.addClass(_this.message_side).find('.text').html(_this.text);
                $host.addClass(_this.message_side).find('.user').html(_this.user);
                //$answerMessage.addClass(_this.message_side).find('.time').html(_this.time);
                //console.log('text: '+_this.text+' user: '+_this.user+' time: '+_this.time);
                
                //what brady added
                $('.hosts').append($host);

                return setTimeout(function () {
                    return $host.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };


/*
    //brady added this function, a modification of Message
    var QuestionMessage = function (arg) {
        this.text = arg.text;//, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $questionMessage;
                //$host = $($('.message_template').clone().html());
                $questionMessage = $($('chosenQuestion').clone().html());
                $questionMessage.addClass(_this.message_side).find('.text').html(_this.text);
                
                //this adds to gamediv2
                $('chosenQuestion').append($questionMessage);
                //this adds to gamediv3 
                $('chosenQuestionTwo').append($questionMessage);

                return setTimeout(function () {
                    return $questionMessage.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    */

    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text) {
            console.log('send: ' + text);
            socket.emit('send', { 
                username: user,
                text: text 
            });
        };

/*
        //Brady added
        getQuestionText = function () {
            var $message_input;
            $message_input = $('.sendQuestion');
            return $sendQuestion.val();
        };

        sendQuestion = function (text) {
            console.log('sendQuestion: ' + text);
            socket.emit('sendQuestion', { 
                username: user,
                text: text 
            });
            */
        
        
        $('.send_message').click(function (e) {
            return sendMessage(getMessageText());
        });

        
            
        
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                //Brady took this out
                //return sendMessage(getMessageText()); 
            }
        });
        // sendMessage('Hello Philip! :)');
        // setTimeout(function () {
        //     return sendMessage('Hi Sandy! How are you?');
        // }, 1000);
        // return setTimeout(function () {
        //     return sendMessage('I\'m fine, thank you!');
        // }, 2000);
    });

}



//- demo js this is an example of how to interact with the chat 
// (function () {
//     var Message;
//     Message = function (arg) {
//         this.text = arg.text, this.message_side = arg.message_side;
//         this.draw = function (_this) {
//             return function () {
//                 var $message;
//                 $message = $($('.message_template').clone().html());
//                 $message.addClass(_this.message_side).find('.text').html(_this.text);
//                 $('.messages').append($message);
//                 return setTimeout(function () {
//                     return $message.addClass('appeared');
//                 }, 0);
//             };
//         }(this);
//         return this;
//     };
//     $(function () {
//         var getMessageText, message_side, sendMessage;
//         message_side = 'right';
//         getMessageText = function () {
//             var $message_input;
//             $message_input = $('.message_input');
//             return $message_input.val();
//         };
//         sendMessage = function (text) {
//             var $messages, message;
//             if (text.trim() === '') {
//                 return;
//             }
//             $('.message_input').val('');
//             $messages = $('.messages');
//             message_side = message_side === 'left' ? 'right' : 'left';
//             message = new Message({
//                 text: text,
//                 message_side: message_side
//             });
//             message.draw();
//             return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
//         };
//         $('.send_message').click(function (e) {
//             return sendMessage(getMessageText());
//         });
//         $('.message_input').keyup(function (e) {
//             if (e.which === 13) {
//                 return sendMessage(getMessageText());
//             }
//         });
//         sendMessage('Hello Philip! :)');
//         setTimeout(function () {
//             return sendMessage('Hi Sandy! How are you?');
//         }, 1000);
//         return setTimeout(function () {
//             return sendMessage('I\'m fine, thank you!');
//         }, 2000);
//     });
// }.call(this));

