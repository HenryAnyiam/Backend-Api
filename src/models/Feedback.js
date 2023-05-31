const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Feedback = sequelize.define("Feedback", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  Name: {
    type: DataTypes.STRING,
  },

  Subject: {
    type: DataTypes.STRING,
  },
  Message: {
    type: DataTypes.STRING,
  },
});

module.exports = Feedback;
