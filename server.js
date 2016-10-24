var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "node-socketio-chat"});

var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = 3000;
if(process.argv[2] === undefined) {
    // do nothing
} else {
    port = process.argv[2];
}

app.use(express.static(__dirname));

io.on('connection', function (socket) {
    log.info("new connection received");

    socket.on('logging-in', function (username) {
        log.info("logging-in %s", username);
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
        log.info("logging-out %s", username);
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
        log.info("%s clicked-button %s", socket.username, chatMessage);
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
        log.info("disconnect received");
    });
});

server.listen(port, function () {
  log.info('Server listening at port %d', port);
});
