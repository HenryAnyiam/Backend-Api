const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Chaplain = sequelize.define("Chaplain", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  Name: {
    type: DataTypes.STRING,
  },

  DeaneryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Image: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

module.exports = Chaplain;
