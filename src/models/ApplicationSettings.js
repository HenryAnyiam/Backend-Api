const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");


const ApplicationSettings = sequelize.define("ApplicationSettings", {
  Id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
