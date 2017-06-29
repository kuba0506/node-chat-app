var socket = io(); //creates a connection, upgrade from http -> websocket (fallback - polling)

socket.on('connect', function () {
    console.log(`Connected to server!`);
});

socket.on('disconnect', function () {
    console.log(`Disconnected from server!`);
});

socket.on('newMessage', function (msg) {
    console.log('New message: ', msg);
    var message = $('<li/>');
    var messageBox = $('#message-box');

    message.text(`${msg.from}: ${msg.text}`)
    messageBox.append(message);
});

socket.on('connected', function (data) {
    console.log(data);
});

//form
$('#chat-form').on('submit', function(e) {
    e.preventDefault();
    var input = $('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: input.val()
    }, function(data) {
        console.log(data);
    });

    input.val('');
});