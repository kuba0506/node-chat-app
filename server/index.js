const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

//event listener
io.on('connection', (socket) => {
    console.log(`--- New user connected ---`);

    socket.on('createMessage', (msg) => {
        console.log('New message from user: ', msg);

        socket.emit('newMessage', {
            from: msg.from,
            text: msg.text,
            createdAt: +new Date()
        });
    });

    socket.on('disconnect', (socket) => {
        console.log(`User was disconnected!`);
    });
});

app.use(express.static(publicPath));

//listen invokes http.createServer, instead of express server we use http server
server.listen(port, () => console.log(`Server is running on port ${port}`));
