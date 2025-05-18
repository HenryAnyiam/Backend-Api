const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Deanery = require("./deanery.model");

const Parish = sequelize.define("Parish", {
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
  location: {
    type: DataTypes.STRING,
  },
  meetingDay: {
    type: DataTypes.STRING,
  },
  time: {
    type: DataTypes.TIME,
  },
  hasPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
  },
  deaneryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

Deanery.hasMany(Parish, { foreignKey: "deaneryId" });
Parish.belongsTo(Deanery, { foreignKey: "deaneryId" });

module.exports = Parish;
