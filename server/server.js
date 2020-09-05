// Import Express and instantiate
const express = require('express');
const app = express();

// Import http-server and associate it with express object
const server = require('http').Server(app);

// Import socket.io and associate it with the server to listen.
const io = require('socket.io').listen(server);

// Current online players
const players = {};

// Colours
const colours = require('./colours');

console.log("Loading Client data from: " + process.cwd() + "\\client")
app.use(express.static(process.cwd() + '/client'));
 
// Root
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/client/index.html');
});

// Return info
app.get('/information', function (req, res) {
    res.sendFile(process.cwd() + '/client/info.html');
});

// Anytime a player has connected, this is called.
io.on('connection', function (socket) {
    // Log that a player has connected
    console.log(`Connected: User with socket ID (${socket.id})`);
    
    players[socket.id] = {
        name: "",
        rotation: 0,
        playerId: socket.id,
        colour: colours[0].testMode(),
        x: 0,
        y: 800,
        direction: "idle",
        team: (Math.random() > 0.5) ? 'red' : 'blue'
    };

    socket.on('initializeSocketConnection', function(userName) {
        players[socket.id].name = userName;

        // Send all player data to the new player
        socket.emit('currentPlayers', players);

        // Update all other players of the new player
        socket.broadcast.emit('newPlayer', socket.id, players[socket.id]);
    });

    socket.on('disconnect', function () {
        // Log that a player has disconnected
        console.log(`Disconnected: User with socket ID (${socket.id}).`);
        // Remove this player from our players object
        delete players[socket.id]
        // Emit a message to all other player sockets to remove this player
        io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerMovement', function (movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].direction = movementData.direction;

        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });

    socket.on('chatUpdate', function(message, playerId) {
        io.emit('chatUpdate', message, players[playerId].colour, players[playerId].name);
    });
    
});

server.listen(process.env.PORT || 8080, function () {
    console.log(`Game server active and Listening on ${server.address().port}`);
});