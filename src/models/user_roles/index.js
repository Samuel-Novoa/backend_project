import { DataTypes } from "sequelize";
import sequelize from "../../database/mysql";
import User from "../user";
import Role from "../roles";

const UserRole = sequelize.define(
  "user_roles",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: "user_id",
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Role,
        key: "role_id",
      },
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "user_roles",
    timestamps: false,
  }
);

module.exports = UserRole;
