const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Module = sequelize.define("Module", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  Name: {
    type: DataTypes.STRING,
  },

  IsActive: {
    type: DataTypes.BOOLEAN,
  },
});

module.exports = Module;
