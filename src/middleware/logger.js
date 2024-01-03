let count = 0;
const cookieLogger = (req, _res, next) => {
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
};

const portLogger = () =>
  console.log(`server is running on port ${process.env.PORT || 3000}`);

module.exports = { cookieLogger, portLogger };
