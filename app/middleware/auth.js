const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const generateToken = (payload) => {
	const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
	return token;
};

const verifyToken = (requiredRole) => (req, res, next) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}

	jwt.verify(token, secretKey, (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: 'Invalid token' });
		}

		req.userId = decoded.userId;

		if (decoded.role !== requiredRole) {
			return res.status(403).json({
				message:
					'You do not have the authorization and permissions to access this resource.',
			});
		}

		next();
	});
};

module.exports = { generateToken, verifyToken };
