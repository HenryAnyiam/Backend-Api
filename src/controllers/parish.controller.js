const Parish = require("../models/parish.model");
const Role = require("../models/role.model");
const jwt = require('jsonwebtoken');
const Deanery = require("../models/deanery.model");
const AYD = require("../models/ayd.model");

const AUTH_SECRET_KEY = process.env.Token;

exports.getParishes = (req, res, next) => {
  Parish.findAll()
    .then((parishes) => {
      res.status(200).json(parishes);
    })
    .catch((err) => res.status(400).json({ msg: "failed", error: err }));
};


exports.createParish = (req, res, next) => {
  const { name, meetingDay, time, email, deaneryId, location, } = req?.body;
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
                        res.status(200).json(parish)
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
              res.status(403).json({ msg: "Unauthorized Action" });
            }
          })
        } else {
          res.status(400).json({ msg: "Incomplete Information" })
        }
}


exports.getPaidParishes = async (req, res, next) => {
  try {
    const parishes = await Parish.findAll({where: {hasPaid: true}})
    res.status(200).json(parishes);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
}


exports.switchPaid = async (req, res, next) => {
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
      res.status(403).json({ msg: "Unauthorized Action"});
    }
    const parishes = await Parish.findAll({where: {hasPaid: true}})
    parishes.map(async (parish) => {
      parish.hasPaid = false;
      await parish.save();
    });
    res.status(200).json({ msg: "Updated Successfully"})
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
}


exports.updateParish = async (req, res, next) => {
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
      res.status(403).json({ msg: "Unauthorized Action"});
    }
    const parish = await Parish.findByPk(req.params.parishId);
    const { name, meetingDay, time, email, deaneryId, location, hasPaid } = req?.body;
    parish.name = name || parish.name;
    parish.meetingDay = meetingDay || parish.meetingDay;
    parish.time = time || parish.time;
    parish.email = email || parish.email;
    parish.deaneryId = deaneryId || parish.deaneryId;
    parish.location = location || parish.location;
    if (hasPaid == true && parish.hasPaid !== true) {
      const ayd = await AYD.findOne({ order: [['createdAt', 'DESC']]});
      const currentYear = (new Date()).getFullYear()
      if (ayd.date.getFullYear() == currentYear) {
        ayd.totalPaidParish += 1;
        await ayd.save();
      }
      parish.hasPaid = true;
    } else if (hasPaid == false) {
      parish.hasPaid = false;
    }
    await parish.save();
    res.status(200).json({ msg: "Updated Successfully", parish});
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
}


exports.getParish = async (req, res, next) => {
  try {
    const parish = await Parish.findOne({where: {id: req.params.parishId}})
    res.status(200).json(parish);
  } catch (e) {
    res.status(400).json({ msg: e.message });
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
