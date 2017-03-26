window.onload = function() {

    //var messages = [];
    //var socket = io.connect('http://localhost:3000');
    //var field = document.getElementById("chat-text");
    var sendButton = document.getElementsByClassName("send");
    var chosenQuestion = document.getElementById("chosenQuestion");
    var sendAnswer = document.getElementById("sendAnswer");
    var inputAnswer = document.getElementById("inputAnswer");
    var answers = document.getElementById("answers");

    //let socket = io.connect();
    //var chat = document.getElementById("chat-messages");
    //var name = document.getElementById("myName");
    //field.focus();
    //var user;
/*
    socket.emit('join', { username: name.value });

    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += "<strong>" + (messages[i].username ? messages[i].username : 'Server') + ': </strong>';
                html += messages[i].message + '<br /><hr />';
                user = messages[i].username;
            }
            chat.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    }); 
    */   
    for (var i = 0; i < sendButton.length; i++) {
        sendButton[i].onclick = function() {
            // var text = field.value;
                console.log("hello");
                alert(this.name);
                chosenQuestion.innerHTML = this.name;
                //console.log(sendButton[0].name);
                //socket.emit('send', { message: text});//, username: name.value });
                //field.value = "";
                //field.focus();
                
                //scrollToBottom();
        }
    }

    sendAnswer.onclick = function() {
        console.log("answer");
        console.log(inputAnswer.value);
        alert(inputAnswer.value);
        answers.innerHTML += inputAnswer.value.toLowerCase();
        answers.innerHTML += '<br /><hr />';
        //chosenQuestion.innerHTML = sendAnswer.value;
    }
};

/*
document.getElementById('chat-text')
    .addEventListener('keypress', function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            document.getElementById('send').click();
        }
});
*/