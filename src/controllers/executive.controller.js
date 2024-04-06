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
          return res.status(403).json({ msg: "Action Not Allowed" });
      }
    })
  }
}

exports.updateExecutive = async (req, res, next) => {
  try {
    const roleExists = await Role.findByPk(req.body.roleId);
    if (!(roleExists || roleExists.name == "Member")) {
      return res.status(401).json({ msg: "Unauthorized Action"});
    }
    const executive = await Executive.findByPk(req.params.executiveId);
    await executive.update(req.body);
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
    executive.picture = picture || executive.picture;
    await executive.save();
    res.status(200).json({ msg: "Updated Successfully", executive});
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
}

exports.getAdcExecutives = (req, res, next) => {
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
