const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const node_modules = path.join(__dirname, '../node_modules');
var port = process.env.PORT || 3000;

const { messageGenerator, locationMessageGenerator } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

//event listener
io.on('connection', (socket) => {
    console.log(`--- New user connected ---`);

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room is required!');
        }

        //join room
        let userInChat = users.getUserByName(params.name);
        
        //adds only unique users
        if(!userInChat) {
            socket.join(params.room);
            users.removeUser(socket.id); //remove user form others room
            users.addUser({ //add user to a room
                id: socket.id,
                name: params.name,
                room: params.room
            });
            io.to(params.room).emit('updateUserList', users.getAllUsers(params.room));

            socket.broadcast.to(params.room).emit('newMessage', messageGenerator('Admin', `${params.name} joined chat!`));
        }
        socket.emit('newMessage', messageGenerator('Admin', 'Welcome to the chat!'));

        //leave room
        // socket.leave(params.room);

        //io.emit - emit to everyone, 
        //io.to(room.name).emit - send to all in room
        //socket.broadcast.emit - to everyone except for current user
        //socket.broadcast.to(room.name).emit() - send to all except for the sender
        //socket.emit - to one user

        //emit event to all but this socket
        //socket.broadcast.emit('newMessage', messageGenerator('Admin', 'New user joined chat!'));

        callback();
    });

    socket.on('createMessage', (msg, callback) => {
        var user = users.getUser(socket.id);

        if (user && isRealString(msg.text)) {
            io.to(user.room).emit('newMessage', messageGenerator(user.name, msg.text))
        }

        callback();
    });

    socket.on('location', (coords) => {
        var user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', locationMessageGenerator(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getAllUsers(user.room))
            io.to(user.room).emit('newMessage', messageGenerator('Admin', `${user.name} has left chat!`))
        }
    });
});

app.use(express.static(publicPath));
app.use(express.static(node_modules));

//listen invokes http.createServer, instead of express server we use http server
server.listen(port, () => console.log(`Server is running on port ${port}`));
