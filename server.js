const app = require('./app')

// Skip DB setup on Vercel for now
if (process.env.VERCEL_ENV !== "production") {
    const User = require("./model/user.model");
    const Product = require("./model/product.model");
    const Cart = require("./model/cart.model");
    const Wishlist = require("./model/wishlist.model");
    const Order = require("./model/order.model");

    Promise.all([
        User.sync({ alter: true }),
        Product.sync({ alter: true }),
        Cart.sync({ alter: true }),
        Wishlist.sync({ alter: true }),
        Order.sync({ alter: true }),
    ])
        .then(() => console.log("✅ Database synced"))
        .catch((err) => console.error("❌ Database sync error:", err));
}

module.exports = app
