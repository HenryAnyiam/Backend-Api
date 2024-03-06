const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Deanery = require('./deanery.model');


const Executive = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
  },
  adcId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deaneryId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  picture: {
    type: DataTypes.STRING,
  },
});

Deanery.hasMany(Executive, { foreignKey: 'deaneryId' });
Executive.belongsTo(Deanery);

module.exports = Executive;
