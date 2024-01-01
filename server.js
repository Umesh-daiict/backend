if (process.env.NODE_ENV !== "PROD") {
  require("dotenv").config();
}
const express = require("express");
const todoRouter = require("./src/routes/todos");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  console.log("log==------------------>>", req.url, req.body);
  next();
});

app.use("/todos", todoRouter);
const CurrentPort = process.env.PORT || 3000;
app.listen(CurrentPort, () =>
  console.log(`server is running on port ${CurrentPort}`)
);
