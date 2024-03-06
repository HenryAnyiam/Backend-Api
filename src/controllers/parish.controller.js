const Parish = require("../models/parish.model");
const Role = require("../models/role.model");
const jwt = require('jsonwebtoken');
const Deanery = require("../models/deanery.model");

const AUTH_SECRET_KEY = process.env.Token;

exports.getParishes = (req, res, next) => {
  Parish.findAll({
    attributes: [
      'id',
      'name',
      'email',
      ],
    include: [
      {
      model: Deanery,
      attributes: ['name'],
      as: 'deanery'
    }]
  })
    .then((parishes) => {
      res.status(200).json(parishes);
    })
    .catch((err) => res.status(400).json({ msg: "failed", error: err }));
};


exports.createParish = (req, res, next) => {
  console.log(req.body, "see");
  const { name, meetingDay, time, email, deaneryId, location, } =
  req?.body;
  let token = req.headers.token;
  let role = "0";
  if (
    email &&
    name && 
    deaneryId &&
    location &&
    meetingDay &&
    time
    ) {
      jwt.verify(token, AUTH_SECRET_KEY, (err, decoded) => {
        if (!(err) && decoded) {
          const { id, roleId } = decoded;
          if (roleId  !== undefined) {
            role = roleId;
          }
        }
      });
    Role.findOne({
      where: {
        id: role
      }
    })
      .then((roleExists) => {
        if (roleExists && roleExists.name !== "Member") {
          Parish.findOne({
              where: {
                  email,
              },
          })
            .then((emailExists) => {
                if (emailExists) {
                    res.status(400).json({ msg: "Email already exists" });
                  } else {
                    Parish.create({
                        name,
                        meetingDay,
                        time,
                        email,
                        deaneryId,
                        location
                    })
                      .then((parish) => {
                        Parish.findOne({
                          where: {
                            id: parish.id
                          },
                          attributes: [
                            'id',
                            'name',
                            'email',
                            'time',
                            'location'
                            ],
                          include: [
                            {
                            model: Deanery,
                            attributes: ['name'],
                            as: 'deanery'
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
      id: req.params.parishId
    }
  })
    .then((parish) => {
    parish.getUsers({
      attributes: [
        'id',
        'firstName',
        'lastName',
        'phoneNumber',
        'email',
        ],
    })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => res.status(400).json({ msg: "failed", error: err }));
  })
  .catch((err) => res.status(400).json({ msg: "failed", error: err }));
}
