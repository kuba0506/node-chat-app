const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;

const { messageGenerator } = require('./utils/message');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

//event listener
io.on('connection', (socket) => {
    console.log(`--- New user connected ---`);

    socket.emit('connected', messageGenerator('Admin', 'Welcome to the chat!'));
    //emit event to all but this socket
    socket.broadcast.emit('connected', messageGenerator('Admin', 'New user joined chat!'));

    socket.on('createMessage', (msg) => {
        console.log('New message from user: ', msg);

        //emit event to all sockets
        io.emit('newMessage', messageGenerator(msg.from, msg.text))
    });

    socket.on('disconnect', (socket) => {
        console.log(`User was disconnected!`);
    });
});

app.use(express.static(publicPath));

//listen invokes http.createServer, instead of express server we use http server
server.listen(port, () => console.log(`Server is running on port ${port}`));
