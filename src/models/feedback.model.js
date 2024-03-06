const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");


const Feedback = sequelize.define("Feedback", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
  },

  subject: {
    type: DataTypes.STRING,
  },
  
  message: {
    type: DataTypes.STRING,
  },
});

module.exports = Feedback;
