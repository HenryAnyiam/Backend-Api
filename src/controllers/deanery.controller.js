const Deanery = require("../models/Deanery");
const Role = require("../models/Role");


exports.getDeaneries = (req, res, next) => {
  Deanery.findAll()
    .then((deaneries) => {
      res.status(200).json(deaneries);
    })
    .catch((err) => res.status(400).json({ msg: "failed", error: err }));
};

exports.createDeanery = (req, res, next) => {
  console.log(req.body, "see");
  const { Name, MeetingDay, Time, Email, RoleId} =
  req?.body;
  if (
    Email &&
    Name && RoleId
    )
    Role.findOne({
      where: {
        Id: RoleId
      }
    })
      .then((roleExists) => {
        if (roleExists && roleExists.Name !== "Member") {
          Deanery.findOne({
              where: {
                  Email,
              },
          })
            .then((emailExists) => {
                if (emailExists) {
                    res.status(400).json({ msg: "Email already exists" });
                  } else {
                    Deanery.create({
                        Name,
                        MeetingDay,
                        Time,
                        Email,
                    })
                      .then((deanery) => {
                        res.status(200).json({deanery})
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
              res.status(403).json({ msg: "Action Not Allowed" });
            }
          })
}
