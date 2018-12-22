const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig.js");

module.exports = server => {
  server.post("/api/register", register);
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
    .catch(err => json(err));
}
