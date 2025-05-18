const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Parish = require("./parish.model");
const AYD = require("./ayd.model");
const Deanery = require("./deanery.model");

const Delegate = sequelize.define("Delegate", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  aydId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  parishId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  deaneryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

Parish.hasMany(Delegate, { foreignKey: "parishId" });
Deanery.hasMany(Delegate, { foreignKey: "deaneryId" });
Delegate.belongsTo(Parish, { foreignKey: "parishId" });
Delegate.belongsTo(Deanery, { foreignKey: "deaneryId" });

AYD.hasMany(Delegate, { foreignKey: "aydId" });
Delegate.belongsTo(AYD, { foreignKey: "aydId" });

module.exports = Delegate;
