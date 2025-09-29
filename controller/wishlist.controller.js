const Wishlist = require("../model/wishlist.model")
const Product = require("../model/product.model")

const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body
        const userId = req.user.id

        const existing = await Wishlist.findOne({ where: { productId, userId } })
        if (existing) {
            return res.status(400).json({ msg: "product already wishlisted" })
        }

        const item = await Wishlist.create({ userId, productId })
        res.json(item)
    }
    catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const removeWishlist = async (req, res) => {
    try {
        const { productId } = req.params
        const userId = req.user.id

        await Wishlist.destroy({ where: { userId, productId } })
        res.status(200).json({ msg: "product removed from wishlist" })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}


const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id
        const wishlist = await Wishlist.findAll({ where: { userId }, include: [Product] })
        res.json(wishlist)
    }

    catch (err) {
        res.status(500).json({ err: err.message })
    }
}


module.exports = { addToWishlist, removeWishlist, getWishlist }