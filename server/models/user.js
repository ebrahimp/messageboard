const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const { ObjectId } = mongoose.Schema;
const Post = require('./post');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 5,
		max: 255
	},
	email: {
		type: String,
		required: true,
		min: 5,
		max: 250
	},
	hashedPassword: {
		type: String,
		required: true,
		min: 6
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', userSchema);
