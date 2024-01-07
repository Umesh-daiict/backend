const docWithoutPwdhash = (doc) => {
	delete doc.password;
	return doc;
};
const handleError = (res, err) => {
	res.status(405).json({ error: err });
	console.log(err);
};

const checkUserRole = (requiredRole) => (req, res, next) => {
	if (req.user && req.user.role === requiredRole) {
		return next();
	} else {
		return res.status(403).json({ message: 'Unauthorized' });
	}
};

module.exports = { docWithoutPwdhash, handleError, checkUserRole };
