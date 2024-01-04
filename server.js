if (process.env.NODE_ENV !== "PROD") {
  require("dotenv").config();
  //add date to acd and dec
}
const express = require("express");
const todoRouter = require("./src/routes/todos");
const authRouter = require("./src/routes/auth");
const { cookieLogger, portLogger } = require("./src/middleware/logger");

const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const session = require("express-session");
const passport = require("passport");
const { authCheck } = require("./src/middleware/authChecker");
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize()); // init password on every route call
app.use(passport.session()); // allow passport to use "express session"

app.use(cookieLogger);
// Create Instance of MongoClient for mongodb
const client = new MongoClient("mongodb://localhost:27017");

// Connect to database
client
  .connect()
  .then(() => {
    console.log("Connected Successfully");
    mongoose.connect("mongodb://localhost:27017/todos");
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
  })
  .catch((error) => console.log("Failed to connect", error));

app.use("/auth", authRouter);
app.use(
  "/todos",
  // authCheck,
  todoRouter
);

app.listen(process.env.PORT || 3000, portLogger);
