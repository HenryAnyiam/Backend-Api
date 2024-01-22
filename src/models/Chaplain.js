const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Deanery = require('./Deanery')


const Chaplain = sequelize.define("Chaplain", {
  Id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  Name: {
    type: DataTypes.STRING,
  },

  DeaneryId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  Image: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

Deanery.hasMany(Chaplain, { foreignKey: 'DeaneryId' });
Chaplain.belongsTo(Deanery);

module.exports = Chaplain;
