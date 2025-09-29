const {addToCart, removeFromCart, getCart, updateQuantity, clearCart} = require('../controller/cart.controller')
const authenticateUser = require('../middleware/user.middleware')
const updateLastActive = require('../middleware/updateLastActive')
const express = require('express')

const router = express.Router()

router.post('/', authenticateUser, updateLastActive, addToCart)
router.get('/', authenticateUser, updateLastActive, getCart)
router.delete('/', authenticateUser, updateLastActive, clearCart)
router.delete('/:id', authenticateUser, updateLastActive, removeFromCart)
router.put('/:id', authenticateUser, updateLastActive, updateQuantity)

module.exports = router