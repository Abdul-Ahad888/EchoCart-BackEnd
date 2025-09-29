const {Sequelize} = require('sequelize')

const dbName = process.env.DB_NAME || 'echocart'
const dbUser = process.env.DB_USER || 'root'
const dbPassword = process.env.DB_PASSWORD || ''

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: "localhost",
    dialect: "mysql"
})

// Import models after sequelize init
const User = require("../model/user.model");
const Product = require("../model/product.model");
const Cart = require("../model/cart.model");
const Wishlist = require("../model/wishlist.model");
const Order = require("../model/order.model");

// Sync all models once
Promise.all([
  User.sync({ alter: true }),
  Product.sync({ alter: true }),
  Cart.sync({ alter: true }),
  Wishlist.sync({ alter: true }),
  Order.sync({ alter: true }),
])
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.error("❌ Database sync error:", err));

module.exports = sequelize