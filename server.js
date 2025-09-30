const app = require('./app');
const sequelize = require('./config/db.config');

// Only sync DB locally (skip on Vercel)
const User = require("./model/user.model");
const Product = require("./model/product.model");
const Cart = require("./model/cart.model");
const Wishlist = require("./model/wishlist.model");
const Order = require("./model/order.model");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL");

    if (process.env.NODE_ENV !== "production") {
      // Only sync locally
      await Promise.all([
        User.sync(),
        Product.sync(),
        Cart.sync(),
        Wishlist.sync(),
        Order.sync(),
      ]);
      console.log("✅ Local DB synced");
    } else {
      console.log("⚡ Production mode: skipping DB sync");
    }
  } catch (err) {
    console.error("Database error:", err);
  }
})();
module.exports = app;
