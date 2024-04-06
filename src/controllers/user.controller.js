const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const Deanery = require("../models/deanery.model");
const Parish = require("../models/parish.model");
const bcrypt = require('bcrypt');

const AUTH_SECRET_KEY = process.env.Token;

exports.getUsers = (req, res, next) => {
  User.findAll({
    attributes: [
      'id',
      'firstName',
      'lastName',
      'phoneNumber',
      'email',
      'picture'
      ],
    include: [
      {
      model: Deanery,
      as: 'Deanery'
    },
    {
      model: Parish,
      as: 'Parish'
    },
  ],
})
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => res.status(400).json({ msg: "failed", error: err }));
};

exports.createUser = async (req, res, next) => {
  try {
    const {
      firstName, lastName, email,
      password, phoneNumber, deaneryId,
      parishId, roleId } = req.body;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !phoneNumber ||
        !roleId
      ) {
        res.status(400).json({ msg: "All Fields are required" });
      }

      const emailExist = await User.findOne({ where: { email }});
      if (emailExist) {
        res.status(400).json({ msg: "Email already exists" });
      }

      let picture;
      if (req.file) {
        picture = req.file.path;
      }

      const user = await User.create({
        firstName,
        email,
        lastName,
        phoneNumber,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        deaneryId,
        parishId,
        roleId,
        picture,
      })

      jwt.sign(
        { id: user.id,
          roleId: user.roleId },
        AUTH_SECRET_KEY,
        { expiresIn: "5h" },
        (err, token) => {
          const response = {
            token: token,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
          }
          if (user.deanery) {
            response.deanery = user.Deanery.name;
          }
          if (user.Parish) {
            response.parish = user.Parish.name;
          }
          res.status(200).json(response)
        })
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
}

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const user = await User.findOne({ where: { email, }});
      if (!user) {
        res.status(400).json({ msg: "User does not Exist"});
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          jwt.sign(
            { id: user.id,
              roleId: user.roleId},
            AUTH_SECRET_KEY,
            { expiresIn: "5h" },
            (err, token) => {
              const response = {
                token: token,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                deanery: user.Deanery,
                parish: user.Parish,
              }
              if (user.Deanery) {
                response.deanery = user.Deanery.name;
              }
              if (user.Parish) {
                response.parish = user.Parish.name;
              }
              res.status(200).json(response);
            }
          );
        } else {
          res.status(401).json({ msg: "Incorrect Password"});
        }
      }
    } else {
      res.status(400).json({ msg: "Bad Request" });
    }
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
}
