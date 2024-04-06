const Deanery = require("../models/deanery.model");
const Parish = require("../models/parish.model");
const Role = require("../models/role.model");
const jwt = require('jsonwebtoken');

const AUTH_SECRET_KEY = process.env.Token;

exports.getDeaneries = (req, res, next) => {
  Deanery.findAll()
    .then((deaneries) => {
      res.status(200).json(deaneries);
    })
    .catch((err) => res.status(400).json({ msg: "failed", error: err }));
};


exports.createDeanery = (req, res, next) => {
  const { name, meetingDay, time, email, phoneNumber,
          youtube, facebook, instagram, twitter,} = req?.body;
  let token = req.headers.token;
  let role = "0";
  if ( email && name ) {
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
        console.log(roleExists.name)
        if (roleExists && roleExists.name !== "Member") {
          Deanery.findOne({
              where: {
                  email,
              },
          })
            .then((emailExists) => {
              if (emailExists) {
                  res.status(400).json({ msg: "Email already exists" });
              } else {
                let banner;
                if (req.file) {
                  banner = req.file.path;
                }
                Deanery.create({
                    name,
                    meetingDay,
                    time,
                    email,
                    phoneNumber,
                    facebook,
                    youtube,
                    instagram,
                    twitter,
                    banner,
                })
                  .then((deanery) => {
                    res.status(200).json(deanery)
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

exports.updateDeanery = async (req, res, next) => {
  try {
    let role = "0";
    let token = req.headers.token;
    jwt.verify(token, AUTH_SECRET_KEY, (err, decoded) => {
      if (!(err) && decoded) {
        const { id, roleId } = decoded;
        if (roleId  !== undefined) {
          role = roleId;
        }
      }
    });
    const roleExists = await Role.findByPk(role);
    if (!(roleExists)) {
      return res.status(403).json({ msg: "Unauthorized Action"});
    }
    const deanery = await Deanery.findByPk(req.params.deaneryId);
    await deanery.update(req.body);
    let banner;
    if (req.file) {
      banner = req.file.path;
    }
    deanery.banner = banner || deanery.banner;
    await deanery.save();
    return res.status(200).json({ msg: "Updated Successfully", deanery});
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
}


exports.getDeanery = async (req, res, next) => {
  try {
    const deanery = await Deanery.findByPk(
      req.params.deaneryId,
      {include: [{
        model: Parish,
        attributes: ['id', 'name', 'email', 'location', 'meetingDay', 'time']
      }]
    })
    res.status(200).json(deanery);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
}

exports.getPaidParishes = async (req, res, next) => {
  try {
    const deanery = await Deanery.findByPk(req.params.deaneryId)
    const parishes = deanery.getParishes({
      where: { hasPaid: true},
      attributes: ['id', 'name', 'email', 'location', 'meetingDay', 'time']
    })
    res.status(200).json(parishes);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
}


exports.getParishes = (req, res, next) => {
  Deanery.findOne({
    where: {
      id: req.params.deaneryId
    }
  })
    .then((deanery) => {
    deanery.getParishes({
      attributes: [
        'id',
        'name',
        'email',
        'location',
        'meetingDay',
        'time',
      ],
    })
      .then((parishes) => {
        res.status(200).json(parishes);
      })
      .catch((err) => res.status(400).json({ msg: "failed", error: err }));
  })
  .catch((err) => res.status(400).json({ msg: "failed", error: err }));
}

exports.getUsers = (req, res, next) => {
  Deanery.findOne({
    where: {
      id: req.params.deaneryId
    }
  })
    .then((deanery) => {
      deanery.getUsers({
        attributes: [
          'id',
          'firstName',
          'lastName',
          'phoneNumber',
          'email'
          ],
      })
        .then((users) => {
          res.status(200).json(users);
        })
        .catch((err) => res.status(400).json({ msg: "Failed", error: err }));
  })
  .catch((err) => res.status(400).json({ msg: "Failed", error: err }));
}


exports.getEvents = (req, res, next) => {
  Deanery.findOne({
    where: {
      id: req.params.deaneryId
    }
  })
    .then((deanery) => {
    deanery.getEvents()
      .then((events) => {
        res.status(200).json(events);
      })
      .catch((err) => res.status(400).json({ msg: "Event not Found", error: err }));
  })
  .catch((err) => res.status(400).json({ msg: "Deanery Not Found", error: err }));
}


exports.getExecutives = (req, res, next) => {
  Deanery.findOne({
    where: {
      id: req.params.deaneryId
    }
  })
    .then((deanery) => {
    deanery.getExecutives()
      .then((executives) => {
        res.status(200).json(executives);
      })
      .catch((err) => res.status(400).json({ msg: "Executive not Found", error: err }));
  })
  .catch((err) => res.status(400).json({ msg: "Deanery Not Found", error: err }));
}
