const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Deanery = require("../models/Deanery");
const Parish = require("../models/Parish");
const bcrypt = require('bcrypt');

const AUTH_SECRET_KEY = process.env.Token;

exports.getUser = (req, res, next) => {
  User.findAll({
    attributes: [
      'Id',
      'FirstName',
      'LastName',
      'PhoneNumber',
      ],
    include: [
      {
      model: Deanery,
      attributes: ['Name'],
      as: 'Deanery'
    },
    {
      model: Parish,
      attributes: ['Name'],
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
  const { FirstName, LastName, Email, Password, PhoneNumber, DeaneryId, ParishId, RoleId } =
    req?.body;
  if (
    !FirstName ||
    !LastName ||
    !Email ||
    !Password ||
    !PhoneNumber ||
    !DeaneryId ||
    !ParishId ||
    !RoleId
  ) {
    res.status(400).json({ msg: "All Fields are required" });
  } else {
    User.findOne({
      where: {
        Email,
      },
    })

      .then((emailExist) => {
        if (emailExist) {
          res.status(400).json({ msg: "Email already exists" });
        } else {
          let hashedPassword;
          try {
            const salt = bcrypt.genSaltSync(10);
            hashedPassword = bcrypt.hashSync(Password, salt);
          } catch (error) {
            throw error;
          }
          User.create({
            FirstName,
            Email,
            LastName,
            PhoneNumber,
            Password: hashedPassword,
            DeaneryId,
            ParishId,
            RoleId
          })
            .then((user) => {
              jwt.sign(
                { id: user.id },
                AUTH_SECRET_KEY,
                { expiresIn: "5h" },
                (err, token) => {
                  User.findOne({
                    where: {
                      Id: user.Id
                    },
                    attributes: [
                      'Id',
                      'FirstName',
                      'LastName',
                      'PhoneNumber',
                      ],
                    include: [
                      {
                      model: Deanery,
                      attributes: ['Name'],
                      as: 'Deanery'
                    },
                    {
                      model: Parish,
                      attributes: ['Name'],
                      as: 'Parish'
                    }
                  ]
                  })
                    .then((newUser) => {
                      res.status(200).json({
                        token, newUser
                      })
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
  const { Email, Password } =
  req?.body;
  if ( Email && Password) {
    User.findOne({
      where: {
        Email,
      },
        attributes: [
          'Id',
          'FirstName',
          'LastName',
          'PhoneNumber',
          ],
        include: [
          {
          model: Deanery,
          attributes: ['Name'],
          as: 'Deanery'
        },
        {
          model: Parish,
          attributes: ['Name'],
          as: 'Parish'
        }
      ]
    })
      .then((user) => {
        if (user) {
          let correctPassword;
          correctPassword = bcrypt.compareSync(Password, user.Password);
          if (correctPassword) {
            jwt.sign(
              { id: user.id },
              AUTH_SECRET_KEY,
              { expiresIn: "5h" },
              (err, token) => {
                res.status(200).json({
                  token,
                  user,
                });
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
