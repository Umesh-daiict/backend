if (process.env.NODE_ENV !== 'PROD') {
	require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./app/models/user-model');
const { docWithoutPwdhash, handleError } = require('./app/middleware/utils');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	console.log('log==------------------>>', req.url, req.body);
	next();
});

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log('mongodb connected!');
	})
	.catch((err) => {
		console.log('could not connect be mongodb because of error : ', err);
	});

app.get('/', (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	console.log('req------------------>>>>>', page, limit);
	UserModel.find({}, { password: 0 })
		.skip((page - 1) * limit)
		.limit(limit)
		.then((doc) => {
			res.json({ data: doc, msg: 'users' });
		})
		.catch((err) => handleError(res, err));
});

app.post('/', (req, res) => {
	const user = req.body.user;
	if (!user.username || !user.password) {
		res.json({
			msg: `need user name and password`,
		});
	}

	const newUser = new UserModel(req.body.user);
	newUser
		.save()
		.then((doc) => {
			res.json({ user: docWithoutPwdhash(doc) });
		})
		.catch((err) => handleError(res, err));
});

app.post('/login', (req, res) => {
	const user = req.body.user;
	if (!user.username || !user.password) {
		res.json({
			msg: `need user name and password`,
		});
	}
});


app.delete('/all', (req, res) => {});

app.patch('/:id', (req, res) => {});

app.delete('/:id', (req, res) => {});

const CurrentPort = process.env.PORT || 3000;
app.listen(CurrentPort, () =>
	console.log(`server is running on port ${CurrentPort}`)
);
