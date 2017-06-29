const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const node_modules = path.join(__dirname, '../node_modules');
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

    socket.on('createMessage', (msg, callback) => {
        console.log('New message from user: ', msg);

        //emit event to all sockets
        // io.emit('newMessage', messageGenerator(msg.from, msg.text))
        //emit to all socket but this one
        socket.broadcast.emit('newMessage', messageGenerator(msg.from, msg.text))

        callback('You sent: '+  msg.text); //send event to the client
    });

    socket.on('disconnect', (socket) => {
        console.log(`User was disconnected!`);
    });
});

app.use(express.static(publicPath));
app.use(express.static(node_modules));

//listen invokes http.createServer, instead of express server we use http server
server.listen(port, () => console.log(`Server is running on port ${port}`));
