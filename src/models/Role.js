
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");


const Role = sequelize.define("Role", {
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

  Description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});


module.exports = Role;
