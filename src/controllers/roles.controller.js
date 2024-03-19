const Role = require("../models/role.model");


exports.getRoles = (req, res, next) => {
  Role.findAll()
    .then((role) => {
      res.json(role);
    })
    .catch((err) => res.json({ msg: "failed", error: err }));
};


exports.createRole = (req, res, next) => {
  const { name, description } =
  req?.body;
  if ( name ) {
    Role.findOne({
        where: {
            name,
        },
    })
    .then((nameExists) => {
        if (nameExists) {
            res.status(400).json({ msg: "Role already exists" });
          } else {
            Role.create({
                name,
                description,
            })
              .then((role) => {
                res.status(200).json(role)
              })
              .catch((err) => {
                res.status(400).json({ msg: err.message || "Not created" })
              })
          }
    })
    .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(400).json({ msg: "Bad Request" });
  }
}
