const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve all files from the project folder
app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', { username: msg.username, text: msg.text, id: msg.id });
    });

    socket.on('user disconnect', (username) => {
        io.emit('user disconnect', username);
    });

    socket.on('user connect', (username) => {
        io.emit('user connect', username);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
