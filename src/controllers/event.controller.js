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
  if ( name && date ) {
    Role.findOne({
      where: {
        id: req.user.roleId
      }
    })
      .then((roleExists) => {
        const allowedRoles = ["Super Admin", "ADC Admin", "Deanery Admin"];
        if (roleExists && allowedRoles.includes(roleExists.name)) {
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


exports.updateEvent = async (req, res, next) => {
  try {
    const roleExists = await Role.findByPk(req.user.roleId);
    const allowedRoles = ["Super Admin", "ADC Admin", "Deanery Admin"]
    if (!(roleExists || allowedRoles.includes(roleExists.name))) {
      return res.status(401).json({ msg: "Unauthorized Action"});
    }
    const event = await Event.findByPk(req.params.eventId);
    await event.update(req.body);
    let bannerImage;
    if (req.file) {
      bannerImage = req.file.path;
    }
    event.bannerImage = bannerImage || event.bannerImage;
    await event.save();
    res.status(200).json({ msg: "Updated Successfully", event });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
}
