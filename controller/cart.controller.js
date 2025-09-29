const Cart = require('../model/cart.model')
const Product = require('../model/product.model')


const addToCart = async (req, res) => {

    try {
        const { productId, quantity } = req.body
        const userId = req.user.id

        const product = await Product.findByPk(productId)
        if (!product) return res.status(404).json({ msg: 'Product Not Found' })

        const existingItem = await Cart.findOne({ where: { userId, productId } })
        if (existingItem) {
            existingItem.quantity += quantity
            await existingItem.save()
        } else {
            await Cart.create({ userId, productId, quantity })
        }

        res.status(200).json({ msg: 'Added To Cart' })
    }

    catch (err) {
        res.status(400).json({ err: err.message })
    }
}

const getCart = async (req, res) => {

    try {
        const userId = req.user.id
        const cart = await Cart.findAll({ where: { userId }, include: [{ model: Product }] })
        res.json(cart)
    }

    catch (err) {
        res.status(400).json({ err: err.message })
    }
}

const removeFromCart = async (req, res) => {

    try {
        const userId = req.user.id
        const { id } = req.params
        await Cart.destroy({ where: { id, userId } })
        res.status(200).json({ msg: 'Item Removed From Cart' })
    }

    catch (err) {
        res.status(400).json({ err: err.message })
    }
}

const clearCart = async (req, res) => {

    try{
        const userId = req.user.id
        await Cart.destroy({ where : { userId } })

        res.status(200).json({ msg : "Cart Cleared" })

    } catch (err) {
        res.status(500).json({ err : err.message })
    }
}

const updateQuantity = async (req, res) => {

    try {
        const userId = req.user.id
        const { id } = req.params
        const { quantity } = req.body

        if (quantity < 1) {
            return res.status(400).json({ msg: 'Quantity Must Be Atleast 1' })
        }

        const cartItems = await Cart.findOne({ where: { id, userId } })
        if (!cartItems) {
            return res.status(404).json({ msg: 'Cart Item Not Founds' })
        }

        cartItems.quantity = quantity
        await cartItems.save()

        res.status(200).json({ msg: 'Quantity Updated' })
    }

    catch (err) {
        res.status(400).json({ err: err.message })
    }
}


module.exports = {addToCart, removeFromCart, clearCart, getCart, updateQuantity}