const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Deanery = require("./deanery.model");

const AYD = sequelize.define("AYD", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  theme: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
  },
  time: {
    type: DataTypes.TIME,
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalDelegates: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalPaidParish: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  host: {
    type: DataTypes.UUID,
  },
  bannerImage: {
    type: DataTypes.STRING,
  },
});

Deanery.hasMany(AYD, { foreignKey: "host" });
AYD.belongsTo(Deanery, { foreignKey: "host" });

module.exports = AYD;
