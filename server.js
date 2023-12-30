if (process.env.NODE_ENV !== 'PROD') {
	require('dotenv').config();
}
const express = require('express');
const app = express();
app.use(express.json());
const todos = ['hii'];

app.get('/', (req, res) => {
	res.json({
		todos,
	});
});

app.post('/', (req, res) => {
	todos.push(req.body.todo);
	res.json({ todos });
});

const CurrentPort = process.env.PORT || 3000;
app.listen(CurrentPort, () =>
	console.log(`server is running on port ${CurrentPort}`)
);
