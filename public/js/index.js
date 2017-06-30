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
    var formattedTime = moment(msg.createdAt).format('H:mm');

    message.text(`${msg.from} ${formattedTime}: ${msg.text}`)
    messageBox.append(message);
});

socket.on('newLocationMessage', function(msg) {
    var message = $('<li/>');
    var link = $('<a target="_blank">&nbsp;My current location</a>');
    var messageBox = $('#message-box');
    var formattedTime = moment(msg.createdAt).format('H:mm');

    message.text(`${msg.from} ${formattedTime}:`)
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
        input.val('');
        // console.log(data);
    });
});

//geolocation
var locationBtn = $('#send-location');
var geolocation = navigator.geolocation;

locationBtn.on('click', function() {
    if (!geolocation) {
        return alert('Geolocation not supported by your browser!');
    } 
    
    //disable btn
    locationBtn.prop('disabled', true).text('Sending location...');

    //require https to work, may be block by a browser
    geolocation.getCurrentPosition(function(pos) {
        console.log(pos);
        socket.emit('location', {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
        });
        locationBtn.prop('disabled', false).text('Send location');
    }, function() { //error handler
        locationBtn.prop('disabled', false).text('Send location');
        alert('Unable to fetch location!');
    });
});