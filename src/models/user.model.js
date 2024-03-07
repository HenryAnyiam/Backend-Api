const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Role = require('./role.model');
const Deanery = require('./deanery.model');
const Parish = require('./parish.model');


const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  firstName: {
    type: DataTypes.STRING,
  },

  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    required: true,
  },

  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },

  baptismalName: {
    type: DataTypes.STRING,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  deaneryId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  parishId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  membershipId: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.STRING,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
  },
  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
  },
  picture: {
    type: DataTypes.STRING,
  },
});

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Deanery.hasMany(User, { foreignKey: 'deaneryId' });
User.belongsTo(Deanery, { foreignKey: 'deaneryId' });

Parish.hasMany(User, { foreignKey: 'parishId' });
User.belongsTo(Parish, { foreignKey: 'parishId' });

module.exports = User;
