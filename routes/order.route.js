const express = require('express')
const {createOrder, getOrders, totalOrders, calculateRevenue} = require('../controller/order.controller')
const updateLastActive = require('../middleware/updateLastActive')
const authenticateUser = require('../middleware/user.middleware')

const router = express.Router()

router.post('/', authenticateUser, updateLastActive, createOrder)
router.get('/', authenticateUser, updateLastActive, getOrders)
router.get('/total-orders', authenticateUser, updateLastActive, totalOrders)
router.get('/revenue', authenticateUser, updateLastActive, calculateRevenue)

module.exports = router
