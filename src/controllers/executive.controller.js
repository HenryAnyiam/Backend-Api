const Executive = require("../models/executive.model");
const Role = require("../models/role.model");
const jwt = require('jsonwebtoken');

const AUTH_SECRET_KEY = process.env.Token;

exports.getExecutives = (req, res, next) => {
  Executive.findAll()
    .then((executives) => {
      res.status(200).json(executives);
    })
    .catch((err) => res.status(400).json({ msg: "failed", error: err }));
};


exports.createExecutive = (req, res, next) => {
  console.log(req.body, "see");
  const { name, position, deaneryId} = req?.body;
  let token = req.headers.token;
  let role = "0";
  if ( name && position ) {
    jwt.verify(token, AUTH_SECRET_KEY, (err, decoded) => {
      if (!(err) && decoded) {
        const { id, roleId } = decoded;
        if (roleId) {
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
          let adcId;
          if (!deaneryId) {
            adcId = "Lagos";
          }
          let picture;
          if (req.file) {
            picture = req.file.path;
          }
          Executive.create({
              name,
              position,
              deaneryId,
              adcId,
              picture,
          })
            .then((executive) => {
              res.status(200).json(executive)
            })
            .catch((err) => {
              res.status(400).json({ msg: err.message || "Not created" })
            })
        } else {
        res.status(403).json({ msg: "Action Not Allowed" });
      }
    })
  }
}

exports.getAdcExecutives = (req, res, next) => {
  console.log(req.params);
  Executive.findAll({
    where: {
      adcId: "Lagos"
    }
  })
    .then((executive) => {
      res.status(200).json(executive);
  })
  .catch((err) => res.status(400).json({ msg: "failed", error: err }));
}
