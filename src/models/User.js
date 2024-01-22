const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Role = require('./Role');
const Deanery = require('./Deanery');
const Parish = require('./Parish');


const User = sequelize.define("User", {
  Id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  FirstName: {
    type: DataTypes.STRING,
  },

  LastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    require: true,
  },

  Password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },

  BaptismalName: {
    type: DataTypes.STRING,
  },
  PhoneNumber: {
    type: DataTypes.STRING,
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
  },
  DeaneryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ParishId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  MembershipId: {
    type: DataTypes.STRING,
  },
  Position: {
    type: DataTypes.STRING,
  },
  DateOfBirth: {
    type: DataTypes.DATE,
  },
  RoleId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING,
  },
  Picture: {
    type: DataTypes.STRING,
  },
});

Role.hasMany(User, { foreignKey: 'RoleId' });
User.belongsTo(Role);

Deanery.hasMany(User, { foreignKey: 'DeaneryId' });
User.belongsTo(Deanery);

Parish.hasMany(User, { foreignKey: 'ParishId' });
User.belongsTo(Parish);

module.exports = User;
