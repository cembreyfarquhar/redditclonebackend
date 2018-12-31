const jwt = require("jsonwebtoken");

const jwtKey = require("../secrets/keys").jwtKey;

module.exports = {
  authenticate,
  getToken
};

function authenticate(req, res, next) {
  const token = req.body.token;

  if (token) {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) return res.status(401).json(err);

      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(401).json({
      error: "No token provided, must be set on the Authorization header"
    });
  }
}

function getToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };

  const secret = jwtKey;
  const options = {
    expiresIn: "30m"
  };

  return jwt.sign(payload, secret, options);
}
