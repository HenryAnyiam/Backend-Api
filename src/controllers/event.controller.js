const Event = require("../models/event.model");
const Role = require("../models/role.model");
const jwt = require('jsonwebtoken');

const AUTH_SECRET_KEY = process.env.Token;

exports.getEvents = (req, res, next) => {
  Event.findAll()
    .then((events) => {
      res.status(200).json(events);
    })
    .catch((err) => res.status(400).json({ msg: "failed", error: err }));
};


exports.createEvent = (req, res, next) => {
  console.log(req.body, "see");
  const { name, description, date, time, venue, deaneryId} = req?.body;
  let token = req.headers.token;
  let role = "0";
  if ( name && date ) {
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
          let bannerImage;
          if (req.file) {
            bannerImage = req.file.path;
          }
          Event.create({
              name,
              description,
              date,
              time,
              deaneryId,
              venue,
              adcId,
              bannerImage,
          })
            .then((event) => {
              res.status(200).json(event)
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

exports.getAdcEvents = (req, res, next) => {
  console.log(req.params);
  Event.findAll({
    where: {
      adcId: "Lagos"
    }
  })
    .then((events) => {
   res.status(200).json(events);
  })
  .catch((err) => res.status(400).json({ msg: "failed", error: err }));
}
