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
  socket.on('askUser', function(potentialUsername) {
    var justUsers = users.map(function (el) {
      return el.userName
    });

    // if we find a username already === potentialUsername emit event
    // to prompt user again
    if (justUsers.includes(potentialUsername)) {
      socket.emit('pickNew');
    } else {
      // push a "user object" with unique id and potentialUsername
      users.push({ id: socket.id, userName: potentialUsername });
    }
  });

  socket.on('chat message', function(msg) {
    var username = "";
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === socket.id) {
        var username = users[i].userName
      }
    }
    var msgObj = { message: msg, user: username }
    io.emit('chat message', msgObj); 
  });
  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });
});

http.listen(process.env.PORT || 3000, function() {
  console.log('listening on ' + process.env.PORT || 3000);
});

