const docWithoutPwdhash = (doc) => {
	delete doc.password;
	return doc;
};
const handleError = (res, err) => {
	res.status(405).json({ error: err });
	console.log(err);
};

module.exports = { docWithoutPwdhash, handleError };
