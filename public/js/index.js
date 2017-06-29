var socket = io(); //creates a connection, upgrade from http -> websocket (fallback - polling)

socket.on('connect', function () {
    console.log(`Connected to server!`);
});

socket.on('disconnect', function () {
    console.log(`Disconnected from server!`);
});

socket.on('newMessage', function (msg) {
    var message = $('<li/>');
    var messageBox = $('#message-box');

    message.text(`${msg.from}: ${msg.text}`)
    messageBox.append(message);
});

socket.on('newLocationMessage', function(msg) {
    var message = $('<li/>');
    var link = $('<a target="_blank">&nbsp;My current location</a>');
    var messageBox = $('#message-box');

    message.text(`${msg.from}:`)
    link.attr('href', msg.url);
    message.append(link);
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

//geolocation
var locationBtn = $('#send-location');
var geolocation = navigator.geolocation;

locationBtn.on('click', function() {
    if (!geolocation) {
        return alert('Geolocation not supported by your browser!');
    } 
    
    //require https to work, may be block by a browser
    geolocation.getCurrentPosition(function(pos) {
        console.log(pos);
        socket.emit('location', {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
        });
    }, function() { //error handler
        alert('Unable to fetch location!');
    });
});