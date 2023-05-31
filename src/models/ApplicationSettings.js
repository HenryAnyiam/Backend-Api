const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const ApplicationSettings = sequelize.define("ApplicationSettings", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  Key: {
    type: DataTypes.STRING,
  },

  Value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ApplicationSettings;
