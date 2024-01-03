// auth.js

const express = require("express");
const passport = require("passport");
const { authCheck } = require("../middleware/authChecker");
const LocalStrategy = require("passport-local").Strategy;

const router = express.Router();

const USER = [
  { id: 1, username: "admin", password: "password" },
  { id: 2, username: "test", password: "test" },
];

const authUser = (user, password, done) => {
  const authenticated_user = USER.find(
    (users) => users.username === user && users.password === password
  );

  if (!authenticated_user) {
    return done(null, false, { message: "user not found!" });
  }

  return done(null, authenticated_user);
};

passport.use(new LocalStrategy(authUser));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed", info: info });
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      return res.json({ message: "Authentication successful", user });
    });
  })(req, res, next);
});

router.use(authCheck);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    res.json({ message: "log out!" });
  });
});

module.exports = router;
