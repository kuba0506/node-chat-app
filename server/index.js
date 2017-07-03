const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const node_modules = path.join(__dirname, '../node_modules');
var port = process.env.PORT || 3000;

const { messageGenerator, locationMessageGenerator } = require('./utils/message');
const { isRealString } = require('./utils/validation');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

//event listener
io.on('connection', (socket) => {
    console.log(`--- New user connected ---`);

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and room is required!');
        }

        //join room
        socket.join(params.room);

        //leave room
        // socket.leave(params.room);

        //io.emit - emit to everyone, 
        //io.to(room.name).emit - send to all in room
        //socket.broadcast.emit - to everyone except for current user
        //socket.broadcast.to(room.name).emit() - send to all except for the sender
        //socket.emit - to one user

        socket.emit('newMessage', messageGenerator('Admin', 'Welcome to the chat!'));
        socket.broadcast.to(params.room).emit('newMessage', messageGenerator('Admin', `${params.name} joined chat!`));
        //emit event to all but this socket
        //socket.broadcast.emit('newMessage', messageGenerator('Admin', 'New user joined chat!'));

        callback();
    });

    socket.on('createMessage', (msg, callback) => {
        console.log('New message from user: ', msg);

        //emit event to all sockets
        io.emit('newMessage', messageGenerator(msg.from, msg.text))
        //emit to all socket but this one
        // socket.broadcast.emit('newMessage', messageGenerator(msg.from, msg.text))

        //callback('You sent: '+  msg.text); //send event to the client
        callback();
    });

    socket.on('location', (coords) => {
        // io.emit('newMessage', messageGenerator('Admin', `${coords.latitude}, ${coords.longitude}`));
        io.emit('newLocationMessage', locationMessageGenerator('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', (socket) => {
        console.log(`User was disconnected!`);
    });
});

app.use(express.static(publicPath));
app.use(express.static(node_modules));

//listen invokes http.createServer, instead of express server we use http server
server.listen(port, () => console.log(`Server is running on port ${port}`));
