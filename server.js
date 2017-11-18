var express = require('express');
var app = express();
var path = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = []; // in format of [{ id: randomSocketId, userName: usernameString }, ...]
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
  res.sendFile(__dirname +'/index.html');
});

io.on('connection', function(socket) {
  // adds user if they are unique username otherwise asks for new one
  // via pickNew event
  socket.on('chat message', function(msg) {
    var msgObj = { message: msg, user: socket.id }
    io.emit('chat message', msgObj); 
  });

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });
});

http.listen(process.env.PORT || 3000, function() {
  console.log('listening on ' + (process.env.PORT || 3000));
});

