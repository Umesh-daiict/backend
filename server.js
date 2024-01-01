if (process.env.NODE_ENV !== "PROD") {
  require("dotenv").config();
}
const express = require("express");
const todoRouter = require("./src/routes/todos");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize()); // init password on every route call
app.use(passport.session()); // allow passport to use "express session"

const USER = [
  { id: 1, username: "admin", password: "password" },
  { id: 2, username: "test", password: "test" },
];

authUser = (user, password, done) => {
  //   console.log(`Value of "User" in authUser function ----> ${user}`); //passport will populate, user = req.body.username
  //   console.log(`Value of "Password" in authUser function ----> ${password}`); //passport will popuplate, password = req.body.password

  // Use the "user" and "password" to search the DB and match user/password to authenticate the user
  // 1. If the user not found, done (null, false)
  // 2. If the password does not match, done (null, false)
  // 3. If user found and password match, done (null, user)
  const authenticated_user = USER.find(
    (users) => users.username === user && users.password === password
  );
  //   console.log("authenticated_user", authenticated_user);
  if (!authenticated_user) {
    return done(null, false, { message: "user not found!" });
  }
  //Let's assume that DB search that user found and password matched for Kyle

  return done(null, authenticated_user);
};
passport.use(new LocalStrategy(authUser));

passport.serializeUser((user, done) => {
  console.log(`--------> Serialize User`);
  console.log(user);

  done(null, user);

  // Passport will pass the authenticated_user to serializeUser as "user"
  // This is the USER object from the done() in auth function
  // Now attach using done (null, user.id) tie this user to the req.session.passport.user = {id: user.id},
  // so that it is tied to the session object
});

passport.deserializeUser((user, done) => {
  console.log(user);

  done(null, user);

  // This is the id that is saved in req.session.passport.{ user: "id"} during the serialization
  // use the id to find the user in the DB and get the user object with user details
  // pass the USER object in the done() of the de-serializer
  // this USER object is attached to the "req.user", and can be used anywhere in the App.
});
let count = 0;
app.use((req, _res, next) => {
  console.log("log==------------------>>", req.url, req.body);
  console.log("\n==============================");
  console.log(`------------>  ${count++}`);

  console.log(`req.body.username -------> ${req.body.username}`);
  console.log(`req.body.password -------> ${req.body.password}`);

  console.log(`\n req.session.passport -------> `);
  console.log(req.session.passport);

  console.log(`\n req.user -------> `);
  console.log(req.user);

  console.log("\n Session and Cookie");
  console.log(`req.session.id -------> ${req.session.id}`);
  console.log(`req.session.cookie -------> `);
  console.log(req.session.cookie);

  console.log("===========================================\n");
  next();
});
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log("err", err);
      return next(err);
    }

    if (!user) {
      // Authentication failed
      console.log("user", user);
      return res
        .status(401)
        .json({ message: "Authentication failed", info: info });
    }

    // Authentication successful
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.log("loginErr", loginErr);
        return next(loginErr);
      }

      // You can customize the success response message here
      return res.json({ message: "Authentication successful", user });
    });
  })(req, res, next);
});

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(202).json({ message: "not authed!" });
  }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    res.json({ message: "log out!" });
  });
});

app.use("/todos", todoRouter);
const CurrentPort = process.env.PORT || 3000;
app.listen(CurrentPort, () =>
  console.log(`server is running on port ${CurrentPort}`)
);
