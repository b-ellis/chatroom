$(document).ready(function() {
    var socket = io();
    var input = $('#userInput');
    var messages = $('#messages');
    var userName = $('usernameInput');
    
    var addUser = function(name) {
        $('#users').append('<div>' + name + '</div>');
    };
    
    $('#join').on('click', function(event) {
        event.preventDefault();
        var name = userName.val();
        
        if (name != '') {
            console.log(name);
            socket.emit('join', name);
            $('#loginPage').hide();
            $('#mainPage').show();
            addUser(name);
        }
    });
    
    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };

    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        
        var message = input.val();
        addMessage(message);
        socket.emit('message', message);
        input.val('');
    });
    
    socket.on('message', addMessage);
    socket.on('join', addUser);
});