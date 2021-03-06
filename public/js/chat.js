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
    var params = $.deparam(window.location.search);

    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('You have successfully joined chat!');
        }
    });
});

socket.on('disconnect', function () {
    console.log(`Disconnected from server!`);
});

socket.on('updateUserList', function(users) {
    var list = $('#users');
    var ol = $('<ol/>');

    users.forEach(function(user) {
        ol.append($('<li/>').text(user));
    });
    //update user list
    list.html(ol);
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
});~

//form
$('#chat-form').on('submit', function(e) {
    e.preventDefault();
    var input = $('[name=message]');

    socket.emit('createMessage', {
        text: input.val()
    }, function(data) {
        input.val('');
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