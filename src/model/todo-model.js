const mongoose = require("mongoose");

const todos = new mongoose.Schema({
  todo: String,
});
const Todos = mongoose.model("todos", todos);
module.exports = Todos;
