const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");


const ApplicationSettings = sequelize.define("ApplicationSettings", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  key: {
    type: DataTypes.STRING,
  },

  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ApplicationSettings;
