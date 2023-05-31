const Role = require("../models/Role");

exports.getRoles = (req, res, next) => {
  Role.findAll()
    .then((role) => {
      res.json(role);
    })
    .catch((err) => res.json({ msg: "failed", error: err }));
};
