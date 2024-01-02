if (process.env.NODE_ENV !== "PROD") {
  require("dotenv").config();
}
const express = require("express");
const todoRouter = require("./src/routes/todos");
const authRouter = require("./src/routes/auth");
const { cookieLogger, portLogger } = require("./src/middleware/logger");

const session = require("express-session");
const passport = require("passport");
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize()); // init password on every route call
app.use(passport.session()); // allow passport to use "express session"

app.use(cookieLogger);

app.use("/auth", authRouter);
app.use("/todos", todoRouter);

app.listen(process.env.PORT || 3000, portLogger);
