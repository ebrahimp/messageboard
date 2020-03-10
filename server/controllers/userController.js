const User = require('../models/user');

exports.getUserById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				mesage: 'User not found'
			});
		}

		req.profile = user;
		next();
	});
};

exports.hasAuthorization = (req, res, next) => {
	const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
	if (!authorized) {
		return res.status(403).json({
			message: 'User not authorised'
		});
	}
};
