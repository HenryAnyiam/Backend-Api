const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");


const Deanery = sequelize.define("Deanery", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  meetingDay: {
    type: DataTypes.STRING,
  },
  time: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    require: true,
  },
  banner: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  youtube: {
    type: DataTypes.STRING
  },
  instagram: {
    type: DataTypes.STRING,
  },
  facebook: {
    type: DataTypes.STRING,
  },
  twitter: {
    type: DataTypes.STRING
  },
});

module.exports = Deanery;
