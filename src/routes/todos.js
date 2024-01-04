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

router.post("/", (req, res) => {
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

  if (!req.body.todo) {
    Todos.find({}).then((todos) => {
      res.json({ todos: todos, msg: `send todo to update at ${id} index` });
    });
  } else {
    Todos.updateOne({ _id: id }, { $set: { todo: req.body.todo } })
      .then((info) => {
        if (info.modifiedCount > 0) {
          Todos.find({}).then((doc) => {
            res.json({ todos: doc, msg: `todos updated at ${id} index`, info });
          });
        } else {
          Todos.find({}).then((doc) => {
            res.status(403).json({
              todos: doc,
              msg: `No document faunde for given index`,
              info,
            });
          });
        }
      })
      .catch((err) => {
        Todos.find({}).then((doc) => {
          res
            .status(403)
            .json({ todos: doc, msg: `failed to update at ${id}`, err });
        });
      });
  }
});

router.delete("/:id", (req, res) => {
  const cId = req.params.id;
  Todos.deleteOne({ _id: cId })
    .then((info) => {
      res.json({ info: info, msg: ` deleted at ${cId}` });
    })
    .catch((err) => {
      res.status(403).json({ msg: `failed to delete at ${cId}`, err });
    });
});

module.exports = router;
