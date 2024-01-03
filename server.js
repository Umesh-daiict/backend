if (process.env.NODE_ENV !== 'PROD') {
	require('dotenv').config();
}
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	console.log('log==------------------>>', req.url, req.body);
	next();
});

const todos = [];

app.get('/', (req, res) => {
	res.json({
		todos,
	});
});

app.post('/', (req, res) => {
	const list = req.body.todo;
	if (!list) {
		res.json({
			todos: todos,
			msg: `need todo in req body to create new todo.`,
		});
	}
	if (Array.isArray(list)) {
		todos.push(...req.body.todo);
	} else {
		todos.push(req.body.todo);
	}
	res.json({ todos });
});

app.delete('/all', (req, res) => {
	todos.splice(0);
	res.json({ todos: todos, msg: `all todos deleted` });
});

app.patch('/:id', (req, res) => {
	const id = req.params.id;
	if (isNaN(id)) {
		res.json({ todos: todos, msg: `${id} is not a number,not updated todos.` });
	}
	if (!req.body.todo) {
		res.json({ todos: todos, msg: `send todo to update at ${id} index` });
	}
	todos[id - 1] = req.body.todo;
	res.json({ todos: todos, msg: `todos updated at ${id} index` });
});

app.delete('/:id', (req, res) => {
	const cId = req.params.id;
	if (isNaN(req.params.id)) {
		res.json({ todos: todos, msg: `${cId} is Not Number, delete failed` });
	}

	todos.splice(cId - 1, 1);
	res.json({ todos: todos, msg: `todo at ${cId} deleted` });
});

const CurrentPort = process.env.PORT || 3000;
app.listen(CurrentPort, () =>
	console.log(`server is running on port ${CurrentPort}`)
);
