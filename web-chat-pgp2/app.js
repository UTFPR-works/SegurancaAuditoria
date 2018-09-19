const express = require('express');
const app = express();

app.set('view-engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('index.ejs');
});

server = app.listen(3003);

const io = require('socket.io')(server);
io.on('connection', (socket) => {
	console.log('user in');

	socket.username = 'Anonymous';

	socket.on('change_username', (data) => {
		socket.username = data.username;
	});

	socket.on('new_message', (data) => {
		io.sockets.emit('new_message', { message: data.message, username: socket.username });
	});
});