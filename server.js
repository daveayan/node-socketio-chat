var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = 3000;

app.use(express.static(__dirname));

io.on('connection', function (socket) {
    console.log("new connection received");

    socket.on('logging-in', function (username) {
        console.log("logging-in %s", username);
        socket.username = username;

        socket.broadcast.emit('logged-in', {
            username: socket.username,
            message: username + " logged in"
        });

        socket.emit('logged-in', {
            username: socket.username,
            message: username + " logged in"
        });
    });

    socket.on('logging-out', function (username) {
        console.log("logging-out %s", username);
        socket.username = username;

        socket.broadcast.emit('logged-out', {
            username: socket.username,
            message: username + " logged out"
        });

        socket.emit('logged-out', {
            username: socket.username,
            message: username + " logged out"
        });
    });

    socket.on('send-message', function (chatMessage) {
        console.log("%s clicked-button %s", socket.username, chatMessage);
        socket.broadcast.emit('message-from-server', {
            username: socket.username,
            sender: socket.username,
            message: chatMessage
        });

        socket.emit('message-from-server', {
            username: socket.username,
            sender: socket.username,
            message: chatMessage
        });
    });

    socket.on('disconnect', function () {
        console.log("disconnect received");
    });
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
