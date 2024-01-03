const Todos = require("../model/todo-model");

const router = require("express").Router();

router.get("/", (_req, res) => {
  Todos.find({})
    .then((docs) => {
      console.log(docs);
      res.json(docs);
    })
    .catch((err) => console.log(err));
});

router.post("", (req, res) => {
  const list = req.body.todo;

  if (!list) {
    res.json({
      msg: `need todo in req body to create new todo.`,
    });
  }
  if (Array.isArray(list)) {
    const todos = list.map((item) => ({ todo: item }));

    Todos.insertMany(todos)
      .then((docs) => {
        res.send(docs);
        console.log(docs);
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error");
        console.error(err);
      });
  } else {
    let todos = new Todos({ todo: req.body.todo });
    todos
      .save()
      .then((doc) => {
        res.send(doc);
        console.log(doc);
      })
      .catch((err) => console.log(err));
  }
});

router.delete("/all", (_req, res) => {
  Todos.deleteMany({}).then((docs) => {
    res.json({ info: docs, msg: `all todos deleted` });
  });
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
    res.json({ msg: `${cId} is Not Number, delete failed` });
  }

  Todos.splice(cId - 1, 1);
  // res.json({ todos: todos, msg: `todo at ${cId} deleted` });
});

module.exports = router;
