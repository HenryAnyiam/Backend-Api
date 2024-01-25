const Parish = require("../models/Parish");
const Role = require("../models/Role");
const Deanery = require("../models/Deanery");

exports.getParishes = (req, res, next) => {
  Parish.findAll({
    attributes: [
      'Id',
      'Name',
      'Email',
      ],
    include: [
      {
      model: Deanery,
      attributes: ['Name'],
      as: 'Deanery'
    }]
  })
    .then((parishes) => {
      res.status(200).json(parishes);
    })
    .catch((err) => res.status(400).json({ msg: "failed", error: err }));
};


exports.createParish = (req, res, next) => {
  console.log(req.body, "see");
  const { Name, MeetingDay, Time, Email, RoleId, DeaneryId} =
  req?.body;
  if (
    Email &&
    Name && RoleId &&
    DeaneryId
    )
    Role.findOne({
      where: {
        Id: RoleId
      }
    })
      .then((roleExists) => {
        if (roleExists && roleExists.Name !== "Member") {
          Parish.findOne({
              where: {
                  Email,
              },
          })
            .then((emailExists) => {
                if (emailExists) {
                    res.status(400).json({ msg: "Email already exists" });
                  } else {
                    Parish.create({
                        Name,
                        MeetingDay,
                        Time,
                        Email,
                        DeaneryId
                    })
                      .then((parish) => {
                        Parish.findOne({
                          where: {
                            Id: parish.Id
                          },
                          attributes: [
                            'Id',
                            'Name',
                            'Email',
                            ],
                          include: [
                            {
                            model: Deanery,
                            attributes: ['Name'],
                            as: 'Deanery'
                          }]
                        })
                          .then((newParish) => {
                            res.status(200).json({newParish});
                          })
                          .catch((err) => {
                            res.status(400).json({ msg: err.message});
                          })
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


exports.getUsers = (req, res, next) => {
  Parish.findOne({
    where: {
      Id: req.params.parishId
    }
  })
    .then((parish) => {
    parish.getUsers({
      attributes: [
        'Id',
        'FirstName',
        'LastName',
        'PhoneNumber',
        ],
    })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => res.status(400).json({ msg: "failed", error: err }));
  })
  .catch((err) => res.status(400).json({ msg: "failed", error: err }));
}
