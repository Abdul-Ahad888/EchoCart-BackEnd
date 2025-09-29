const {addToWishlist, getWishlist, removeWishlist} = require('../controller/wishlist.controller')
const authenticateUser = require('../middleware/user.middleware')
const updateLastActive = require('../middleware/updateLastActive')

const express = require('express')
const router = express.Router()

router.post('/', authenticateUser, updateLastActive, addToWishlist)
router.get('/', authenticateUser, updateLastActive, getWishlist)
router.delete('/:productId', authenticateUser, updateLastActive, removeWishlist)

module.exports = router