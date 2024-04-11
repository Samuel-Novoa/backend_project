const { DataTypes } = require("sequelize");
const sequelize = require("../../database/mysql");
import { syncModels } from "../../utils";

const Role = sequelize.define(
  "role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

module.exports = Role;
