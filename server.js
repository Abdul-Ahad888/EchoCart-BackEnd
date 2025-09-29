const app = require('./app');
const sequelize = require('./config/db.config');

// Only sync DB locally (skip on Vercel)
const User = require("./model/user.model");
const Product = require("./model/product.model");
const Cart = require("./model/cart.model");
const Wishlist = require("./model/wishlist.model");
const Order = require("./model/order.model");

Promise.all([
  User.sync(),
  Product.sync(),
  Cart.sync(),
  Wishlist.sync(),
  Order.sync(),
])

  .then(() => sequelize.sync({ alter: true }))
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.error("❌ Database sync error:", err));

module.exports = app;
