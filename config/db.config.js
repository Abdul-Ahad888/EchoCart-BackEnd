const { Sequelize } = require('sequelize');

const dbName = process.env.DB_NAME || 'echocart';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';

let sequelize;

// On Vercel → use SQLite (skip MySQL)
if (process.env.VERCEL) {
  console.log("⚡ Running on Vercel → using in-memory SQLite, skipping MySQL");
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
} else {
  console.log("⚡ Running locally → using MySQL");
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: "localhost",
    dialect: "mysql"
  });
}

module.exports = sequelize;
