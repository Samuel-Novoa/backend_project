const { Sequelize } = require("sequelize");
require("dotenv").config();
import { getConfig } from "../config";

const config = getConfig();

const sequelize = new Sequelize(
  config.conectionMysql.MYSQL_DATABASE,
  config.conectionMysql.MYSQL_USERNAME,
  config.conectionMysql.MYSQL_PASSWORD,
  {
    host: config.conectionMysql.MYSQL_HOST,
    dialect: "mysql",
  }
);

// Verificar la conexión a la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión a MYSQL conectado correctamente.");
  })
  .catch((err) => {
    console.error("No se puede conectar a MYSQLDB:", err);
  });

module.exports = sequelize;
