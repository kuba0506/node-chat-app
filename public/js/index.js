var socket = io(); //creates a connection, upgrade from http -> websocket (fallback - polling)

socket.on('connect', function () {
    console.log(`Connected to server!`);

    // socket.emit('createMessage', {
    //     from: 'Kuba',
    //     text: 'lorem ipsum from client'
    // })
});

socket.on('disconnect', function () {
    console.log(`Disconnected from server!`);
});

socket.on('newMessage', function(msg) {
    console.log('New message: ', msg);
});

socket.on('connected', function(data) {
    console.log(data);
});