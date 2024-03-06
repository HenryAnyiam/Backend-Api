const Deanery = require("../models/deanery.model");
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
  console.log(req.body, "see");
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
                    let image;
                    if (req.file) {
                      image = req.file.path;
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
                        image,
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


exports.getParishes = (req, res, next) => {
  console.log(req.params);
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
  console.log(req.params);
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
  console.log(req.params);
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
      .catch((err) => res.status(400).json({ msg: "failed", error: err }));
  })
  .catch((err) => res.status(400).json({ msg: "failed", error: err }));
}


exports.getExecutives = (req, res, next) => {
  console.log(req.params);
  Deanery.findOne({
    where: {
      id: req.params.deaneryId
    }
  })
    .then((deanery) => {
    deanery.getExecutives()
      .then((executivess) => {
        res.status(200).json(executives);
      })
      .catch((err) => res.status(400).json({ msg: "failed", error: err }));
  })
  .catch((err) => res.status(400).json({ msg: "failed", error: err }));
}
