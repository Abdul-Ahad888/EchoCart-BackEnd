const app = require('./app')

require('dotenv').config()

const sequelize = require('./config/db.config')

const User = require('./model/user.model')
const Product = require('./model/product.model')
const Cart = require('./model/cart.model')
const Wishlist = require('./model/wishlist.model')
const Order = require('./model/order.model')

const port = process.env.PORT || 8000


Order.sync({ alter: true })
Cart.sync({ alter: true })
User.sync({ alter: true })
Product.sync({ alter: true })
Wishlist.sync({ alter: true })

app.listen(port, (error) => {

    if (error) {
        console.log('Error While Starting Server.', error)
    }
    
    console.log('Server Started Successfully At Port', port)
})