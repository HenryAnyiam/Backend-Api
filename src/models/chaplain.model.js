const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Deanery = require('./deanery.model')


const Chaplain = sequelize.define("Chaplain", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
  },

  deaneryId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

Deanery.hasMany(Chaplain, { foreignKey: 'deaneryId' });
Chaplain.belongsTo(Deanery, { foreignKey: 'deaneryId' });

module.exports = Chaplain;
