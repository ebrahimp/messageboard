const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { loginValidation } = require('../helpers/loginValidation');
require('dotenv').config();

const login = async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	const user = await User.findOne({ email: req.body.email });
	console.log(user);
	if (!user) return res.status(400).json({ message: 'Email or password is incorrect' });

	const validPassword = await bcrypt.compare(req.body.password, user.hashedPassword);
	if (!validPassword) return res.status(400).json({ message: 'Email or password is incorrect' });

	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
	res.cookie('mbt', token, { expire: '7d' });
	const { _id, name, email } = user;
	res.json({ token, user: { _id, name, email } });
};

const logout = (req, res) => {
	res.clearCookie('mbt');
	return res.json({ message: 'Successfully Logged Out' });
};

const loginRequired = expressJwt({
	secret: process.env.TOKEN_SECRET,
	userProperty: 'auth'
});

module.exports = { login, logout, loginRequired };
