const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");


const Deanery = sequelize.define("Deanery", {
  Id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  MeetingDay: {
    type: DataTypes.STRING,
  },
  Time: {
    type: DataTypes.STRING,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Deanery;
