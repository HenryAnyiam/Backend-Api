const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_Name,
  process.env.DB_User,
  process.env.DB_Password,
  {
    host: process.env.DB_Host,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
module.exports = sequelize;
