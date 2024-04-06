const jwt = require('jsonwebtoken');

const AUTH_SECRET_KEY = process.env.Token;

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).send({message: "Please provide token!"});
    }
    jwt.verify(token, AUTH_SECRET_KEY, (err, decoded) => {
      if (!(err) && decoded) {
            const { id, roleId } = decoded;
            req.body.userId = id;
            req.body.roleId = roleId;
            next();
      } else {
        console.log(err);
        return res.status(401).send({message: "Unauthorized!"});
      }
    });
  } catch (e) {
    return res.status(500).send({message: "Authorization error!"});
  }
}

module.exports = verifyToken;
