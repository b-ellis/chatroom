var socket_io = require("socket.io");
var http = require("http");
var express = require("express");

var app = express();

app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var people = {};

function getNameFromId(socketId) {
  for (name in people) {
    if (people[name] == socketId) {
      return name;
    }
  }
  return null;
}

io.on('connection', function (socket) {

    socket.on('join', function(name) {
        // this loop goes through everyone on the server and sends a message to the connecting Client
        // to inform them.
        for (person in people) {
          socket.emit('join', person);
        }
        people[name] = socket.id;
        // broadcast info about connecting client to everyone else in chatroom.
        socket.broadcast.emit('join', name);
    });

    socket.on('message', function(message) {
        var senderSocketId = socket.id;
        var senderName = getNameFromId(senderSocketId);
        var tokens = message.split(':');
        var destinationUser = tokens[0];
        var destinationUserID = people[destinationUser];
        if (destinationUserID) {
          io.to(destinationUserID).emit('message', senderName + ":" + tokens[1]);
        }
    });

});


server.listen(process.env.PORT || 8080);
