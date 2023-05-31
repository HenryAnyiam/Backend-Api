const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Deanery = sequelize.define("Deanery", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  Name: {
    type: DataTypes.STRING,
  },

  Email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Deanery;
