const bcrypt = require("bcryptjs");
const knex = require("knex");
const db = require("../database/dbConfig.js");

const { authenticate, getToken } = require("./middewares");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/userInfo", getUserInfo);
  server.post("/api/verify", authenticate, verify);
  server.post("/api/subs/create", createSubreddit);
};

// U S E R    D A T A B A S E

// register a new user
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

// login with existing account
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

// test function, not currently in use
function verify(req, res) {
  res.status(201).json({ verified: true });
}

// gets user object from db, is used to store user in state
function getUserInfo(req, res) {
  const id = req.body;

  db("users")
    .where(id, id)
    .then(stuff => {
      res.status(201).json(stuff);
    });
}

// S U B R E D D I T       D A T A B A S E

function createSubreddit(req, res) {
  const creds = req.body;

  db("subreddits")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res.status(500).json(err);
    });
}
