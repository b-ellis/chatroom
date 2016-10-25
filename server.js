var socket_io = require("socket.io");
var http = require("http");
var express = require("express");

var app = express();

app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var people = {};


io.on('connection', function (socket) {
    console.log(socket.id);
    console.log('Client connected');
    
    socket.on('join', function(name) {
        people[socket.id] = name;
        console.log(people);
        socket.emit('join', name);
        console.log(name, "joined the chat");
    });
    
    socket.on('message', function(message) {
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);
    });
    
});

  
server.listen(process.env.PORT || 8080);