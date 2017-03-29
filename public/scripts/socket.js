var usernames = {};
var rooms = ['room1', 'room2', 'room3'];


io.sockets.on('connection', function(socket) {
  //Everything we do in here is related to socket connections
  //socket is the user, we can communicate with it from here.
    socket.on('addUser', function(username){
      //When the client emits an add user, we perform that functionality
      socket.username = username;
      console.log(username + "Connected");

      //tell the user to join the default room
      socket.room = rooms[0];
      //save the user
      usernames[username] = username;
      //physically join the player and it's socket to the room
      socket.join(socket.room);

      //emit, to the client, you've connected
      updateClient(socket, username, socket.room);

      //emit to the room, a person has connected
      //socket.broadcast.to(socket.room).emit('updateChat', 'SERVER', username + ' has connected');
      updateChatRoom(socket, 'connected');
      updateRoomList(socket, socket.room);

    });
    //take in the message, emit it
    socket.on('sendChat', function (data) {
        //send the message to everyone
        console.log(socket.username + " sent a message");
        io.sockets.in(socket.room).emit('updateChat', socket.username, data);
    })
    //when we switch a room
    socket.on('switchRoom', function(newRoom) {
        socket.leave(socket.room);
        socket.join(newRoom);
        //update client
        updateClient(socket, socket.username, newRoom);
        //update old room
        updateChatRoom(socket, 'disconnected');
        //change room
        socket.room = newRoom;
        //update new room
        updateChatRoom(socket, 'connected');
        updateRoomList(socket, socket.room);
    })
    //disconnecting from a room
    socket.on('diconnect', function() {
        // remove the user from global list
        delete usernames[socket.username];
        // tell the user list on the client side
        io.sockets.emit('updateUsers', usernames);
        //tell everyone\
        updateGlobal(socket, 'disonnected');
        //leave channel
        socket.leave(socket.room);
    })
});
/*window.onload = () => {
    let user = document.getElementsByTagName('p')[0].textContent;

    let socket = io.connect();
    window.onbeforeunload = () => {
        socket.emit('leave',{
            username: document.getElementsByTagName('p')[0].textContent
        })
    };
    socket.on('message', (msg)=>{
        console.log('get message')
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
        $('.send_message').click(function (e) {
            return sendMessage(getMessageText());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(getMessageText());
            }
        });
    });
}*/