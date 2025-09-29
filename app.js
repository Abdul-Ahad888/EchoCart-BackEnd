const express = require('express')
const cors = require('cors')
const userRoute = require('./routes/user.route')
const productRoute = require('./routes/product.route')
const wishlistRoute = require('./routes/wishlist.route')
const cartRoute = require('./routes/cart.route')
const orderRoute = require('./routes/order.route')
const paymentRoute = require('./routes/payment.route')
const adminRoute = require('./routes/admin.route')
const path = require('path')
const app = express()

app.use(cors())
  
// {origin : "http://localhost:3000"}

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Backend is working 🚀");
  });  

app.use('/images', express.static(path.join(__dirname, 'uploads/images')))

app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/payment', paymentRoute)
app.use('/api/v1/order', orderRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/wishlist', wishlistRoute)
app.use('/uploads', express.static('uploads'))


module.exports = app