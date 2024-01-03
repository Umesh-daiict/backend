const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("autheed ==>", req.user);
    next();
  } else {
    res.status(202).json({ message: "not authed!" });
  }
};
module.exports = { authCheck };
