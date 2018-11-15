const express = require('express');
const openpgp = require('./lib/openpgp.js');
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

	let keyOptions = {
		userIds: [{ name: "Bob", email: "bob@lemon.email" }],
		numBits: 2048,
		passphrase: "bob-passphrase"
	};

	let bob = {},
		john = {},
		message = "",
		email = 'hello world';

	openpgp.generateKey(keyOptions)
		.then((key) => {
			bob.privateKey = key.privateKeyArmored;
			bob.publicKey = key.publicKeyArmored;
			console.log("Bob's keys generated");
			return Promise.resolve();
		})

	setTimeout(() => {
		const options = {
			data: JSON.stringify(email),
			publicKeys: openpgp.key.readArmored(bob.publicKey).keys
		};
		console.log("Plain text message :" + options.data);

		openpgp.encrypt(options)
			.then((cipherText) => {
				message = cipherText.data;
				console.log("Encrypted message :" + message);
				return Promise.resolve();
			})
	}, 200);

	setTimeout(() => {
		let privateKey = openpgp.key.readArmored(bob.privateKey).keys[0];

		if (privateKey.decrypt("bob-passphrase")) {
			openpgp.decrypt({
				privateKey: privateKey,
				message: openpgp.message.readArmored(message)
			})
				.then((decryptedData) => {
					console.log("Decrypted message : " + decryptedData.data);
					console.log(JSON.parse(decryptedData.data));
				})
				.catch((err) => {
					console.error(err);
				})
		}
	}, 400);


	socket.on('change_username', (data) => {
		socket.username = data.username;
	});

	socket.on('new_message', (data) => {
		io.sockets.emit('new_message', { message: data.message, username: socket.username });
	});
});