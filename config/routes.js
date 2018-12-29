const bcrypt = require("bcryptjs");
const knex = require("knex");
const db = require("../database/dbConfig.js");

module.exports = server => {
  server.post("/api/register", register);
  server.get("/api/userInfo", getUserInfo);
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

function getUserInfo(req, res) {
  const id = req.body;

  db("users")
    .where(id, id)
    .then(stuff => {
      res.status(201).json(stuff);
    });
}
