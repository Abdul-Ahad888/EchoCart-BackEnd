const { Sequelize } = require('sequelize');
require('dotenv').config();
const mysql2 = require('mysql2')

const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "mysql",
  dialectModule:  mysql2,
  port: dbPort,
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to AlwaysData MySQL"))
  .catch((err) => console.error("❌ DB connection error:", err));


module.exports = sequelize;
