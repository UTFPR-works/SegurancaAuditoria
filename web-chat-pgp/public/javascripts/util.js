let privateKey;
let publicKey;
let user;

function getPrivateKey() {
	return privateKey;
}

function setPrivateKey(privateKey) {
	this.privateKey = privateKey;
}

function getPublicKey() {
	return publicKey;
}

function setPublicKey(publicKey) {
	this.publicKey = publicKey;
}

function getUser() {
	return user;
}

function setUser(user) {
	this.user = user;
}

module.exports = {
	privateKey,
	publicKey,
	user,
}



