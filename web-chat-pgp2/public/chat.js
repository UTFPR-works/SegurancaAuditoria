$(function () {
	var socket = io.connect('http://localhost:3003');

	var message = $('#message');
	var username = $('#username');
	var send_message = $('#send_message');
	var send_username = $('#send_username');
	var chatroom = $('#chatroom');

	send_username.click(function () {
		console.log(username.val());
		socket.emit('change_username', { username: username.val() });
	})

	send_message.click(function () {
		socket.emit('new_message', { message: message.val() });
		message.val('');
	});

	socket.on('new_message', (data) => {
		console.log(data);
		chatroom.append('<p class="message">' + data.username + ': ' + data.message + '</p>');
	});

	socket.on('privkey', (data) => {
		console.log(data.privkey);
	})

});
