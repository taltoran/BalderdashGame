
module.exports = (io) => {
    var app = require('express');
    var router = app.Router();
    var userCount = 0;
    // socket.io events
    io.on('connection', function (socket) {
        userCount++;
        console.log('a user connected ' + userCount + ' user(s)');
        socket.emit('message',{
            username: 'Chat It Up', 
            text: 'Welcome to Chat', 
        });
        socket.on('send', function (msg) {
            var stamp = new Date().toLocaleTimeString();
            if(stamp.length == 10 ){
                stamp = stamp.substring(0, 4) + ' ' + stamp.substring(8, 10)
            }else{
                stamp = stamp.substring(0, 5) + ' ' + stamp.substring(9, 11)
            }
            io.emit('message', { 
                username: msg.username, 
                text: msg.text, 
                time: stamp
            });
        });
        socket.on('join', function (msg) {
            var stamp = new Date().toLocaleTimeString();
            if(stamp.length == 10 ){
                stamp = stamp.substring(0, 4) + ' ' + stamp.substring(8, 10)
            }else{
                stamp = stamp.substring(0, 5) + ' ' + stamp.substring(9, 11)
            }
            io.emit('message', {
                username: 'Chat It Up', 
                text: msg.username + ' has joined Chat', 
                time: stamp
            });
        });
        socket.on('leave', function (msg) {
            var stamp = new Date().toLocaleTimeString();
            if(stamp.length == 10 ){
                stamp = stamp.substring(0, 4) + ' ' + stamp.substring(8, 10)
            }else{
                stamp = stamp.substring(0, 5) + ' ' + stamp.substring(9, 11)
            }
            io.emit('message', {
                username: 'Chat It Up', 
                text: msg.username + ' has left Chat', 
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