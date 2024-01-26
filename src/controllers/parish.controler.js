const Parish = require("../models/Parish");
const Role = require("../models/Role");
const jwt = require('jsonwebtoken');
const Deanery = require("../models/Deanery");

const AUTH_SECRET_KEY = process.env.Token;

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
  const { Name, MeetingDay, Time, Email, DeaneryId} =
  req?.body;
  let token = req.headers.token;
  let roleId = "0";
  if (
    Email &&
    Name && 
    DeaneryId
    ) {
      jwt.verify(token, AUTH_SECRET_KEY, (err, decoded) => {
        if (!(err) && decoded) {
          const { Id, RoleId } = decoded;
          if (RoleId  !== undefined) {
            roleId = RoleId;
          }
        }
      });
    Role.findOne({
      where: {
        Id: roleId
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
                            res.status(200).json(newParish);
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
        'Email',
        ],
    })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => res.status(400).json({ msg: "failed", error: err }));
  })
  .catch((err) => res.status(400).json({ msg: "failed", error: err }));
}
