const bcrypt = require("bcryptjs");
const knex = require("knex");
const db = require("../database/dbConfig.js");

const { authenticate, getToken } = require("./middewares");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/userInfo", getUserInfo);
  server.post("/api/verify", authenticate, verify);
};

function register(req, res) {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 10);

  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

function login(req, res) {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // res.status(201).json({ token: getToken(user) });
        res.status(201).json({ token: getToken(user) });
      } else {
        res.status(401).json({ message: "Login failed" });
      }
    });
}

function verify(req, res) {
  res.status(201).json({ verified: true });
}

function getUserInfo(req, res) {
  const id = req.body;

  db("users")
    .where(id, id)
    .then(stuff => {
      res.status(201).json(stuff);
    });
}
