const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Deanery = require('./Deanery');


const Parish = sequelize.define("Parish", {
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

  DeaneryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

});

Deanery.hasMany(Parish, { foreignKey: 'DeaneryId' });
Parish.belongsTo(Deanery);

module.exports = Deanery;
