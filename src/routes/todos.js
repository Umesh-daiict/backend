const router = require("express").Router();
const todos = [];

router.get("/", (req, res) => {
  res.json({
    todos,
    user: req.user,
  });
});

router.post("", (req, res) => {
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

router.delete("/all", (req, res) => {
  todos.splice(0);
  res.json({ todos: todos, msg: `all todos deleted` });
});

router.patch("/:id", (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  if (isNaN(id)) {
    // console.log("non num", id);
    res.json({ todos: todos, msg: `${id} is not a number,not updated todos.` });
  }
  if (!req.body.todo) {
    // console.log("non body", id);
    res.json({ todos: todos, msg: `send todo to update at ${id} index` });
  }
//   console.log("non body", id);
  todos[id - 1] = req.body.todo;
  res.json({ todos: todos, msg: `todos updated at ${id} index` });
});

router.delete("/:id", (req, res) => {
  const cId = req.params.id;
  console.log(req.params.id);
  if (isNaN(req.params.id)) {
    res.json({ todos: todos, msg: `${cId} is Not Number, delete failed` });
  }

  todos.splice(cId - 1, 1);
  res.json({ todos: todos, msg: `todo at ${cId} deleted` });
});

module.exports = router;
