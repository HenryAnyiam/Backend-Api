const Role = require("../models/Role");


exports.getRoles = (req, res, next) => {
  Role.findAll()
    .then((role) => {
      res.json(role);
    })
    .catch((err) => res.json({ msg: "failed", error: err }));
};


exports.createRole = (req, res, next) => {
  console.log(req.body, "see");
  const { Name, Description } =
  req?.body;
  if ( Name ) {
    Role.findOne({
        where: {
            Name,
        },
    })
    .then((nameExists) => {
        if (nameExists) {
            res.status(400).json({ msg: "Role already exists" });
          } else {
            Role.create({
                Name,
                Description,
            })
              .then((role) => {
                res.status(200).json({role})
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


exports.getRoleID = () => {
  Role.findAll()
      .then((role) => {
        const roleid = [];
        role.every(roles => {
          if (roles.dataValues.Name !== "Member") {
            roleid.push(roles.dataValues.Id)
          }
        });
        return roleid;
      })
      .catch((err) => { 
        console.log("Error", err)
        return err;
      })
}