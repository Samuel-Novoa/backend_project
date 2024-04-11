const { DataTypes } = require("sequelize");
const sequelize = require("../../database/mysql"); 

const Simulator = sequelize.define("SimulatorReport", {
   simulator_report_id: {
     type: DataTypes.INTEGER,
     allowNull: false,
     primaryKey: true,
     autoIncrement: true
   },
   user_id: {
     type: DataTypes.INTEGER,
     allowNull: false,
   },
   humedad_inicial: DataTypes.DOUBLE,
   humedad_deseada: DataTypes.DOUBLE,
   flujo_trigo: DataTypes.DOUBLE,
   temperatura_inicial: DataTypes.DOUBLE,
   temperatura_final: DataTypes.DOUBLE,
   calor_especifico_trigo: DataTypes.DOUBLE,
   entalpia_vaporizacion_agua: DataTypes.DOUBLE,
   agua_en_trigo_humedo: DataTypes.DOUBLE,
   agua_en_trigo_seco: DataTypes.DOUBLE,
   agua_a_evaporar: DataTypes.DOUBLE,
   calor_sencible: DataTypes.DOUBLE,
   calor_latente: DataTypes.DOUBLE,
   calor_total: DataTypes.DOUBLE,
   peso_neto_trigo: DataTypes.DOUBLE,
 }, {
   tableName: "simulator_report",
   timestamps: false
 });
 
 module.exports = Simulator;