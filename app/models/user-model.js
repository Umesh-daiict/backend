const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const users = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});
// store multi img and compress it
users.pre('save', async function (next) {
	const user = this;
	if (!user.isModified('password')) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(user.password, salt);

		user.password = hashedPassword;
		next();
	} catch (err) {
		return next(err);
	}
});

users.methods.comparePassword = async function (enteredPassword) {
	try {
		return await bcrypt.compare(enteredPassword, this.password);
	} catch (err) {
		throw err;
	}
};

module.exports = mongoose.model('users', users);
