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

exports.createUser = (req, res, next) => {
  console.log(req.body, "see");
  console.log(req.file, "file");
  const { firstName, lastName, email, password, phoneNumber, deaneryId, parishId, roleId } =
    req?.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phoneNumber ||
    !roleId
  ) {
    res.status(400).json({ msg: "All Fields are required" });
  } else {
    User.findOne({
      where: {
        email,
      },
    })
      .then((emailExist) => {
        if (emailExist) {
          res.status(400).json({ msg: "Email already exists" });
        } else {
          let hashedPassword;
          try {
            const salt = bcrypt.genSaltSync(10);
            hashedPassword = bcrypt.hashSync(password, salt);
          } catch (error) {
            throw error;
          }
          let picture;
          if (req.file) {
            picture = req.file.path;
            console.log(req.file.path);
          }
          User.create({
            firstName,
            email,
            lastName,
            phoneNumber,
            password: hashedPassword,
            deaneryId,
            parishId,
            roleId,
            picture,
          })
            .then((user) => {
              jwt.sign(
                { id: user.id,
                  roleId: user.roleId },
                AUTH_SECRET_KEY,
                { expiresIn: "5h" },
                (err, token) => {
                  User.findOne({
                    where: {
                      id: user.id
                    },
                    
                  })
                    .then((newUser) => {
                      newUser['token'] = token;
                       const response = {
                        token: token,
                        id: newUser.id,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        phoneNumber: newUser.phoneNumber,
                      }
                      if (newUser.deanery) {
                        response.deanery = newUser.Deanery.name;
                      }
                      if (newUser.Parish) {
                        response.parish = newUser.Parish.name;
                      }
                      res.status(200).json(response)
                    })
                    .catch((err) => {
                      res.status(400).json({ msg: err.message})
                    })
                }
              );
            })
            .catch((err) => res.status(400).json({ msg: err.message || "Not created" }));
        }
      })

      .catch((err) => {
        console.log(err);
      });
  }
};


exports.loginUser = (req, res, next) => {
  console.log(req.body, "see");
  const { email, password } =
  req?.body;
  if ( email && password) {
    User.findOne({
      where: {
        email,
      }
    })
      .then((user) => {
        if (user) {
          let correctPassword;
          correctPassword = bcrypt.compareSync(password, user.password);
          if (correctPassword) {
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
            res.status(401).json({ msg: "Incorrect Password"})
          }
        } else {
          res.status(400).json({ msg: "User does not Exist"})
        }
  })    
  } else {
    res.status(400).json({ msg: "Bad Request" });
  }
}
