const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.VERCEL_ENV) {
  console.log("⚡ Running on Vercel → Skipping DB connection completely");
  sequelize = null; // no DB at all
} else {
  const dbName = process.env.DB_NAME || 'echocart';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';

  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: "localhost",
    dialect: "mysql"
  });
}

module.exports = sequelize;
