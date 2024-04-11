const { DataTypes } = require("sequelize");
const sequelize = require("../../database/mysql");
import Role from "../roles";

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    names :{
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastNames : {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

User.belongsToMany(Role, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id",
  timestamps: false,
  onDelete: 'CASCADE'
});

module.exports = User;
