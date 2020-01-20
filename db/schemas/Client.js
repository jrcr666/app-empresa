const mongoose = require('mongoose');

var clientSchema = new mongoose.Schema({
	address: String,
	city: String,
	email: String,
	lastName: String,
	name: String,
	phoneNumber: String,
	state: String,
	zipCode: String
});

module.exports = mongoose.model('Client', clientSchema);