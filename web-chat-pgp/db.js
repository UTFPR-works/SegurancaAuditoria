const bcrypt = require('bcrypt')

function createUser(username, password, email, callback) {
	const cryptPwd = bcrypt.hashSync(password, 10)
	global.db.collection('users').insert({ username, password: cryptPwd, email }, function (err, result) {
		callback(err, result)
	})
}

function findUser(email, callback) {
	global.db.collection('users').findOne({ email }, callback);
}

function savePublicKey(email, publicKey, callback) {
	global.db.collection('publicKeys').insert({ email, publicKey }, function (err, result) {
		callback(err, result);
	})
}

function findPublicKey(email, callback) {
	global.db.collection('publicKeys').findOne({ email }, function(err, result) {
		callback(err, result);
	});
}

module.exports = { createUser, savePublicKey, findPublicKey }