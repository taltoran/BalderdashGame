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
    
    var buttonHtml = "";
    var buttonNumber = 0;

    //used to see if everybodys entered an answer
    var usersAnswered = 0;
    

    for (var i = 0; i < sendButton.length; i++) {
        sendButton[i].onclick = function() {
            console.log("hello");
            alert(this.name);

            //chosenQuestion.innerHTML = this.name;

            //testing the jquery hide() function in javascript
            document.getElementById("gamediv").style.display="none";

            socket.emit('sendQuestion', { 
                username: user,
                text: this.name 
            });
        }
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



//Not Brady's Stuff
    let user = document.getElementsByTagName('p')[0].textContent;

    let socket = io.connect();
    window.onbeforeunload = () => {
        socket.emit('leave',{
            username: document.getElementsByTagName('p')[0].textContent
        })
    };


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

        document.getElementById("loadingScreen").style.display="none";
        document.getElementById("gamediv").style.display="unset";
        //document.getElementById("div.mainScreen").style.display="none";

        host.draw();
        return $hosts.animate({ scrollTop: $hosts.prop('scrollHeight') }, 300);
    });




//host chooses the first question, and then everybody moves from loading screen to answer question
    socket.on('questionMessage', (msg)=>{
        console.log('get question message:')
        console.log(msg.text);
        
        if (msg.text.trim() === '') {
            return;
        }

        //adds to gamediv2
        chosenQuestion.innerHTML = msg.text;

        //adds to gamediv3
        chosenQuestionTwo.innerHTML = msg.text;

        
        $("#gamediv").hide();
        $("#loadingScreen").hide();
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
        $("div.gamediv3").show();
        $("#loadingScreen").hide();
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
            username: user
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
            $("#loadingScreen").hide();
            //$("div.gamediv3").show();
            //$(".answerUser").show();
            usersChosenAnswer = 0;

            console.log("I'm about to show users answers");
            socket.emit('emptyUserAnswers', { 
                           
            });
        }
    });

    socket.on('showScores', function (msg) {
        console.log("I'm in show scores. heres the innerHTML:");
        //alert(scores.innerHTML);
        scores.innerHTML = msg.text;

        $("#scores").show();

        function startOver()
        {
            $("#scores").hide();
            $("#gamediv").show();

            var $answerMessage;
            $answerMessage = $($('.answerTemplate').clone().html());
            
            $('.myAnswers').empty();
            scores.innerHTML = "";

        }

        setTimeout(startOver, 5000);
    });



    

//brady added this function, a modification of Message
    var AnswerMessage = function (arg) {
        this.user = arg.user, this.usersCount = arg.usersCount, this.time = arg.time, this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $answerMessage;
                //$answerMessage = $($('.answerMessages').clone().html());
                $answerMessage = $($('.answerTemplate').clone().html());
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


                for (var i = 0; i < answerMessagesButton.length; i++) {
                    answerMessagesButton[i].onclick = function() {
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
                        

                        


                    }
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