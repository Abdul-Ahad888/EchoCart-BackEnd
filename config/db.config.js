const { Sequelize } = require('sequelize')

// Don’t connect on Vercel for now
if (process.env.VERCEL_ENV === "production") {
    console.log("Skipping DB connection on Vercel");
    module.exports = {};
} else {
    const dbName = process.env.DB_NAME || 'echocart'
    const dbUser = process.env.DB_USER || 'root'
    const dbPassword = process.env.DB_PASSWORD || ''

    const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: "localhost",
        dialect: "mysql"
    })

    module.exports = sequelize
}
