var socket = io(); //creates a connection, upgrade from http -> websocket (fallback - polling)

//chat scrolling
var scrollToBottom = function scrollToBottom() {
    //selectors
    var messages = $('#message-box');
    var newMessage = messages.children('li:last-child');
    //heights
    var clientHeight = messages.prop('clientHeight');//DOM prop
    var scrollTop = messages.prop('scrollTop');//DOM prop
    var scrollHeight = messages.prop('scrollHeight');//DOM prop
    var newMessageHeight = newMessage.innerHeight(); //takes into account padding
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop  + newMessageHeight + lastMessageHeight >= scrollHeight) {
      messages.scrollTop(scrollHeight);  
    }
};


socket.on('connect', function () {
    console.log(`Connected to server!`);
});

socket.on('disconnect', function () {
    console.log(`Disconnected from server!`);
});

socket.on('newMessage', function (msg) {
    var formattedTime = moment(msg.createdAt).format('H:mm');
    var tmpl = $('#message-template').html();
    var html = Mustache.render(tmpl, {
        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    });
    
    $('#message-box').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(msg) {
    var formattedTime = moment(msg.createdAt).format('H:mm');
    var tmpl = $('#location-message-template').html();
    var html = Mustache.render(tmpl, {
        url: msg.url,
        from: msg.from,
        createdAt: formattedTime
    });

    $('#message-box').append(html);
    scrollToBottom();
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