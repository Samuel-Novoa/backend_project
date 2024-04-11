const { DataTypes } = require("sequelize");
const sequelize = require("../../database/mysql");
import User from "../user";
import { syncModels } from "../../utils";

const Session_token = sequelize.define(
  "session_token",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "session_token",
    timestamps: false,
  }
);
Session_token.belongsTo(User, { foreignKey: "user_id" });

module.exports = Session_token;
